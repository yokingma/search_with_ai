import {
  addMessages,
  Annotation,
  END,
  START,
  StateGraph,
} from '@langchain/langgraph';
import type { BaseMessageLike } from '@langchain/core/messages';
import { ChatOpenAI, ClientOptions } from '@langchain/openai';
import { AnthropicInput, ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { createAgent, toolStrategy } from 'langchain';
import { getCurrentDate, getResearchTopic } from '../utils.js';
import { QueryWriterPrompt, ShouldSearchPrompt } from './prompt.js';
import { RunnableConfig } from '@langchain/core/runnables';
import { SearcherFunction, SearchResultItem } from '../types.js';
import { replaceVariable } from '../../../utils/index.js';
import * as z from 'zod';

export interface GraphClientOptions extends ClientOptions {
  apiKey?: string;
  type?: 'openai' | 'anthropic' | 'gemini' | 'vertexai';
  temperature?: number;
}
export type GraphResult = typeof StateAnnotation.State;
export enum EGraphEvent {
  IntentAnalysis = 'intentAnalysis',
  RewriteQuery = 'rewriteQuery',
  Search = 'search',
}

class GraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GraphError';
  }
}

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessageLike[]>({
    reducer: addMessages,
    default: () => [],
  }),
  query: Annotation<string[]>(),
  searchResults: Annotation<SearchResultItem<unknown>[]>(),
  shouldSearch: Annotation<boolean>(),
  rationale: Annotation<string>(),
});

// LangGraph运行时的配置
const ConfigurationSchema = z.object({
  numberOfQueries: z
    .number()
    .describe('The number of search queries to generate')
    .default(3),
  count: z
    .number()
    .describe('The number of search results to return')
    .default(10),
});

const RewriteOutputSchema = z.object({
  rationale: z
    .string()
    .describe(
      'A brief explanation of why these queries are relevant to the research topic.'
    ),
  query: z
    .array(z.string())
    .describe('A list of search queries to be used for research.'),
});

