import { createCache, memoryStore } from 'cache-manager';
import { createHash } from 'node:crypto';
import { ESearXNGCategory } from '../search/index.js';

const memoryCache = createCache(memoryStore(), {
  ttl: 60 * 1000 * 60 * 24 // ms
});

export async function setToCache(key: string, val: string,  categories: ESearXNGCategory[] = []) {
  const hash = createHash('sha256');
  const str = `${key}_${categories.join()}`;
  const hashKey = hash.update(str, 'utf8').digest('hex');
  await memoryCache.set(hashKey, val);
}

export async function getFromCache(q: string, categories: ESearXNGCategory[] = []) {
  const hash = createHash('sha256');
  const str = `${q}_${categories.join()}`;
  const hashKey = hash.update(str, 'utf8').digest('hex');
  const val = await memoryCache.get<string>(hashKey);
  return val;
}

export default memoryCache;
