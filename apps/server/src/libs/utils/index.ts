import url from 'url';
import { logger } from '../../logger';
import { RequestConfig } from '../../interface';

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

/**
 * check if the string is a link
 */
export function strIsLink(str?: string) {
  if (!str) return false;
  if (/^((http|https)?:\/\/|www\.|\/)[^\s/$.?#].[^\s]*$/i.test(str))
    return true;
  return false;
}

/**
 * replace the variable in the string with the value
 * e.g replaceVariable(`abc{{query}}, efg.`, { query: '456' })
 */
export function replaceVariable(
  text: any,
  obj: Record<string, string | number>
): string {
  if (!(typeof text === 'string')) return text;

  for (const key in obj) {
    const val = obj[key];
    if (!['string', 'number'].includes(typeof val)) continue;

    text = text.replace(new RegExp(`{{(${key})}}`, 'g'), String(val));
  }
  return text || '';
}
