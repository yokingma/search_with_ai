import Koa, { Context } from 'koa';
import Router from 'koa-router';
import { IChatInputMessage, Provider, TMode, TSearchEngine } from './interface';
import { ESearXNGCategory } from './search/searxng';
import { chatStreamController, localChatStreamController, localModelsController, modelsController, searchController, sogouSearchController } from './controllers';
import { getConfig } from './config';
import { logger } from './logger';

const app = new Koa();
const router = new Router();

// Configure routes
router.post('/search', searchController);
router.get('/sogou-search', sogouSearchController);
router.post('/chat-stream', chatStreamController);
router.get('/models', modelsController);
router.get('/local-models', localModelsController);
router.post('/local-chat-stream', localChatStreamController);

// Apply middleware
app.use(async (ctx: Context, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(getConfig('PORT'), () => {
  logger.info(`Server started on port ${getConfig('PORT')}`);
});

export const searchController = async (ctx: Context) => {
  const stream = ctx.request.body.stream ?? true;
  const q = ctx.request.query.q || getConfig('DEFAULT_QUERY');
  const model: string = ctx.request.body.model;
  const reload: boolean = ctx.request.body.reload ?? false;
  const engine: TSearchEngine = ctx.request.body.engine;
  const locally: boolean = ctx.request.body.locally ?? false;
  const categories: ESearXNGCategory[] = ctx.request.body.categories ?? [];
  const mode: TMode = ctx.request.body.mode ?? 'simple';
  const language: string = ctx.request.body.language || 'all';
  const provider: Provider = ctx.request.body.provider || 'ollama';

  ctx.set('Content-Type', 'text/event-stream');
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Connection', 'keep-alive');
  ctx.status = 200;

  // Get from cache, skip if reload is enabled
  if (!reload) {
    const cached = await getFromCache(q as string, mode, categories);
    if (cached) {
      ctx.body = cached;
      ctx.res.write(cached, 'utf-8');
      ctx.res.end();
      return;
    }
  }

  const rag = new Rag({
    stream,
    model,
    engine,
    locally,
    provider
  });

  if (!stream) {
    const res = await rag.query(q as string);
    ctx.body = res;
    return;
  }

  let result = '';

  await rag.query(q as string, categories, mode, language, (json: string) => {
    const eventData = `data:${JSON.stringify({ data: json })}\n\n`;
    result += eventData;
    ctx.res.write(eventData, 'utf-8');
  });

  ctx.res.end();

  // Caching
  if (getConfig('CACHE_ENABLED') === '1') {
    setToCache(q as string, result, mode, categories);
  }
};

// Other controller functions...

function getConfig(key: string): string | undefined {
  return process.env[key];
}

function getFromCache(
  q: string,
  mode: TMode,
  categories: ESearXNGCategory[]
): string | null {
  // Implement caching logic
  return null;
}

function setToCache(
  q: string,
  result: string,
  mode: TMode,
  categories: ESearXNGCategory[]
): void {
  // Implement caching logic
}

function processModel(model: string): typeof platform[keyof typeof platform]['chatStream'] | undefined {
  const targetModel = Models.find(item => item.models.includes(model));
  if (targetModel?.platform) {
    const target = platform[targetModel.platform as keyof typeof platform];
    return target.chatStream.bind(target);
  }
  return undefined;
}
