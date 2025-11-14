import Koa from 'koa';
import path from 'path';
import Router from '@koa/router';
import cors from '@koa/cors';
import serve from 'koa-static';
import { bodyParser } from '@koa/bodyparser';
import { whiteListMiddleware } from './middleware';
import { getConfig } from './utils/config';
import { logger } from './utils';
import history from 'koa2-connect-history-api-fallback';
import {
  enginesController,
  // deepResearchController,
  modelsController,
  searchChatController,
} from './controller';

const app = new Koa();
const router = new Router();

const port = Number(getConfig('PORT', '3000'));

app.use(history({
  index: '/index.html',
  whiteList: ['/api']
}));

// static path
const staticPath = path.join(__dirname, '../web/dist');
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
    logger.error('Server Error:', err);
    ctx.res.statusCode = 422;
    ctx.body = err;
  }
});

// router
app.use(router.routes()).use(router.allowedMethods());

router.post('/api/chat', whiteListMiddleware(), searchChatController);
// router.post('/api/deep-research', deepResearchController);
router.get('/api/models', modelsController);
router.get('/api/engines', enginesController);

const server = app.listen(port, () => {
  const address = server.address();
  const host = address && typeof address === 'object' ? address.address : 'localhost';
  logger.info(`[Server is running on] ${host}:${port}`);
});

server.timeout = 1000 * 60 * 60;
