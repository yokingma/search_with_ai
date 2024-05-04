import { createCache, memoryStore } from 'cache-manager';
import { createHash } from 'node:crypto';

const memoryCache = createCache(memoryStore(), {
  ttl: 60 * 1000 * 60 * 24 // ms
});

export async function setToCache(key: string, val: string) {
  const hash = createHash('sha256');
  const hashKey = hash.update(key, 'utf8').digest('hex');
  await memoryCache.set(hashKey, val);
}

export async function getFromCache(q: string) {
  const hash = createHash('sha256');
  const hashKey = hash.update(q, 'utf8').digest('hex');
  const val = await memoryCache.get<string>(hashKey);
  return val;
}

export default memoryCache;
