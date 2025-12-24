import { Send, START, END, StateGraph } from '@langchain/langgraph';
import { RunnableConfig } from '@langchain/core/runnables';
import { ChatOpenAI, type ClientOptions } from '@langchain/openai';
import { AnthropicInput, ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { AIMessage, createAgent, HumanMessage, toolStrategy } from 'langchain';
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
import { getCitations, getCurrentDate, getResearchTopic, replaceVariable } from './utils.js';

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

export interface DeepResearchOptions extends ClientOptions {
  type?: 'openai' | 'anthropic' | 'gemini' | 'vertexai';
  systemPrompt?: string;
  temperature?: number;
  /**
   * Enable URL format in citations (default: true)
   * - true: output format is <sup>[[id](url)]</sup>
   * - false: output format is [[citation:id]]
   */
  enableCitationUrl?: boolean;
}

export class DeepResearch {
  private readonly options?: DeepResearchOptions;
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
    options?: DeepResearchOptions;
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
    const { numberOfInitialQueries, queryGeneratorModel } = configuration;
    const { systemPrompt = 'You are a helpful research assistant.', temperature = 0.1 } = this.options || {};

    const topic = getResearchTopic(state.messages);
    const currentDate = getCurrentDate();

    const client = this.createClient(queryGeneratorModel, temperature);
    const agent = createAgent({
      model: client,
      tools: [],
      systemPrompt,
      responseFormat: toolStrategy(SearchQueryListSchema, {
        toolMessageContent: `I will generate ${numberOfInitialQueries} search queries based on your input.`,
      }),
    });

    const prompt = replaceVariable(
      queryWriterInstructions,
      {
        number_queries: numberOfInitialQueries,
        current_date: currentDate,
        research_topic: topic,
      }
    );

    try {
      const result = await agent.invoke({
        messages: [
          new HumanMessage(prompt),
        ]
      }, {
        tags: [NodeEnum.GenerateQuery]
      });

      // Ensure a valid query list is returned
      const queryList = result.structuredResponse?.query || [];
      if (queryList.length === 0) {
        console.warn(
          'LLM returned empty query list, using original topic as fallback'
        );
        return { generatedQueries: [topic] };
      }

      return { generatedQueries: queryList, rationale: result.structuredResponse?.rationale };
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
      (query, idx) => new Send(NodeEnum.Research, { query, id: idx.toString(), loopIndex: 1 })
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
    const { temperature = 0.1, enableCitationUrl = true } = this.options || {};

    const searchResults = await this.searcher(state);
    const formattedSearchResults = searchResults
      .map(
        ({ title, content, date, score }, index) =>
          `[[${index + 1}]]. Title: ${title}\nContent: ${content}\nDate: ${
            date ?? 'N/A'
          }\nConfidence Score: ${score ?? 'N/A'}`
      )
      .join('\n\n');

    const client = this.createClient(queryGeneratorModel, temperature);
    const agent = createAgent({
      model: client,
      tools: [],
    });

    const prompt = replaceVariable(
      searcherInstructions,
      {
        current_date: getCurrentDate(),
        research_topic: state.query,
        search_results: formattedSearchResults,
      }
    );

    const result = await agent.invoke({
      messages: [
        new HumanMessage(prompt),
      ]
    }, {
      tags: [NodeEnum.Research]
    });

    // Extract the AI message content from the agent result
    const lastMessage = result.messages[result.messages.length - 1];

    // Return content and referenced indexes, content contains citation marks with URL
    const { content, segmentIndexes } = getCitations(lastMessage, searchResults, enableCitationUrl);

    const usedSources = searchResults.filter((_, index) =>
      segmentIndexes.includes(`${index + 1}`)
    );

    return {
      sourcesGathered: usedSources,
      searchedQueries: [state.query],
      researchResult: [content],
      researchLoopCount: state.loopIndex,
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
    const { temperature = 0.1 } = this.options || {};

    // const researchLoopCount = (state.researchLoopCount ?? 0) + 1;

    const researchTopic = getResearchTopic(state.messages);
    const summaries = state.researchResult.join('\n\n');

    const client = this.createClient(reflectionModel, temperature);
    const agent = createAgent({
      model: client,
      tools: [],
      responseFormat: toolStrategy(ReflectionSchema, {
        toolMessageContent: 'I will analyze the research summaries and determine if more information is needed.',
      }),
    });

    const prompt = replaceVariable(
      reflectionInstructions,
      {
        research_topic: researchTopic,
        summaries,
        number_queries: numberOfInitialQueries,
      }
    );

    try {
      const result = await agent.invoke({
        messages: [
          new HumanMessage(prompt),
        ]
      }, {
        tags: [NodeEnum.Reflection]
      });

      const structuredResponse = result.structuredResponse;

      return {
        // researchLoopCount,
        reflectionState: {
          isSufficient: structuredResponse?.isSufficient ?? true,
          knowledgeGap: structuredResponse?.knowledgeGap ?? '',
          followUpQueries: structuredResponse?.followUpQueries || [],
          numberOfRanQueries: state.searchedQueries.length,
        }
      };
    } catch (error) {
      console.error('Failed to generate reflection:', error);
      // if reflection fails, return default value
      return {
        // researchLoopCount,
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
          loopIndex: researchLoopCount + 1,
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
    const { systemPrompt = 'You are a helpful research assistant.', temperature = 0.1, enableCitationUrl = true } = this.options || {};

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

    const client = this.createClient(model, temperature);
    const agent = createAgent({
      model: client,
      tools: [],
      systemPrompt,
    });

    const prompt = replaceVariable(
      answerInstructions,
      {
        research_topic: researchTopic,
        summaries,
        current_date: currentDate,
      }
    );

    const result = await agent.invoke({
      messages: [
        new HumanMessage(prompt),
      ],
    }, {
      tags: [NodeEnum.FinalizeAnswer],
    });

    // Extract the AI message content from the agent result
    const lastMessage = result.messages[result.messages.length - 1];
    const messageContent = typeof lastMessage.content === 'string' 
      ? lastMessage.content 
      : JSON.stringify(lastMessage.content);

    const sourcesGathered: SearchResultItem[] = [];
    for (const source of state.sourcesGathered) {
      let isIncluded = false;

      if (enableCitationUrl) {
        // Check for URL citation formats when enableCitationUrl is true
        const citationWithUrl = `<sup>[[${source.id}](${source.url})]</sup>`;
        const citationWithoutUrl = `<sup>[[${source.id}]]</sup>`;
        isIncluded = messageContent.includes(citationWithUrl) || messageContent.includes(citationWithoutUrl);
      } else {
        // Check for simple citation format when enableCitationUrl is false
        const simpleCitation = `[[citation:${source.id}]]`;
        isIncluded = messageContent.includes(simpleCitation);
      }

      if (isIncluded) {
        sourcesGathered.push(source);
      }
    }

    return {
      messages: [new AIMessage(messageContent)],
      sourcesGathered,
    };
  }

  private createClient(model: string, temperature = 0.1) {
    const { apiKey, type = 'openai', baseURL, ...rest } = this.options || {};
    switch (type) {
      case 'anthropic': {
        const options: AnthropicInput = {
          model: model,
          anthropicApiKey: apiKey as string,
          temperature,
          ...rest,
        };
        if (baseURL) {
          options.anthropicApiUrl = baseURL;
        }
        return new ChatAnthropic(options);
      }
      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: model,
          apiKey: apiKey as string,
          baseUrl: baseURL || undefined,
          temperature,
          ...rest,
        });
      case 'vertexai':
        return new ChatVertexAI({
          model: model,
          apiKey: apiKey as string,
          temperature,
          ...rest,
        });
      case 'openai':
      default:
        return new ChatOpenAI({
          model: model,
          openAIApiKey: apiKey,
          temperature,
          configuration: {
            apiKey,
            baseURL,
            ...rest,
          }
        });
    }
  }
}
