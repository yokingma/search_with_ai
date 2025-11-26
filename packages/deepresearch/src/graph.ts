import { Send, START, END, StateGraph } from '@langchain/langgraph';
import { RunnableConfig, RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI, type ClientOptions } from '@langchain/openai';
import { ReflectionSchema, SearchQueryListSchema } from './schema.js';
import {
  OverallAnnotation,
  OutputAnnotation,
  ResearchState,
} from './state.js';
import {
  Configuration,
  ConfigurationSchema,
  getConfigurationFromRunnableConfig,
} from './configuration.js';
import {
  answerInstructions,
  queryWriterInstructions,
  reflectionInstructions,
  searcherInstructions,
} from './prompts.js';
import { SearcherFunction, SearchResultItem } from './types.js';
import { getCitations, getCurrentDate, getResearchTopic } from './utils.js';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AIMessage } from 'langchain';
import { StructuredOutputParser } from '@langchain/core/output_parsers';

export enum NodeEnum {
  GenerateQuery = 'generate_query',
  Research = 'research',
  Reflection = 'reflection',
  FinalizeAnswer = 'finalize_answer',
}

export enum EventStreamEnum {
  ChatModelStart = 'on_chat_model_start',
  ChatModelStream = 'on_chat_model_stream',
  ChatModelEnd = 'on_chat_model_end',
}

export class DeepResearch {
  private readonly options?: ClientOptions;
  private readonly searcher: SearcherFunction;

  /**
   * @param searcher - The function to use for searching
   * @param options - The options for the Runnable, including LLM provider settings
   */
  constructor({
    searcher,
    options,
  }: {
    searcher: SearcherFunction;
    options?: ClientOptions;
  }) {
    this.searcher = searcher;
    this.options = options;
  }

