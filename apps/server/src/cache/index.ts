import { createCache, memoryStore } from 'cache-manager';
import { createHash } from 'node:crypto';
import { TSearchMode } from '../interface';
import { ESearXNGCategory } from '../libs/search/searxng';

// Create a memory cache with 24-hour TTL (in milliseconds)
const memoryCache = createCache(memoryStore(), {
  ttl: 1000 * 60 * 60 * 24 // 24 hours
});

/**
 * Generate a unique hash key based on query, mode, and categories
 */
function generateHashKey(key: string, mode: TSearchMode, categories: ESearXNGCategory[]): string {
  const str = `${key}_${mode}_${categories.join()}`;
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

/**
 * Cache a value using a hashed key
 */
export async function setToCache(
  key: string,
  val: string,
  mode: TSearchMode = 'simple',
  categories: ESearXNGCategory[] = []
): Promise<void> {
  const hashKey = generateHashKey(key, mode, categories);
  await memoryCache.set(hashKey, val);
}

/**
 * Retrieve a cached value by query, mode, and category
 */
export async function getFromCache(
  q: string,
  mode: TSearchMode = 'simple',
  categories: ESearXNGCategory[] = []
): Promise<string | undefined> {
  const hashKey = generateHashKey(q, mode, categories);
  return await memoryCache.get<string>(hashKey);
}

export default memoryCache;
