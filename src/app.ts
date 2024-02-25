import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import dotenv from 'dotenv';
const app = new Koa();
const router = new Router();
import { searchController, sogouSearchController } from './controllers';

//env
dotenv.config();

app.use(cors({
  origin: '*'
}));

app.use(async (ctx, next) => {
  ctx.state.BingSearchKey = process.env.BING_SEARCH_KEY;
  await next();
});

router.get('/search', searchController);
router.get('/sogou/search', sogouSearchController);

app.use(router.routes()).use(router.allowedMethods());

app.use(async ctx => {
  ctx.body = 'hello';
});

app.listen(3000);
