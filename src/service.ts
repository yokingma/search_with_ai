import { EndPoint, DEFAULT_SEARCH_ENGINE_TIMEOUT, BING_MKT, REFERENCE_COUNT } from './constant';
import { httpRequest } from './utils';

/**
 * Search with bing and return the contexts.
 */
export const searchWithBing = async (query: string, subscriptionKey: string) => {
  try {
    const res = await httpRequest({
      endpoint: EndPoint.BING_SEARCH_V7_ENDPOINT,
      timeout: DEFAULT_SEARCH_ENGINE_TIMEOUT,
      query: {
        q: query,
        mkt: BING_MKT
      },
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });
    const result = await res.json();
    return result?.webPages?.value.slice(0, REFERENCE_COUNT);
  } catch(err) {
    console.log('Error encountered:', err);
    return [];
  }
};

/**
 * Search with google and return the contexts.
 */
export const searchWithGoogle = async () => {
  return [];
};
