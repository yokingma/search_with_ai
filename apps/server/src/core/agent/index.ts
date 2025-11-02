import {
  IChatInputMessage,
  IStreamHandler,
  IChatResponse,
  IProviderItemConfig
} from '../../interface';
import { ESearXNGCategory, ISearchResponseResult, SearchFunc, TSearchEngine } from '../search';
import { getProviderClient } from '../llm';
import { IChatOptions } from '../llm/openai';
import { getSearchEngine } from '../search/utils';
import { logger, replaceVariable } from '../../utils';
import { StandardResponsePrompt } from './prompt';
import { getCurrentDate } from './utils';
import Models from '../../model.json';
import { SearchGraph } from './graph';
import { SearcherFunction, SearchResultItem } from './types';
import { HumanMessage } from 'langchain';

interface ISearchChatOptions {
  engine?: TSearchEngine
  model?: string
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

// const CACHE_NAME = 'search_with_ai';

export class SearchChat {
  private search: SearchFunc;
  private createChat: (options: IChatOptions, onMessage?: IStreamHandler) => Promise<IChatResponse>;
  private model: string;
  private engine: TSearchEngine;
  private searchGraph: SearchGraph;

  constructor(params?: ISearchChatOptions) {
    const { engine = 'SEARXNG', model, provider } = params || {};
    if (!model) throw new Error('[RAG] model is required');
    if (!provider) throw new Error('[RAG] provider is required');
    const providerInfo = models.find(item => item.provider === provider);
    if (!providerInfo) throw new Error(`[RAG] provider ${provider} not found`);
    const { apiKey, baseURL } = providerInfo;

    const client = getProviderClient(provider, apiKey, baseURL);
    this.createChat = client.chat.bind(client);
    this.model = model;
    this.engine = engine;
    this.search = getSearchEngine(engine);

    // Initialize SearchGraph with searcher adapter
    this.searchGraph = new SearchGraph(
      { model, searcher: this.createSearcher() },
      { apiKey: apiKey || '', baseURL }
    );
  }

  /**
   * Create a SearcherFunction adapter for SearchGraph
   */
  private createSearcher(): SearcherFunction {
    return async ({ query, count }) => {
      const results = await this.search(query, [ESearXNGCategory.GENERAL], 'all');
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
    const { model } = this;
    const { messages, searchOptions } = options;
    const { language = 'all' } = searchOptions || {};

    // Use SearchGraph for intelligent search workflow
    const graph = this.searchGraph.compile();
    const langchainMessages = messages.map(msg => new HumanMessage(msg.content));

    let contexts: ISearchResponseResult[] = [];

    try {
      const result = await graph.invoke(
        { messages: langchainMessages },
        { configurable: { numberOfQueries: 2, count: 10 } } as any
      );
      // If no search needed, respond directly
      if (!result.shouldSearch) {
        await this.createChat({ messages, model }, (msg) => {
          onMessage?.(msg);
        });
        onMessage?.(null, true);
        return;
      }

      contexts = result.searchResults.map((item: SearchResultItem, index) => ({
        id: index + 1,
        name: item.title,
        content: item.content,
        snippet: item.content,
        url: item.url || '',
        score: item.score,
        raw: item.raw
      }));

    } catch (error) {
      logger.error('SearchGraph Error:', error);
      throw error;
    }

    // Image search (keep original logic)
    let images: Record<string, any>[] = [];
    if (this.engine === 'SEARXNG') {
      const searchQuery = messages[0]?.content || '';
      const res = await this.search(searchQuery, [ESearXNGCategory.IMAGES], language);
      const engines = process.env.SEARXNG_IMAGES_ENGINES ? process.env.SEARXNG_IMAGES_ENGINES.split(',') : [];

      images = res.filter(item => {
        if (!item.thumbnail) return false;
        if (engines.length > 0)
          return engines.some(engine => item.engine?.includes(engine));
        return item.engine?.includes('bing') || item.engine?.includes('google');
      });
    }

    for (const image of images) {
      onMessage?.({ image });
    }

    for (const context of contexts) {
      onMessage?.({ context });
    }

    const searchQuery = messages[0]?.content || '';
    const { messages: extendedMessages } = this.extendUserMessage(searchQuery, contexts);

    await this.createChat({ messages: extendedMessages, model }, (msg) => {
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
