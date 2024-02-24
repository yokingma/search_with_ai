import { Context } from 'koa';
import { DefaultQuery } from './constant';
import { searchWithBing, searchWithSogou } from './service';

export const bingSearchController = async (ctx: Context) => {
  const key = ctx.state.BingSearchKey;
  const q = ctx.request.query.q || DefaultQuery;
  const res = await searchWithBing(q as string, key);
  ctx.body = res;
};

export const sogouSearchController = async (ctx: Context) => {
  const q = ctx.request.query.q || DefaultQuery;
  const res = await searchWithSogou(q as string);
  ctx.body = res;
};
