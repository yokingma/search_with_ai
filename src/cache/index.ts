import { createCache, memoryStore } from 'cache-manager';
import { createHash } from 'node:crypto';
import { TMode } from '../interface';
import { ESearXNGCategory } from '../search/searxng';

const memoryCache = createCache(memoryStore(), {
  ttl: 60 * 1000 * 60 * 24 // ms
});

export async function setToCache(key: string, val: string, mode: TMode = 'simple', categories: ESearXNGCategory[] = []) {
  const hash = createHash('sha256');
  const str = `${key}_${mode}_${categories.join()}`;
  const hashKey = hash.update(str, 'utf8').digest('hex');
  await memoryCache.set(hashKey, val);
}

export async function getFromCache(q: string, mode: TMode = 'simple', categories: ESearXNGCategory[] = []) {
  const hash = createHash('sha256');
  const str = `${q}_${mode}_${categories.join()}`;
  const hashKey = hash.update(str, 'utf8').digest('hex');
  const val = await memoryCache.get<string>(hashKey);
  return val;
}

export default memoryCache;
