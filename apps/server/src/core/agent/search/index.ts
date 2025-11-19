import {
  IChatInputMessage,
  IStreamHandler,
  IChatResponse,
  IProviderItemConfig,
  ProviderType
} from '../../../interface.js';
import { ESearXNGCategory, ISearchResponseResult, ISearXNGOptions, SearchFunc, TSearchEngine } from '../../search/index.js';
import { getProviderClient } from '../../llm/index.js';
import { IChatOptions } from '../../llm/openai.js';
import { getSearchEngine } from '../../search/utils.js';
import { logger, replaceVariable } from '../../../utils/index.js';
import { StandardResponsePrompt } from './prompt.js';
import { getCurrentDate } from '../utils.js';
import Models from '../../../model.json';
import { SearchGraph, EGraphEvent } from './graph.js';
import { SearcherFunction, SearchResultItem } from '../types.js';
import { HumanMessage } from 'langchain';

interface ISearchChatOptions {
  engine?: TSearchEngine
  model?: string
  intentModel?: string
  provider?: string
}

interface IChatParams {
  messages: IChatInputMessage[]
  systemPrompt?: string
  temperature?: number
  searchOptions?: {
    categories?: ESearXNGCategory[]
    language?: string
  }
}

const models = Models as IProviderItemConfig[];

// const CACHE_NAME = 'search_with_ai';

export class SearchChat {
  private search: SearchFunc;
  private createChat: (options: IChatOptions, onMessage?: IStreamHandler) => Promise<IChatResponse>;
  private model: string;
  private intentModel?: string;
  // private engine: TSearchEngine;
  private apiKey?: string;
  private baseURL?: string;
  private apiType?: ProviderType;

  constructor(params?: ISearchChatOptions) {
    const { engine = 'SEARXNG', model, intentModel, provider } = params || {};
    if (!model) throw new Error('[RAG] model is required');
    if (!provider) throw new Error('[RAG] provider is required');
    const providerInfo = models.find(item => item.provider === provider);
    if (!providerInfo) throw new Error(`[RAG] provider ${provider} not found`);
    const { apiKey, baseURL } = providerInfo;
    const client = getProviderClient(provider, apiKey, baseURL);
    this.createChat = client.chat.bind(client);
    this.model = model;
    this.intentModel = intentModel;
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.apiType = providerInfo.type;
    // this.engine = engine;
    this.search = getSearchEngine(engine);
  }

  /**
   * Create a SearcherFunction adapter for SearchGraph
   */
  private createSearcher(options?: Partial<ISearXNGOptions>): SearcherFunction {
    return async ({ query, count }) => {
      const results = await this.search(query, options);
      return results.slice(0, count).map((item, index) => ({
        id: index,
        title: String(item.name || ''),
        content: String(item.snippet || ''),
        url: item.url,
        score: typeof item.score === 'number' ? item.score : undefined,
        raw: item
      }));
    };
  }

  public async chat(options: IChatParams, onMessage?: IStreamHandler) {
    const { model, intentModel } = this;
    const { messages, systemPrompt, temperature, searchOptions } = options;
    const { language = 'auto', categories = [ESearXNGCategory.GENERAL] } = searchOptions || {};
    let contexts: ISearchResponseResult[] = [];

    try {
      // Initialize SearchGraph with searcher adapter
      const { apiKey, baseURL } = this;
      const searchGraph = new SearchGraph({
        model,
        intentModel,
        searcher: this.createSearcher({
          categories,
          language
        })
      }, {
        type: this.apiType,
        apiKey: apiKey || '',
        baseURL
      });
      // Use SearchGraph for intelligent search workflow
      const graph = searchGraph.compile();
      const langchainMessages = messages.map(msg => new HumanMessage(msg.content));

      const chunks = await graph.stream(
        { messages: langchainMessages },
        {
          configurable: {
            numberOfQueries: 2,
            count: 10
          },
          streamMode: 'updates'
        }
      );
      let shouldSearch = false;

      for await (const chunk of chunks) {
        const res = chunk as any;
        if (res.intentAnalysis) {
          shouldSearch = res.intentAnalysis?.shouldSearch;
        }
        if (res.rewriteQuery) {
          onMessage?.({ content: res.rewriteQuery.rationale + '\n\n' });
          if (!res.rewriteQuery.query || res.rewriteQuery.query.length === 0) continue;
          const md = '```Web Search\n' + res.rewriteQuery.query.join(', ') + '\n```\n\n';
          onMessage?.({ content: md });
        }
        if (res.search) {
          const result: SearchResultItem[] = res.search.searchResults || [];
          contexts = result.map((item, index) => ({
            id: index + 1,
            name: item.title,
            content: item.content,
            snippet: item.content,
            url: item.url || '',
            score: item.score,
            raw: item.raw
          }));
          let md = 'No search results found.\n\n';
          if (contexts.length > 0) md = '```Search Results (' + contexts.length + ')\n' +
            contexts.map(c => c.id + '. ' + c.name.slice(0, 80)).join('\n') +
            '\n```\n\n';
          onMessage?.({ content: md });
          onMessage?.({ event: EGraphEvent.Search, searchResults: contexts });
        }
      }

      // If no search needed, respond directly
      if (!shouldSearch) {
        await this.createChat({
          messages,
          model,
          temperature,
          system: systemPrompt
        }, (msg) => {
          onMessage?.(msg);
        });
        onMessage?.(null, true);
        return;
      }

    } catch (error) {
      logger.error('SearchGraph Error:', error);
      throw error;
    }

    const userRawQuery = messages[messages.length - 1]?.content || '';

    // Image search (keep original logic)
    // let images: Record<string, any>[] = [];
    // if (this.engine === 'SEARXNG') {
    //   const res = await this.search(userRawQuery, categories, language);
    //   const engines = process.env.SEARXNG_IMAGES_ENGINES ? process.env.SEARXNG_IMAGES_ENGINES.split(',') : [];

    //   images = res.filter(item => {
    //     if (!item.thumbnail) return false;
    //     if (engines.length > 0)
    //       return engines.some(engine => item.engine?.includes(engine));
    //     return item.engine?.includes('bing') || item.engine?.includes('google');
    //   });
    // }

    // for (const image of images) {
    //   onMessage?.({ image });
    // }

    for (const context of contexts) {
      onMessage?.({ context });
    }

    const { messages: extendedMessages } = this.extendUserMessage(userRawQuery, contexts);

    await this.createChat({
      messages: extendedMessages,
      model,
      temperature,
      system: systemPrompt
    }, (msg) => {
      onMessage?.(msg);
    });

    onMessage?.(null, true);
  }

  // private async getFullSearchResult(results: ISearchResponseResult[]) {
  //   const urls = results.map(item => item.url);
  //   const fullContexts = await jinaUrlsReader({ urls });
  //   return fullContexts;
  // }


  private extendUserMessage(query: string, contexts: ISearchResponseResult[]) {
    const context = contexts.map(
      (item, index) => `[[citation:${index + 1}]] ${item.content || item.snippet}`
    ).join('\n\n');

    const system = replaceVariable(StandardResponsePrompt, {
      quote: context,
      date: getCurrentDate(),
      question: query
    });
    const messages: IChatInputMessage[] = [
      {
        role: 'user',
        content: `${system} ${query}`
      }
    ];

    return {
      messages
    };
  }
}
