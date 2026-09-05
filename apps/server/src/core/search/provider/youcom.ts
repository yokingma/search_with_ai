/**
 * You.com web search API
 * @reference https://you.com/docs
 */

import { ISearchResponseResult, SearchFunc } from './types.js';
import { logger, getConfig } from '../../../utils/index.js';

const YOUCOM_SEARCH_ENDPOINT = 'https://api.ydcindex.io/search';

export interface IYoucomSearchOptions {
  count?: number;
  country?: string;
  safesearch?: 'Off' | 'Moderate' | 'Strict';
}

interface IYoucomSearchResponse {
  hits: IYoucomHit[];
  response_id?: string;
}

interface IYoucomHit {
  description?: string;
  title?: string;
  url?: string;
  snippets?: string[];
  thumbnail_url?: string;
  source?: string;
}

const searchWithYoucom: SearchFunc = async (query: string, options?: IYoucomSearchOptions) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const key = getConfig('YDC_API_KEY');
  if (!key) {
    throw new Error('You.com search key is not provided. Set YDC_API_KEY to enable the You.com engine.');
  }

  try {
    const res = await fetch(YOUCOM_SEARCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': key,
      },
      body: JSON.stringify({
        query: query,
        num_search_results: options?.count || 10,
        country: options?.country || 'US',
        safesearch: options?.safesearch || 'Moderate',
      }),
    });

    if (!res.ok) {
      throw new Error(`You.com search failed with status ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as IYoucomSearchResponse;
    const list: IYoucomHit[] = data?.hits ?? [];

    const results: ISearchResponseResult[] = list.map(
      (item: IYoucomHit, index: number) => {
        return {
          id: index + 1,
          name: item.title || '',
          url: item.url || '',
          snippet: item.snippets?.join('\n') || item.description || '',
          thumbnail: item.thumbnail_url,
          source: item.source,
          engine: 'youcom',
        } as ISearchResponseResult;
      }
    );

    return results;
  } catch (err) {
    logger.error('[You.com Search Error]:', err);
    throw err;
  }
};

export default searchWithYoucom;
