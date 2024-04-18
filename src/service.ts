import { EndPoint, DEFAULT_SEARCH_ENGINE_TIMEOUT, BING_MKT } from './constant';
import { httpRequest } from './utils';
import { Sogou } from './search/sogou';
import searxng from './search/searxng';


export const searchWithSearXNG = async (query: string) => {
  const res = await searxng({ q: query });
  return res;
};

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
    const list = result?.webPages?.value || [];
    return list.map((item: any, index: number) => {
      return {
        id: index + 1,
        name: item.name,
        url: item.url,
        snippet: item.snippet
      };
    });
  } catch(err) {
    console.error('[Bing Search Error]:', err);
    return [];
  }
};

/**
 * Search with google and return the contexts.
 */
export const searchWithGoogle = async (query: string) => {
  if (!query.trim()) return [];
  try {
    const key = process.env.GOOGLE_SEARCH_KEY;
    const id = process.env.GOOGLE_SEARCH_ID;
    const res = await httpRequest({
      method: 'GET',
      endpoint: EndPoint.GOOGLE_SEARCH_ENDPOINT,
      query: {
        key,
        cx: id,
        q: query
      },
      timeout: DEFAULT_SEARCH_ENGINE_TIMEOUT
    });
    const result = await res.json();
    const list = result.items ?? [];
    return list.map((item: any, index: number) => {
      return {
        id: index + 1,
        name: item.title,
        url: item.link,
        formattedUrl: item.formattedUrl,
        snippet: item.snippet,
        imageLink: item.image?.thumbnailLink,
        imageContextLink: item.image?.contextLink
      };
    });
  } catch (err) {
    console.error('Google Search Error:', err);
    return [];
  }
};

/**
 * search with sogou and return the contexts.
 */
export const searchWithSogou = async (query: string) => {
  const sogou = new Sogou(query);
  await sogou.init();
  // const relatedQueries = sogou.getRelatedQueries();
  const results = await sogou.getResults();
  return results.map((item, index) => {
    return {
      id: index + 1,
      ...item
    };
  });
};
