import { createCache, memoryStore } from 'cache-manager';

const memoryCache = createCache(memoryStore(), {
  ttl: 60 * 100 // ms
});

export {
  memoryCache
};
