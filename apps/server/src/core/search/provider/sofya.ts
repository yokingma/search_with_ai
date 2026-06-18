import { ISearchResponseResult, SearchFunc } from './types.js';
import { logger, getConfig } from '../../../utils/index.js';

const SOFYA_SEARCH_ENDPOINT = 'https://sofya.co/v1/search';

interface ISofyaSearchResult {
  title: string;
  url: string;
  content?: string;
  description?: string;
  published_date?: string;
}

const searchWithSofya: SearchFunc = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const key = getConfig('SOFYA_KEY');
  if (!key) {
    throw new Error('Sofya search key is not provided.');
  }

  const count = Number(process.env.REFERENCE_COUNT) || 8;

  try {
    const res = await fetch(SOFYA_SEARCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        query,
        search_depth: 'basic',
        topic: 'general',
        max_results: count,
      }),
    });

    if (!res.ok) {
      throw new Error(`Sofya search failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const list: ISofyaSearchResult[] = data?.results ?? [];

    const results: ISearchResponseResult[] = list.map((item, index) => ({
      id: index + 1,
      name: item.title,
      url: item.url,
      snippet: item.content || item.description || '',
      publishedDate: item.published_date,
    }));

    return results;
  } catch (err) {
    logger.error('[Sofya Search Error]:', err);
    throw err;
  }
};

export default searchWithSofya;