  async compile() {
    const workflow = new StateGraph(OverallAnnotation, ConfigurationSchema);

    workflow.addNode(NodeEnum.GenerateQuery, this.generateQuery.bind(this));
    workflow.addNode(NodeEnum.Research, this.research.bind(this), {
      input: ResearchState,
    });
    workflow.addNode(NodeEnum.Reflection, this.reflection.bind(this));
    workflow.addNode(NodeEnum.FinalizeAnswer, this.finalizeAnswer.bind(this));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflow.addEdge(START, NodeEnum.GenerateQuery);

    workflow.addConditionalEdges(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      NodeEnum.GenerateQuery,
      this.continueToSearch.bind(this),
      [NodeEnum.Research]
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflow.addEdge(NodeEnum.Research, NodeEnum.Reflection);

    workflow.addConditionalEdges(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      NodeEnum.Reflection,
      this.evaluateResearch.bind(this),
      [NodeEnum.Research, NodeEnum.FinalizeAnswer]
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflow.addEdge(NodeEnum.FinalizeAnswer, END);

    return workflow.compile({ name: 'DeepResearch' });
  }

  /**
   * LangGraph node that generates a search queries based on the User's question.
   * Create an optimized search query for research based on the User's question.
   * @param state - Overall graph state
   * @param config - Configuration for the Runnable
   */
  private async generateQuery(
    state: typeof OverallAnnotation.State,
    config: RunnableConfig<Configuration>
  ): Promise<Partial<typeof OverallAnnotation.State>> {
    const configuration = getConfigurationFromRunnableConfig(config);
    const { numberOfInitialQueries } = configuration;

    const llm = new ChatOpenAI({
      model: configuration.queryGeneratorModel,
      temperature: 1.0,
      configuration: this.options,
      maxRetries: 2,
      apiKey: this.options?.apiKey,
    }).withConfig({
      tags: [NodeEnum.GenerateQuery],
    });

    const topic = getResearchTopic(state.messages);
    const currentDate = getCurrentDate();

    const prompt = ChatPromptTemplate.fromTemplate(queryWriterInstructions);
    const parser = StructuredOutputParser.fromZodSchema(SearchQueryListSchema);
    const chain = RunnableSequence.from([prompt, llm, parser]);

    try {
      const result = await chain.invoke({
        number_queries: numberOfInitialQueries,
        current_date: currentDate,
        research_topic: topic,
        format_instructions: parser.getFormatInstructions(),
      });

      // Ensure a valid query list is returned
      const queryList = result.query || [];
      if (queryList.length === 0) {
        console.warn(
          'LLM returned empty query list, using original topic as fallback'
        );
        return { generatedQueries: [topic] };
      }

      return { generatedQueries: queryList };
    } catch (error) {
      console.error('Failed to generate search queries:', error);
      console.warn('Using original topic as fallback due to LLM failure');
      return { generatedQueries: [topic] };
    }
  }

  /**
   * LangGraph routing function that sends search queries to research nodes.
   * This is used to spawn n number of research nodes, one for each search query.
   * @param state - Overall graph state
   */
  private async continueToSearch(state: typeof OverallAnnotation.State) {
    const queryList = state.generatedQueries || [];

    if (queryList.length === 0) {
      const topic = getResearchTopic(state.messages);
      return [new Send(NodeEnum.Research, { query: topic, id: '0' })];
    }

    return queryList.map(
      (query, idx) => new Send(NodeEnum.Research, { query, id: idx.toString() })
    );
  }

  /**
   * LangGraph node that performs research based on the search query.
   * @param state - Research graph state
   * @param config - Configuration for the Runnable
   */
  private async research(
    state: typeof ResearchState.State,
    config: RunnableConfig<Configuration>
  ): Promise<Partial<typeof OverallAnnotation.State>> {
    const configuration = getConfigurationFromRunnableConfig(config);
    const { queryGeneratorModel } = configuration;

    const searchResults = await this.searcher(state);
    const formattedSearchResults = searchResults
      .map(
        ({ title, content, date, score }, index) =>
          `[[${index + 1}]]. Title: ${title}\nContent: ${content}\nDate: ${
            date ?? 'N/A'
          }\nConfidence Score: ${score ?? 'N/A'}`
      )
      .join('\n\n');

    // use llm to process search results
    const llm = new ChatOpenAI({
      model: queryGeneratorModel,
      temperature: 0.2,
      maxRetries: 2,
      configuration: this.options,
      apiKey: this.options?.apiKey,
    }).withConfig({
      tags: [NodeEnum.Research],
    });

    const prompt = ChatPromptTemplate.fromTemplate(searcherInstructions);
    const chain = RunnableSequence.from([prompt, llm]);

    const result = await chain.invoke({
      current_date: getCurrentDate(),
      research_topic: state.query,
      search_results: formattedSearchResults,
    });

    // Return content and referenced indexes, content contains citation marks [title](id)
    const { content, segmentIndexes } = getCitations(result, searchResults);

    const usedSources = searchResults.filter((_, index) =>
      segmentIndexes.includes(`${index + 1}`)
    );

    return {
      sourcesGathered: usedSources,
      searchedQueries: [state.query],
      researchResult: [content],
    };
  }

  /**
   * LangGraph node that identifies knowledge gaps and generates potential follow-up queries.
   * Analyzes the current summary to identify areas for further research and generates
   * potential follow-up queries. Uses structured output to extract
   * the follow-up query in JSON format.
   */
  private async reflection(
    state: typeof OverallAnnotation.State,
    config: RunnableConfig<Configuration>
  ): Promise<Partial<typeof OverallAnnotation.State>> {
    const configuration = getConfigurationFromRunnableConfig(config);
    const { reflectionModel, numberOfInitialQueries } = configuration;

    const researchLoopCount = (state.researchLoopCount ?? 0) + 1;
    const model = reflectionModel;

    const researchTopic = getResearchTopic(state.messages);
    const summaries = state.researchResult.join('\n\n');

    const llm = new ChatOpenAI({
      model,
      temperature: 0,
      maxRetries: 2,
      configuration: this.options,
      apiKey: this.options?.apiKey,
    }).withConfig({
      tags: [NodeEnum.Reflection],
    });

    const prompt = ChatPromptTemplate.fromTemplate(reflectionInstructions);
    const parser = StructuredOutputParser.fromZodSchema(ReflectionSchema);
    const chain = RunnableSequence.from([prompt, llm, parser]);

    try {
      const result = await chain.invoke({
        research_topic: researchTopic,
        summaries,
        number_queries: numberOfInitialQueries,
        format_instructions: parser.getFormatInstructions(),
      });

      return {
        researchLoopCount,
        reflectionState: {
          isSufficient: result.isSufficient,
          knowledgeGap: result.knowledgeGap,
          followUpQueries: result.followUpQueries || [],
          numberOfRanQueries: state.searchedQueries.length,
        }
      };
    } catch (error) {
      console.error('Failed to generate reflection:', error);
      // if reflection fails, return default value
      return {
        researchLoopCount,
        reflectionState: {
          isSufficient: true, // assume the research is sufficient
          knowledgeGap: 'Unable to analyze knowledge gaps',
          followUpQueries: [], // empty array, avoid subsequent errors
          numberOfRanQueries: state.searchedQueries.length,
        }
      };
    }
  }

  /**
   * LangGraph routing function that determines the next step in the research flow.
   * Controls the research loop by deciding whether to continue gathering information
   * or to finalize the summary based on the configured maximum number of research loops.
   */
  private async evaluateResearch(
    state: typeof OverallAnnotation.State,
    config: RunnableConfig<Configuration>
  ) {
    const { reflectionState, researchLoopCount } = state;
    const configuration = getConfigurationFromRunnableConfig(config);

    const maxResearchLoops = configuration.maxResearchLoops;

    const { followUpQueries = [], isSufficient, numberOfRanQueries } = reflectionState;

    if (researchLoopCount >= maxResearchLoops || isSufficient) {
      return NodeEnum.FinalizeAnswer;
    }

    // check followUpQueries is empty
    if (!followUpQueries || followUpQueries.length === 0) {
      console.warn(
        'No follow-up queries generated, proceeding to finalize answer'
      );
      return NodeEnum.FinalizeAnswer;
    }

    return followUpQueries.map(
      (query, index) =>
        new Send(NodeEnum.Research, {
          query,
          id: (numberOfRanQueries + index).toString(),
        })
    );
  }

  /**
   * LangGraph node that finalizes the answer based on the provided summaries.
   * @param state - Overall graph state
   * @param config - Configuration for the Runnable
   */
  private async finalizeAnswer(
    state: typeof OverallAnnotation.State,
    config: RunnableConfig<Configuration>
  ): Promise<typeof OutputAnnotation.State> {
    const configuration = getConfigurationFromRunnableConfig(config);
    const { reflectionModel } = configuration;

    const model = reflectionModel;
    const currentDate = getCurrentDate();
    const researchTopic = getResearchTopic(state.messages);
    const summaries = state.researchResult.join('\n\n');

    if (!summaries.trim()) {
      return {
        messages: [
          new AIMessage(
            'Sorry, no useful information was retrieved. Please try again later or ask a different question.'
          ),
        ],
        sourcesGathered: [],
      };
    }

    const llm = new ChatOpenAI({
      model,
      temperature: 0,
      maxRetries: 2,
      configuration: this.options,
      apiKey: this.options?.apiKey,
    }).withConfig({
      tags: [NodeEnum.FinalizeAnswer],
    });

    const prompt = ChatPromptTemplate.fromTemplate(answerInstructions);
    const chain = RunnableSequence.from([prompt, llm]);

    const result = await chain.invoke({
      current_date: currentDate,
      research_topic: researchTopic,
      summaries,
    });

    const sourcesGathered: SearchResultItem[] = [];
    for (const source of state.sourcesGathered) {
      const citation = `(${source.id})`;
      const textMsg = result.content as string;
      if (textMsg.includes(citation)) {
        sourcesGathered.push(source);
      }
    }

    return {
      messages: [new AIMessage(result.content as string)],
      sourcesGathered,
    };
  }
}
