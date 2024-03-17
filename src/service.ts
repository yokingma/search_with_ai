import { EndPoint, DEFAULT_SEARCH_ENGINE_TIMEOUT, BING_MKT, REFERENCE_COUNT } from './constant';
import { httpRequest } from './utils';
import { Sogou } from './search/sogou';

/**
 * Search with bing and return the contexts.
 */
export const searchWithBing = async (query: string) => {
  try {
    const subscriptionKey = process.env.BING_SEARCH_KEY;
    if (!subscriptionKey) {
      throw new Error('Bing search key is not provided.');
    }
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
    return result?.webPages?.value.slice(0, REFERENCE_COUNT) || [];
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

/**
 * search with sogou and return the contexts.
 * 搜狗搜索没有API, 网页搜索返回html, 从html中过滤内容
 */
export const searchWithSogou = async (query: string) => {
  const sogou = new Sogou(query);
  await sogou.init();
  // const relatedQueries = sogou.getRelatedQueries();
  const results = await sogou.getResults();
  return results.slice(0, REFERENCE_COUNT);
};
