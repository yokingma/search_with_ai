import { Context } from 'koa';
import { AliyunModels, DefaultQuery, OpenAIModels } from './constant';
import { searchWithSogou } from './service';
import { AliyunChat, OpenAIChat } from './platform';
import { IChatInputMessage, TModelKeys } from './interface';
import { Rag } from './rag';

export const searchController = async (ctx: Context) => {
  const stream = ctx.request.body.stream ?? true;
  const q = ctx.request.query.q || DefaultQuery;
  const rag = new Rag({
    stream
  });
  if (!stream) {
    const res = await rag.query(q as string);
    ctx.body = res;
    return;
  }
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  await rag.query(q as string);
};

export const sogouSearchController = async (ctx: Context) => {
  const q = ctx.request.query.q || DefaultQuery;
  const res = await searchWithSogou(q as string);
  ctx.body = res;
};

export const chatStreamController = async (ctx: Context) => {
  const messages: IChatInputMessage[] = ctx.request.body.messages;
  const system: string = ctx.request.body.system;
  const model: TModelKeys = ctx.request.body.model;
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  const handler = processModel(model);
  await handler?.(messages, (message) => {
    if (message ) {
      ctx.res.write(message);
    }
  }, system, model);
  ctx.res.end();
};

function processModel(model = AliyunModels.QWENMAX) {
  const aliyun = new AliyunChat();
  const openai = new OpenAIChat();
  if (model in AliyunModels) {
    return aliyun.chatStream.bind(aliyun);
  }
  if (model in OpenAIModels) {
    return openai.chatStream.bind(openai);
  }
  return aliyun.chatStream.bind(aliyun);
}
