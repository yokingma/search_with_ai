import url from 'url';
import { createCache, memoryStore } from 'cache-manager';

interface RequestConfig {
  endpoint: string;
  timeout?: number;
  query?: Record<string, any>;
  data?: BodyInit | null;
  headers?: Record<string, any>;
  method?: RequestInit['method']
}

// cache
export const memoryCache = createCache(memoryStore(), {
  max: 100,
  ttl: 60 * 60 * 1000
});

export const httpRequest = async (config: RequestConfig) => {
  const { endpoint, timeout = 10 * 60 * 1000, query, headers, data, method = 'GET' } = config;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const params = url.format({
    query: query
  });
  const res = await fetch(endpoint + params, {
    method,
    headers,
    body: data,
    signal: controller.signal
  });
  clearTimeout(id);
  return res;
};
