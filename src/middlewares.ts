import { Context, Next } from 'koa';

export async function whiteListMiddleware(ctx: Context, next: Next) {
  const host = ctx.request.host;
  const whiteList = process.env.WHITELIST_DOMAINS;
  const listStr = whiteList?.replace(/\[\]|\"|\'/g, '');
  const list = listStr ? listStr.split(',') : [];

  if (!list.length) return next();
  
  if (list.some(item => host.includes(item)))
    next();
  else 
    ctx.res.statusCode = 401;
}