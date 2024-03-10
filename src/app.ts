import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import serve from 'koa-static';
import path from 'path';
import { chatStreamController, modelsController, searchController, sogouSearchController } from './controllers';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();

const app = new Koa();
const router = new Router();
import { koaBody } from 'koa-body';
import { chatStreamController, searchController, sogouSearchController } from './controllers';

// static path
const staticPath = path.join(__dirname, '../web/build');
app.use(serve(staticPath, {
  gzip: true,
  index: 'index.html'
}));

app.use(cors({
  origin: '*'
}));

app.use(bodyParser());

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    ctx.res.statusCode = 422;
    ctx.body = err;
  }
});

// controller
router.post('/search', searchController);
router.post('/sogou/search', sogouSearchController);
router.post('/chat', chatStreamController);
router.get('/models', modelsController);

// router
app.use(router.routes()).use(router.allowedMethods());

app.use(async ctx => {
  ctx.body = 'hello';
});

app.listen(3000);
