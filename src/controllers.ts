import { Context } from 'koa';
import { DefaultQuery, Models } from './constant';
import { searchWithSogou } from './service';
import platform from './platform';
import { EBackend, IChatInputMessage, TMode } from './interface';
import { Rag } from './rag';
import { getFromCache, setToCache } from './cache';
import { ESearXNGCategory } from './search/searxng';

export const searchController = async (ctx: Context) => {
  const stream = ctx.request.body.stream ?? true;
  const q = ctx.request.query.q || DefaultQuery;
  const model: string = ctx.request.body.model;
  const reload: boolean = ctx.request.body.reload ?? false;
  const engine: EBackend = ctx.request.body.engine;
  const locally: boolean = ctx.request.body.locally ?? false;
  const categories: ESearXNGCategory[] = ctx.request.body.categories ?? [];
  const mode: TMode = ctx.request.body.mode ?? 'simple';
  const language: string = ctx.request.body.language || 'all';

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
    backend: engine,
    locally
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

  ctx.res.end();
  // caching
  setToCache(q as string, result, mode, categories);
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
  const locally: boolean = ctx.request.body.locally ?? false;

  if (!model) throw new Error('model is required');

  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  const handler = locally ? platform.local.chatStream.bind(platform.local) : processModel(model);
  ctx.res.statusCode = 200;

  await handler?.(messages, (data: any) => {
    const eventData = `data: ${JSON.stringify({ text: data || '' })}\n\n`;
    ctx.res.write(eventData);
  }, model, system);

  ctx.res.end();
};

export const modelsController = async (ctx: Context) => {
  const { GOOGLE_KEY, ALIYUN_KEY, OPENAI_KEY, BAIDU_KEY, TENCENT_KEY, YI_KEY, MOONSHOT_KEY, LEPTON_KEY } = process.env;
  const keys: Record<string, string | undefined> = {
    google: GOOGLE_KEY,
    aliyun: ALIYUN_KEY,
    openai: OPENAI_KEY,
    baidu: BAIDU_KEY,
    tencent: TENCENT_KEY,
    yi: YI_KEY,
    moonshot: MOONSHOT_KEY,
    lepton: LEPTON_KEY
  };
  const models = Models.filter(item => keys[item.platform] !== undefined);
  const enabledModels: Record<string, string[]> = {};
  for (const model of models) {
    if (keys[model.platform]) enabledModels[model.platform] = model.models;
  }
  ctx.body = enabledModels;
};

// locally llm models
export const localModelsController = async (ctx: Context) => {
  const list = await platform.local.list();
  ctx.body = list;
};


// chat with locally models
export const localChatStreamController = async (ctx: Context) => {
  const messages: IChatInputMessage[] = ctx.request.body.messages || [];
  const model: string | undefined = ctx.request.body.model;
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  ctx.res.statusCode = 200;
  await platform.local.chatStream(messages, (data) => {
    const eventData = `data: ${JSON.stringify({ text: data || '' })}\n\n`;
    ctx.res.write(eventData);
  }, model);
  ctx.res.end();
};


function processModel(model: string) {
  const targetModel = Models.find(item => {
    return item.models.includes(model);
  });
  if (targetModel?.platform) {
    const target = platform[targetModel.platform];
    return target.chatStream.bind(target);
  }
}
