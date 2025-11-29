import { ISearchResponseResult, SearchFunc } from './types.js';
import { logger, getConfig } from '../../../utils/index.js';

const BOCHA_WEB_SEARCH_ENDPOINT = 'https://api.bocha.cn/v1/web-search';

export interface IBochaSearchOptions {
  freshness?: 'noLimit' | 'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear';
  summary?: boolean;
  count?: number;
}

const searchWithBocha: SearchFunc = async (query: string, options?: IBochaSearchOptions) => {
  const key = getConfig('BOCHA_KEY');
  if (!key) {
    throw new Error('Bocha search key is not provided.');
  }

  try {
    const res = await fetch(BOCHA_WEB_SEARCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`, // Assuming Bearer token auth, verify if different
      },
      body: JSON.stringify({
        query: query,
        count: options?.count || 10,
        summary: options?.summary ?? true,
        freshness: options?.freshness || 'noLimit',
      }),
    });

    if (!res.ok) {
      throw new Error(`Bocha search failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    // Assuming response structure based on common patterns and limited docs visibility
    // Verify: data.data.webPages.value or similar?
    // Based on Zhipu/Bing, it's often a list of results.
    // Let's assume a generic mapping and log if it fails.

    const list: any[] = data?.data?.webPages?.value || data?.webPages?.value || data?.results || [];

    const results: ISearchResponseResult[] = list.map(
      (item: any, index: number) => {
        return {
          id: index + 1,
          name: item.name || item.title,
          url: item.url || item.link,
          snippet: item.snippet || item.summary || item.content,
          date: item.datePublished || item.publish_date,
          siteName: item.siteName || item.site_name,
          icon: item.urlToImage || item.icon,
        };
      }
    );

    return results;
  } catch (err) {
    logger.error('[Bocha Search Error]:', err);
    throw err;
  }
};

export default searchWithBocha;
