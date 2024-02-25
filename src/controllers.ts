import { Context } from 'koa';
import { DefaultQuery } from './constant';
import { searchWithSogou } from './service';
import { Rag } from './rag';

export const searchController = async (ctx: Context) => {
  const rag = new Rag();
  const q = ctx.request.query.q || DefaultQuery;
  const res = await rag.query(q as string);
  ctx.body = res;
};

export const sogouSearchController = async (ctx: Context) => {
  const q = ctx.request.query.q || DefaultQuery;
  const res = await searchWithSogou(q as string);
  ctx.body = res;
};
