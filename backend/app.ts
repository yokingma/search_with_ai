import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import serve from 'koa-static';
import path from 'path';
import { whiteListMiddleware } from './middlewares';
import history from 'koa2-connect-history-api-fallback';
import { chatStreamController, localChatStreamController, localModelsController, modelsController, searchController, sogouSearchController } from './controllers';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3000;

app.use(history({
  index: '/index.html',
  whiteList: ['/api']
}));

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
    console.error('[server error]', err);
    ctx.res.statusCode = 422;
    ctx.body = err;
  }
});

// router
app.use(router.routes()).use(router.allowedMethods());

// controller
router.post('/api/search', whiteListMiddleware(), searchController);
router.post('/api/sogou/search', sogouSearchController);
router.post('/api/chat', chatStreamController);
router.get('/api/models', modelsController);

// local llm
router.get('/api/local/models', localModelsController);
router.post('/api/local/chat', localChatStreamController);

app.listen(port);
