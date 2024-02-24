import Koa from 'koa';
import Router from '@koa/router';
import dotenv from 'dotenv';
const app = new Koa();
const router = new Router();
import { bingSearchController } from './controller';

//env
dotenv.config();

app.use(async (ctx, next) => {
  ctx.state.BingSearchKey = process.env.BING_SEARCH_KEY;
  await next();
});

router.get('/search', bingSearchController);

app.use(router.routes()).use(router.allowedMethods());

app.use(async ctx => {
  ctx.body = 'hello';
});

app.listen(3000);
