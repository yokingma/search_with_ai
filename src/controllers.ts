import { Context } from 'koa';
import { AliyunModels, DefaultQuery, OpenAIModels } from './constant';
import { searchWithSogou } from './service';
import { AliyunChat, OpenAIChat } from './platform';
import { IChatInputMessage, TypeModelKeys } from './interface';
import { Rag } from './rag';

export const searchController = async (ctx: Context) => {
  const stream = ctx.request.body.stream ?? true;
  const q = ctx.request.query.q || DefaultQuery;
  const model: TypeModelKeys = ctx.request.body.model;
  const rag = new Rag({
    stream,
    model
  });
  if (!stream) {
    const res = await rag.query(q as string);
    ctx.body = res;
    return;
  }
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.statusCode = 200;
  await rag.query(q as string, (json: string) => {
    const eventData = `data:${JSON.stringify({ data: json })}\n\n`;
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
  const system: string = ctx.request.body.system;
  const model: TypeModelKeys = ctx.request.body.model;
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  const handler = processModel(model);
  ctx.res.statusCode = 200;
  await handler?.(messages, (data) => {
    const eventData = `data:${JSON.stringify({ text: data || '' })}\n\n`;
    ctx.res.write(eventData);
  }, model, system);
  ctx.res.end();
};

function processModel(model = AliyunModels.QWEN_MAX) {
  const aliyun = new AliyunChat();
  const openai = new OpenAIChat();
  if (Object.values(AliyunModels).includes(model)) {
    return aliyun.chatStream.bind(aliyun);
  }
  if (Object.values(OpenAIModels).includes(model)) {
    return openai.chatStream.bind(openai);
  }
  return aliyun.chatStream.bind(aliyun);
}
