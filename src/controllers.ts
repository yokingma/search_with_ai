import { Context } from 'koa';
import { DefaultQuery } from './constant';
import { searchWithSogou } from './service';
import { chat, chatStream } from './platform/aliyun';
import { IChatInputMessage } from './interface';
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

export const chatController = async (ctx: Context) => {
  const accept = ctx.request.headers.accept;
  const system: string = ctx.request.body.system;
  const messages: IChatInputMessage[] = ctx.request.body.messages;
  if (accept !== 'text/event-stream') {
    return ctx.body = await chat(messages);
  }
  ctx.res.setHeader('Content-Type', 'text/event-stream');
  await chatStream(messages, (data) => {
    if (data) {
      // const buf = Buffer.from(data);
      // console.log(buf.toString('utf-8'));
      ctx.res.write(data);
    }
  }, system);
  ctx.res.end();
};
