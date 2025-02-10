import { EndPoint, DEFAULT_SEARCH_ENGINE_TIMEOUT, BING_MKT } from '../libs/utils/constant';
import { httpRequest } from '../libs/utils';
import { Sogou } from '../libs/search/sogou';
import searxng, { ESearXNGCategory } from '../libs/search/searxng';
import { webSearch } from '../libs/search/chatglm';
import { tavilySearch } from '../libs/search/tavily';
import { logger } from '../logger';
import { getConfig } from '../config';
import { retryAsync } from '../libs/utils';
import { ISearchResponseResult } from '../interface';

// Function to search with SearXNG
export const searchWithSearXNG = async (
  query: string,
  categories?: ESearXNGCategory[],
  language = 'all'
) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  language = getConfig('SEARXNG_LANGUAGE', language);
  const defaultEngines = getConfig('SEARXNG_ENGINES', '').split(',');
  const engines = defaultEngines.map(item => item.trim());

  // Scientific search only supports English, so set to all.
  if (categories?.includes(ESearXNGCategory.SCIENCE)) language = 'all';

  try {
    const res = await searxng({
      q: query,
      categories,
      language,
      engines: engines.join(','),
    });
    return res;
  } catch (err) {
    logger.error('[SearXNG Search Error]:', err);
    throw err;
  }
};

// Function to search with Bing
export const searchWithBing = async (query: string): Promise<ISearchResponseResult[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const subscriptionKey = getConfig('BING_SEARCH_KEY');
  if (!subscriptionKey) {
    throw new Error('Bing search key is not provided.');
  }

  try {
    const res = await httpRequest({
      endpoint: EndPoint.BING_SEARCH_V7_ENDPOINT,
      timeout: DEFAULT_SEARCH_ENGINE_TIMEOUT,
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

// Search with Google
export const searchWithGoogle = async (query: string): Promise<ISearchResponseResult[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const key = getConfig('GOOGLE_SEARCH_KEY');
  const id = getConfig('GOOGLE_SEARCH_ID');
  if (!key || !id) {
    throw new Error('Google search key or ID is not provided.');
  }

  try {
    const res = await httpRequest({
      method: 'GET',
      endpoint: EndPoint.GOOGLE_SEARCH_ENDPOINT,
      query: {
        key,
        cx: id,
        q: query,
      },
      timeout: DEFAULT_SEARCH_ENGINE_TIMEOUT,
    });

    const result = await res.json();
    const list: Record<string, any>[] = result.items ?? [];

    const results: ISearchResponseResult[] = list.map(
      (item: Record<string, any>, index: number) => {
        return {
          id: index + 1,
          name: item.title,
          url: item.link,
          formattedUrl: item.formattedUrl,
          snippet: item.snippet,
          imageLink: item.image?.thumbnailLink,
          imageContextLink: item.image?.contextLink,
        };
      }
    );

    return results;
  } catch (err) {
    logger.error('Google Search Error:', err);
    throw err;
  }
};

// Function to search with Sogou
export const searchWithSogou = async (query: string): Promise<ISearchResponseResult[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  try {
    const sogou = new Sogou(query);
    await sogou.init();
    const list = await sogou.getResults();

    const results: ISearchResponseResult[] = list.map((item, index) => {
      return {
        id: index + 1,
        ...item,
        url: item.url || '',
      };
    });

    return results;
  } catch (err) {
    logger.error('Sogou Search Error:', err);
    throw err;
  }
};

export const searchWithTavily = async (query: string): Promise<ISearchResponseResult[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }
  const count = process.env.REFERENCE_COUNT || 8;
  const results = await tavilySearch(
    query,
    {
      topic: 'general',
      timeRange: 'year',
      searchDepth: 'basic',
      maxResults: +count,
    }
  );
  return results;
};

// Function to search with ChatGLM
export const searchWithChatGLM = async (query: string): Promise<ISearchResponseResult[]> => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  try {
    const list = await webSearch(query);

    const results: ISearchResponseResult[] = list.map((item, index) => {
      return {
        id: index + 1,
        name: item.title,
        url: item.link,
        snippet: item.content,
        icon: item.icon,
        media: item.media,
      };
    });

    return results;
  } catch (err) {
    logger.error('ChatGLM Search Error:', err);
    throw err;
  }
};

// Example usage with retry mechanism
export const searchWithSearXNGRetry = async (
  query: string,
  categories?: ESearXNGCategory[],
  language = 'all'
) => {
  return retryAsync(() => searchWithSearXNG(query, categories, language));
};
