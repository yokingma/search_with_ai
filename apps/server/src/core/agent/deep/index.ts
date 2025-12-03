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
  ProviderType,
} from '../../../interface.js';
import { ESearXNGCategory, SearchFunc, TSearchEngine } from '../../search/index.js';
import { getSearchEngine } from '../../search/utils.js';
import Models from '../../../model.json' with { type: 'json' };
import { extractStringFromMessageContent } from '../utils.js';
import { BaseMessage } from 'langchain';

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
  private providerType?: ProviderType;
  private totalSearchResults: number = 0;

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
    this.providerType = providerInfo.type;
    this.search = getSearchEngine(engine);
  }

  private createSearcher(options?: any): SearcherFunction {
    return async ({ query }: { query: string }) => {
      const results = await this.search(query, options);
      // Map results to what deepsearcher expects
      const start = this.totalSearchResults;
      this.totalSearchResults += results.length;
      return results.slice(0, 10).map((item, index) => ({
        id: String(start + index + 1),
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
        type: this.providerType,
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

    const chunks = await agent.stream(
      {
        messages: langchainMessages,
      },
      {
        streamMode: ['messages', 'updates'],
        configurable: {
          queryGeneratorModel: this.intentModel || this.model,
          reflectionModel: this.intentModel || this.model,
          answerModel: this.model,
          numberOfInitialQueries: 3,
          maxResearchLoops: 2,
        },
      }
    );

    for await (const [streamMode, chunk] of chunks) {
      if (streamMode === 'messages') {
        const [msg, metadata] = chunk;
        const tags: string[] = metadata.tags;
        if (tags.includes(NodeEnum.FinalizeAnswer)) {
          const content = extractStringFromMessageContent(msg as unknown as BaseMessage);
          onMessage?.({ content, role: 'assistant' });
        }
      }
      if (streamMode === 'updates') {
        console.log(chunk);
        const [step, result] = Object.entries(chunk)[0];
        switch (step) {
          case NodeEnum.GenerateQuery: {
            const queries = result.generatedQueries?.join(', ') || '';
            const rationale = result.rationale || '';
            onMessage?.({ content: `${rationale}\n\n > ${queries}\n\n`, role: 'assistant' });
            break;
          }
          case NodeEnum.Research: {
            const res = result.researchResult?.join('\n') || '';
            onMessage?.({ content: `${res}\n\n`, role: 'assistant' });
            break;
          }
          case NodeEnum.Reflection: {
            const res = result.reflectionState?.knowledgeGap || '';
            onMessage?.({ content: `> ${res} \n\n`, role: 'assistant' });
            break;
          }
          case NodeEnum.FinalizeAnswer: {
            const contexts = result.sourcesGathered?.map(item => {
              const format = {
                id: item.id,
                name: item.title,
                content: item.content,
                snippet: item.content,
                url: item.url || '',
                score: item.score,
                raw: item
              };
              return format;
            });
            contexts?.sort((a, b) => {
              const aId = Number(a.id);
              const bId = Number(b.id);
              return isNaN(bId - aId) ? 0 : aId - bId;
            });
            onMessage?.({ contexts, role: 'assistant', content: '' });
            break;
          }
          default:
            break;
        }
      }
    }

    onMessage?.(null, true);
  }
}
