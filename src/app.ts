import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import dotenvx from '@dotenvx/dotenvx';
import { bodyParser } from '@koa/bodyparser';
import { chatStreamController, searchController, sogouSearchController } from './controllers';

const app = new Koa();
const router = new Router();

//env
dotenvx.config();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.state.BingSearchKey = process.env.BING_SEARCH_KEY;
  await next();
});

router.post('/search', searchController);
router.post('/sogou/search', sogouSearchController);

router.post('/chat', chatStreamController);

app.use(router.routes()).use(router.allowedMethods());

app.use(async ctx => {
  ctx.body = 'hello';
});

app.listen(3000);