const ShouldContinueOutputSchema = z.object({
  should_search: z.boolean().describe('Whether to continue search.'),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
export type RewriteOutput = z.infer<typeof RewriteOutputSchema>;

export class SearchGraph {
  private options: GraphClientOptions;
  private searcher: SearcherFunction;
  private intentModel?: string;
  private model: string;

  /**
   * @param model 意图识别和问题重写的model
   * @param options 兼容OpenAI SDK的配置（KEY & BaseURL）
   */
  constructor(
    { model, intentModel, searcher }: { model: string; intentModel?: string; searcher: SearcherFunction },
    options: GraphClientOptions
  ) {
    this.options = options;
    this.intentModel = intentModel;
    this.model = model;
    this.searcher = searcher;
  }

  createClient(model?: string) {
    const { apiKey, type, baseURL, temperature = 0, ...rest } = this.options;
    const { model: defaultModel } = this;
    switch (type) {
      case 'anthropic': {
        // Gemini model via OpenAI-compatible API
        const options: AnthropicInput & BaseChatModelParams = {
          model: model ?? defaultModel,
          temperature,
          anthropicApiKey: apiKey,
          ...rest,
        };
        if (baseURL) {
          options.anthropicApiUrl = baseURL;
        }
        return new ChatAnthropic(options);
      }
      case 'gemini':
        // Gemini model via OpenAI-compatible API
        return new ChatGoogleGenerativeAI({
          model: model ?? defaultModel,
          temperature,
          apiKey,
          baseUrl: baseURL || undefined,
          ...rest,
        });
      case 'vertexai':
        return new ChatVertexAI({
          model: model ?? defaultModel,
          temperature,
          apiKey,
          ...rest,
        });
      case 'openai':
      default:
        return new ChatOpenAI({
          model: model ?? defaultModel,
          temperature,
          openAIApiKey: apiKey,
          configuration: {
            apiKey,
            baseURL,
            ...rest,
          }
        });
    }
  }

  compile() {
    const workflow = new StateGraph(StateAnnotation, ConfigurationSchema);

    workflow.addNode(EGraphEvent.IntentAnalysis, this.intentAnalysis.bind(this));
    workflow.addNode(EGraphEvent.RewriteQuery, this.rewriteQuery.bind(this));
    workflow.addNode(EGraphEvent.Search, this.search.bind(this));

    // Start to intent analysis
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflow.addEdge(START, EGraphEvent.IntentAnalysis);

    // Conditional branch for intent analysis
    workflow.addConditionalEdges(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      EGraphEvent.IntentAnalysis,
      this.routeToSearch.bind(this),
      [EGraphEvent.RewriteQuery, END]
    );

    // Conditional branch after query rewriting, used for parallel searches
    workflow.addConditionalEdges(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      EGraphEvent.RewriteQuery,
      this.continueToSearch.bind(this),
      [EGraphEvent.Search, END]
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workflow.addEdge(EGraphEvent.Search, END);

    return workflow.compile({ name: 'WebSearch' });
  }

  /**
   * Determine if the user's input requires web search to provide an accurate and up-to-date response.
   */
  async intentAnalysis(
    state: typeof StateAnnotation.State
  ): Promise<Partial<typeof StateAnnotation.State>> {
    const { intentModel } = this;
    const { messages } = state;
    const userInput = messages[messages.length - 1];
    const topic = getResearchTopic([userInput]);
    const client = this.createClient(intentModel);
    const agent = createAgent({
      model: client,
      tools: [],
      responseFormat: toolStrategy(ShouldContinueOutputSchema, {
        toolMessageContent: 'Decide whether to search the web based on the user input.',
      }),
    });

    const userMessage = [
      { role: 'user', content: `${ShouldSearchPrompt}\nUser input: ${topic}\n` }
    ];

    try {
      const result = await agent.invoke({
        messages: userMessage,
      });
      return {
        shouldSearch: result.structuredResponse.should_search,
      };
    } catch (error) {
      console.log('Intent analysis error:', error);
      throw new GraphError(`Intent analysis failed: ${error}`);
    }
  }

  /**
   * Routing function to determine whether to continue searching
   */
  routeToSearch(state: typeof StateAnnotation.State): string {
    return state.shouldSearch ? EGraphEvent.RewriteQuery : END;
  }

  /**
   * Rewrite the user's input to a list of search queries.
   */
  async rewriteQuery(
    state: typeof StateAnnotation.State,
    config: RunnableConfig<Configuration>
  ): Promise<Partial<typeof StateAnnotation.State>> {
    const { intentModel } = this;
    const messages = state.messages;
    const { numberOfQueries = 3 } = config.configurable ?? {};

    const topic = getResearchTopic(messages);
    const currentDate = getCurrentDate();

    try {
      const client = this.createClient(intentModel);
      const agent = createAgent({
        model: client,
        tools: [],
        responseFormat: toolStrategy(RewriteOutputSchema, {
          toolMessageContent: `I will generate ${numberOfQueries} search queries based on your input.`,
        }),
      });

      const prompt = replaceVariable(
        QueryWriterPrompt,
        {
          user_input: topic,
          number_queries: numberOfQueries,
          current_date: currentDate,
        }
      );


      const result = await agent.invoke({
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      return {
        query: result.structuredResponse.query,
        rationale: result.structuredResponse.rationale,
      };
    } catch (error) {
      throw new GraphError(`Query rewriting failed: ${error}`);
    }
  }

  async search(
    state: typeof StateAnnotation.State,
    config: RunnableConfig<Configuration>
  ): Promise<Partial<typeof StateAnnotation.State>> {
    const { query } = state;
    const { count = 10 } = config.configurable ?? {};

    // Execute all search queries in parallel
    const searchPromises = query.map(async query => {
      return await this.searcher({ query, count });
    });

    const searchResultsArrays = await Promise.all(searchPromises);

    return {
      searchResults: searchResultsArrays.flat(),
    };
  }

  /**
   * Conditional routing function
   */
  continueToSearch(state: typeof StateAnnotation.State) {
    return state.query.length > 0 ? EGraphEvent.Search : END;
  }
}
