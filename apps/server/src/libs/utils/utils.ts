import url from 'url';
import { logger } from '../../service/logger';

interface RequestConfig {
  endpoint: string;
  timeout?: number;
  query?: Record<string, any>;
  data?: BodyInit | null;
  headers?: Record<string, any>;
  method?: RequestInit['method']
}

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

// Retry mechanism for network requests
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 500
): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      logger.error(`Retry ${attempt + 1} failed:`, err);
      attempt++;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Max retries exceeded');
};
