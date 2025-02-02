import { Context } from 'koa';
import { Rag } from './service/rag';
import { getChatByProvider } from './libs/provider';
import { DefaultQuery } from './libs/utils/constant';
import Models from './model.json';
import { searchWithSogou } from './service/search';
import { TSearchEngine, IChatInputMessage, Provider, TSearchMode, IProviderModel, IChatResponse } from './interface';
import { getFromCache, setToCache } from './cache';
import { ESearXNGCategory } from './libs/search/searxng';
import { getProviderKeys } from './config';

const CACHE_ENABLED = process.env.CACHE_ENABLE;

const models = Models as IProviderModel[];

export const searchController = async (ctx: Context) => {
  const q = ctx.request.query.q || DefaultQuery;
  const reload: boolean = ctx.request.body.reload ?? false;
  // search engine
  const engine: TSearchEngine = ctx.request.body.engine;
  const categories: ESearXNGCategory[] = ctx.request.body.categories ?? [];
  const mode: TSearchMode = ctx.request.body.mode ?? 'simple';
  const language: string = ctx.request.body.language || 'all';
  // llm provider
  const provider: Provider = ctx.request.body.provider;
  const model: string = ctx.request.body.model;
  const stream = ctx.request.body.stream ?? true;

  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  ctx.res.statusCode = 200;

  // get from cache, skip if enable reload
  if (!reload) {
    const cached = await getFromCache(q as string, mode, categories);
    if (cached) {
      ctx.body = cached;
      ctx.res.write(cached, 'utf-8');
      ctx.res.end();
      return;
    }
  }

  const rag = new Rag({
    stream,
    model,
    engine,
    provider
  });

  if (!stream) {
    const res = await rag.query(q as string);
    ctx.body = res;
    return;
  }

  let result = '';

  await rag.query(q as string, categories, mode, language, (json: string) => {
    const eventData = `data:${JSON.stringify({ data: json })}\n\n`;
    result += eventData;
    ctx.res.write(eventData, 'utf-8');
  });
  ctx.res.write('[DONE] \n\n');
  ctx.res.end();
  // caching
  if (CACHE_ENABLED === '1') {
    setToCache(q as string, result, mode, categories);
  }
};

export const sogouSearchController = async (ctx: Context) => {
  const q = ctx.request.query.q || DefaultQuery;
  const res = await searchWithSogou(q as string);
  ctx.body = res;
};

export const chatStreamController = async (ctx: Context) => {
  const messages: IChatInputMessage[] = ctx.request.body.messages || [];
  const system: string | undefined = ctx.request.body.system;
  const model: string | undefined = ctx.request.body.model;
  const provider: Provider = ctx.request.body.provider;

  if (!model) throw new Error('Model is required');
  if (!provider) throw new Error('Provider is required');

  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  const handler = getChatByProvider(provider);
  ctx.res.statusCode = 200;

  await handler?.({ messages, model, system }, (data: IChatResponse | null) => {
    const eventData = `data: ${JSON.stringify({ data })}\n\n`;
    ctx.res.write(eventData);
  });
  ctx.res.write('[DONE] \n\n');
  ctx.res.end();
};

export const modelsController = async (ctx: Context) => {
  const keys = getProviderKeys();
  const getModels = models.filter(item => keys[item.provider] !== undefined);
  const enabledModels: Record<string, string[]> = {};
  for (const model of getModels) {
    if (keys[model.provider]) enabledModels[model.provider] = model.models;
  }
  ctx.body = enabledModels;
};
