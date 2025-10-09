import {
  TSearchEngine,
  IChatInputMessage,
  IStreamHandler,
  Provider,
  SearchFunc,
  // ISearchResponseResult,
  IChatResponse
} from '../../interface';
import { getSearchEngine } from '../search';
import { MoreQuestionsPrompt, RagQueryPrompt, TranslatePrompt } from './prompt';
import { ESearXNGCategory } from '../../libs/search/searxng';
import { getProviderClient } from '../../libs/provider';
// import { jinaUrlsReader } from '../../libs/jina';
import util from 'util';
import { IChatOptions } from '../../libs/provider/openai';
import { replaceVariable } from '../../libs/utils';

interface RagOptions {
  engine?: TSearchEngine
  stream?: boolean
  model?: string
  provider?: Provider
}

// const CACHE_NAME = 'search_with_ai';

export class Rag {
  private search: SearchFunc;
  private chat: (options: IChatOptions, onMessage?: IStreamHandler) => Promise<IChatResponse>;
  private model: string;
  // enable stream?
  private stream: boolean;
  // search engine
  private engine: TSearchEngine;

  constructor(params?: RagOptions) {
    const { engine = 'SEARXNG', stream = true, model, provider } = params || {};
    if (!model) throw new Error('[RAG] model is required');
    if (!provider) throw new Error('[RAG] provider is required');
    const client = getProviderClient(provider);
    this.chat = client.chat.bind(client);

    this.model = model;
    this.stream = stream;
    this.engine = engine;

    this.search = getSearchEngine(engine);
  }

  public async query(query: string, categories = [ESearXNGCategory.GENERAL], language = 'all', onMessage?: (...args: any[]) => void) {
    let searchQuery = query;
    // rewrite query for [SCIENCE]
    if (categories.includes(ESearXNGCategory.SCIENCE) && this.engine === 'SEARXNG') {
      const rewrite = await this.translate(query);
      if (rewrite) searchQuery = rewrite;
    }

    // Parameters supported by searxng: categories.
    const contexts = await this.search(searchQuery, categories, language);
    const REFERENCE_COUNT = process.env.REFERENCE_COUNT || 8;
    const limitContexts = contexts.slice(0, +REFERENCE_COUNT);

    // if (mode === 'research') {
    //   const fullContexts = await this.getFullSearchResult(limitContexts);
    //   limitContexts = limitContexts.map((item, index) => ({
    //     ...item,
    //     content: fullContexts[index].content || ''
    //   }));
    // }

    let images: Record<string, any>[] = [];

    // searxng images search
    if (this.engine === 'SEARXNG') {
      const res = await this.search(query, [ESearXNGCategory.IMAGES], language);
      const engines = process.env.SEARXNG_IMAGES_ENGINES ? process.env.SEARXNG_IMAGES_ENGINES.split(',') : [];

      images = res.filter(item => {
        if (!item.thumbnail) return false;
        if (engines.length > 0)
          return engines.some(engine => item.engine?.includes(engine));
        return item.engine?.includes('bing') || item.engine?.includes('google');
      });
    }

    if (!this.stream) {
      const relatedPromise = this.getRelatedQuestions(query, limitContexts);
      const answerPromise = this.getAiAnswer(query, contexts);
      const [related, answer] = await Promise.all([relatedPromise, answerPromise]);
      return {
        related,
        images,
        contexts: limitContexts,
        ...answer
      };
    }

    for (const image of images) {
      onMessage?.(JSON.stringify({ image }));
    }

    for (const context of limitContexts) {
      onMessage?.(JSON.stringify({ context }));
    }

    await this.getAiAnswer(query, limitContexts, (msg) => {
      onMessage?.(JSON.stringify(msg));
    });

    await this.getRelatedQuestions(query, limitContexts, (msg) => {
      onMessage?.(JSON.stringify({ related: msg?.content }));
    });

    onMessage?.(null, true);
  }

  // private async getFullSearchResult(results: ISearchResponseResult[]) {
  //   const urls = results.map(item => item.url);
  //   const fullContexts = await jinaUrlsReader({ urls });
  //   return fullContexts;
  // }

  // Gets related questions based on the query and context.
  private async getRelatedQuestions(query: string, contexts: any[], onMessage?: IStreamHandler) {
    try {
      const { messages } = this.paramsFormatter(query, contexts, 'related');
      const { model } = this;
      if (typeof onMessage === 'function') {
        await this.chat({ messages, model }, onMessage);
        return;
      }
      const res = await this.chat({ messages, model });
      return res.content;
    } catch (err) {
      console.error('[LLM Error]:', err);
      return '';
    }
  }

  private async getAiAnswer(query: string, contexts: any[], onMessage?: IStreamHandler) {
    const { model, stream } = this;
    try {
      const { messages } = this.paramsFormatter(query, contexts, 'answer');
      if (!stream) {
        const res = await this.chat({ messages, model });
        return res;
      }
      await this.chat({ messages, model }, (msg) => {
        onMessage?.(msg);
      });
    } catch (err: any) {
      console.error('[LLM Error]:', err);
      const msg = {
        content: `[Oops~ Some errors seem to have occurred]: ${err?.message || 'Please check the console'}`,
      };
      if (!stream) return msg;
      else onMessage?.(msg, true);
    }
  }

  // translate
  private async translate(text: string, targetLang = 'English'): Promise<string> {
    try {
      const content = util.format(TranslatePrompt, targetLang, text);
      const messages: IChatInputMessage[] = [
        {
          role: 'user',
          content
        }
      ];
      // console.log(content);
      const { model, stream } = this;
      let translated = '';
      if (!stream) {
        const res = await this.chat({ messages, model });
        translated = res.content;
      } else {
        await this.chat({ messages, model }, (msg) => {
          if (msg) translated += msg.content;
        });
      }
      return translated;
    } catch (err) {
      console.log('[RAG Translate error]', err);
      return text;
    }
  }

  private paramsFormatter(query: string, contexts: any[], type: 'answer' | 'related') {
    const context = contexts.map(
      (item, index) => `[[citation:${index + 1}]] ${item.content || item.snippet}`
    ).join('\n\n');

    let prompt = MoreQuestionsPrompt;

    const date = new Date().toISOString();

    if (type === 'answer') {
      prompt = replaceVariable(RagQueryPrompt, { date });
    }

    const system = util.format(prompt, context);
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
