import { Context, Next } from 'koa';

export async function whiteListMiddleware(ctx: Context, next: Next) {
  try {
    const host = ctx.request.host;
    const whiteList = process.env.WHITELIST_DOMAINS;
    const listStr = whiteList?.replace(/\[|\]|\"|\']/g, '');
    const list = listStr ? listStr.split(',') : [];
    if (!list.length) return next();
    if (list.some(item => host.includes(item)))
      await next();
    else 
      ctx.res.statusCode = 401;
  } catch (error) {
    next();
  }
}