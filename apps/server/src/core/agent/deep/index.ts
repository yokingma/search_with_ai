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
import { extractStringFromMessageContent, extractToolCalls } from '../utils.js';
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
          maxResearchLoops: 3,
        },
      }
    );

    for await (const [streamMode, chunk] of chunks) {
      if (streamMode === 'messages') {
        const [message, metadata] = chunk;
        const name: string[] = metadata.tags?.filter((item: string) => !item.startsWith('graph:step'));
        const toolCalls = extractToolCalls(message as unknown as BaseMessage);
        const renamedToolCalls = toolCalls.map(toolCall => {
          return {
            ...toolCall,
            name: name?.[0] ?? toolCall.name,
            status: toolCall.status ?? 'pending',
            result: toolCall.result ?? '',
            id: toolCall.id ?? `tool-${Math.random()}`,
            args: toolCall.args ?? {},
          };
        });
        if (renamedToolCalls.length > 0) {
          onMessage?.({ role: 'tool', toolCalls: renamedToolCalls, content: '' });
        }
        if (name.includes(NodeEnum.FinalizeAnswer)) {
          const content = extractStringFromMessageContent(message as unknown as BaseMessage);
          onMessage?.({ content, role: 'assistant' });
        }
      } else {
        const [step, result] = Object.entries(chunk)[0];
        switch (step) {
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
