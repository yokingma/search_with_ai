import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import serve from 'koa-static';
import path from 'path';
import history from 'koa2-connect-history-api-fallback';
import { chatStreamController, modelsController, searchController, sogouSearchController } from './controllers';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();

const app = new Koa();
const router = new Router();
// static path
const staticPath = path.join(__dirname, '../web/build');
app.use(serve(staticPath, {
  gzip: true,
  index: 'index.html'
}));
app.use(history({
  index: '/index.html',
  whiteList: ['/api']
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
    console.error(err);
    ctx.res.statusCode = 422;
    ctx.body = err;
  }
});

// router
app.use(router.routes()).use(router.allowedMethods());

// controller
router.post('/api/search', searchController);
router.post('/api/sogou/search', sogouSearchController);
router.post('/api/chat', chatStreamController);
router.get('/api/models', modelsController);

app.listen(3000);
