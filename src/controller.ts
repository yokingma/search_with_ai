import { Context } from 'koa';
import { DefaultQuery } from './constant';
import { searchWithBing } from './service';

export const bingSearchController = async (ctx: Context) => {
  const key = ctx.state.BingSearchKey;
  const q = ctx.request.query.q || DefaultQuery;
  const res = await searchWithBing(q as string, key);
  ctx.body = res;
};
