import { Context } from 'koa';
import { AliyunModels, BaiduModels, DefaultQuery, GoogleModels, OpenAIModels, TencentModels, YiModels } from './constant';
import { searchWithSogou } from './service';
import { aliyun, openai, baidu, yi, tencent } from './platform';
import { EBackend, IChatInputMessage } from './interface';
import { Rag } from './rag';

export const searchController = async (ctx: Context) => {
  const stream = ctx.request.body.stream ?? true;
  const q = ctx.request.query.q || DefaultQuery;
  const model: string = ctx.request.body.model;
  const engine: EBackend = ctx.request.body.engine;
  const rag = new Rag({
    stream,
    model,
    backend: engine
  });
  if (!stream) {
    const res = await rag.query(q as string);
    ctx.body = res;
    return;
  }
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  ctx.res.statusCode = 200;
  await rag.query(q as string, (json: string) => {
    const eventData = `data: ${JSON.stringify({ data: json })}\n\n`;
    ctx.res.write(eventData);
  });
  ctx.res.end();
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
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  const handler = processModel(model);
  ctx.res.statusCode = 200;
  await handler?.(messages, (data) => {
    const eventData = `data: ${JSON.stringify({ text: data || '' })}\n\n`;
    ctx.res.write(eventData);
  }, model, system);
  ctx.res.end();
};

export const modelsController = async (ctx: Context) => {
  const models = {
    aliyun: Object.values(AliyunModels),
    openai: Object.values(OpenAIModels),
    baidu: Object.values(BaiduModels),
    google: Object.values(GoogleModels),
    tencent: Object.values(TencentModels),
    yi: Object.values(YiModels)
  };
  ctx.body = models;
};

function processModel(model = AliyunModels.QWEN_MAX) {
  if (Object.values(AliyunModels).includes(model)) {
    return aliyun.chatStream.bind(aliyun);
  }
  if (Object.values(OpenAIModels).includes(model)) {
    return openai.chatStream.bind(openai);
  }
  if (Object.values(BaiduModels).includes(model)) {
    return baidu.chatStream.bind(baidu);
  }
  if (Object.values(YiModels).includes(model)) {
    return yi.chatStream.bind(yi);
  }
  if (Object.values(TencentModels).includes(model)) {
    return tencent.chatStream.bind(tencent);
  }
  return aliyun.chatStream.bind(aliyun);
}
