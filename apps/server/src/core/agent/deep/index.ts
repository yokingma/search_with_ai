import {
  DeepResearch,
  type SearcherFunction,
  NodeEnum,
  HumanMessage,
  AIMessage
} from 'deepsearcher';
import {
  IChatInputMessage,
  IStreamHandler,
  IProviderItemConfig,
} from '../../../interface.js';
import { ESearXNGCategory, SearchFunc, TSearchEngine } from '../../search/index.js';
import { getSearchEngine } from '../../search/utils.js';
import Models from '../../../model.json' with { type: 'json' };

interface IDeepResearchOptions {
  engine?: TSearchEngine
  model?: string
  intentModel?: string
  provider?: string
}

interface IChatParams {
  messages: IChatInputMessage[]
  searchOptions?: {
    categories?: ESearXNGCategory[]
    language?: string
  }
}

const models = Models as IProviderItemConfig[];

export class DeepResearchAgent {
  private search: SearchFunc;
  private model: string;
  private intentModel?: string;
  private apiKey?: string;
  private baseURL?: string;

  constructor(params?: IDeepResearchOptions) {
    const { engine = 'SEARXNG', model, intentModel, provider } = params || {};
    if (!model) throw new Error('[DeepResearch] model is required');
    if (!provider) throw new Error('[DeepResearch] provider is required');

    const providerInfo = models.find(item => item.provider === provider);
    if (!providerInfo) throw new Error(`[DeepResearch] provider ${provider} not found`);

    this.model = model;
    this.intentModel = intentModel;
    this.apiKey = providerInfo.apiKey;
    this.baseURL = providerInfo.baseURL;
    this.search = getSearchEngine(engine);
  }

  private createSearcher(options?: any): SearcherFunction {
    return async ({ query }) => {
      const results = await this.search(query, options);
      // Map results to what deepsearcher expects
      return results.slice(0, 10).map((item, index) => ({
        id: String(index + 1),
        title: item.name || '',
        content: String(item.snippet || item.content || ''),
        url: item.url,
        score: typeof item.score === 'number' ? item.score : undefined
      }));
    };
  }

  public async chat(options: IChatParams, onMessage?: IStreamHandler) {
    const { messages, searchOptions } = options;
    const { language = 'auto', categories = [ESearXNGCategory.GENERAL] } = searchOptions || {};

    const searcher = this.createSearcher({
      categories,
      language
    });

    const deepResearch = new DeepResearch({
      searcher,
      options: {
        apiKey: this.apiKey,
        baseURL: this.baseURL,
      }
    });

    const agent = await deepResearch.compile();

    const langchainMessages = messages.map(msg => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      } else if (msg.role === 'assistant') {
        return new AIMessage(msg.content);
      }
      return new HumanMessage(msg.content); // Fallback for system or other roles
    });

    const eventStream = await agent.stream(
      {
        messages: langchainMessages,
      },
      {
        streamMode: 'messages',
        configurable: {
          queryGeneratorModel: this.intentModel || this.model,
          reflectionModel: this.intentModel || this.model,
          answerModel: this.model,
          numberOfInitialQueries: 2,
          maxResearchLoops: 1,
        },
      }
    );

    for await (const [msg, metadata] of eventStream) {
      switch (metadata.langgraph_node) {
        case NodeEnum.GenerateQuery:
          onMessage?.({ content: msg.content, node: metadata.langgraph_node });
          break;
        case NodeEnum.Research:
          onMessage?.({ content: msg.content, node: metadata.langgraph_node });
          break;
        case NodeEnum.Reflection:
          onMessage?.({ content: msg.content, node: metadata.langgraph_node });
          break;
        case NodeEnum.FinalizeAnswer:
          onMessage?.({ content: msg.content, node: metadata.langgraph_node });
          break;
        default:
          break;
      }
    }

    onMessage?.(null, true);
  }
}
