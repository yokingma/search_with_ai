import { getConfig } from '../config';
import { httpRequest } from './utils';
import { logger } from '../logger';

export interface IJinaReaderOptions {
  urls: string[];
  batchSize?: number;
  format?: 'html' | 'markdown' | 'text';
  timeout?: number;
}

const BASE_URL = 'https://r.jina.ai/';


export const jinaUrlsReader = async (options: IJinaReaderOptions) => {
  const apiKey = getConfig('JINA_KEY');

  const headers: Record<string, any> = {};

  if (!apiKey) {
    logger.info('[JINA] JINA_KEY is not set, limit to 20RPM');
  }

  const { urls, batchSize = 4, format = 'markdown', timeout } = options;

  // headers
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  if (format) headers['X-Return-Format'] = format;
  if (timeout)  headers['X-Timeout'] = timeout;

  const batchUrls: string[][] = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    batchUrls.push(urls.slice(i, i + batchSize));
  }

  const allRes: PromiseSettledResult<Response>[] = [];

  for (const batch of batchUrls) {
    const batchRes = await Promise.allSettled(batch.map(url => httpRequest({
      endpoint: `${BASE_URL}/${url}`,
      method: 'GET',
      headers
    })));
    allRes.push(...batchRes);
  }

  const resultsPromise = allRes.map(async (r) => {
    const res = r.status === 'fulfilled' ? r.value : null;
    if (res) return await res.text();
    return null;
  });

  const results = await Promise.all(resultsPromise);
  return results.map((r, index) => ({
    url: urls[index],
    content: r
  }));
};
