import { ISearchResponseResult, SearchFunc } from './types.js';
import { logger, httpRequest, getConfig } from '../../../utils/index.js';

const BING_SEARCH_V7_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';
const TIMEOUT = 20000;
const BING_MKT = 'en-US';


const searchWithBing: SearchFunc = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const subscriptionKey = getConfig('BING_SEARCH_KEY');
  if (!subscriptionKey) {
    throw new Error('Bing search key is not provided.');
  }

  try {
    const res = await httpRequest({
      endpoint: BING_SEARCH_V7_ENDPOINT,
      timeout: TIMEOUT,
      query: {
        q: query,
        mkt: BING_MKT,
      },
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    });

    const result = await res.json();
    const list: Record<string, any>[] = result?.webPages?.value || [];

    const results: ISearchResponseResult[] = list.map(
      (item: Record<string, any>, index: number) => {
        return {
          id: index + 1,
          name: item.name,
          url: item.url,
          snippet: item.snippet,
        };
      }
    );

    return results;
  } catch (err) {
    logger.error('[Bing Search Error]:', err);
    throw err;
  }
};

export default searchWithBing;
