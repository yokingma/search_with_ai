import { EndPoint, DEFAULT_SEARCH_ENGINE_TIMEOUT, BING_MKT } from './utils/constant';
import { httpRequest } from './utils/utils';
import { Sogou } from './search/sogou';
import searxng, { ESearXNGCategory } from './search/searxng';
import { webSearch } from './search/chatglm';
import { logger } from './logger';
import { getConfig } from './config';

// Configuration management using environment variables
const getEnv = (key: string, defaultValue: string = '') => getConfig(key) || defaultValue;

// Function to search with SearXNG
export const searchWithSearXNG = async (
  query: string,
  categories?: ESearXNGCategory[],
  language = 'all'
) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  language = getEnv('SEARXNG_LANGUAGE', language);
  const defaultEngines = getEnv('SEARXNG_ENGINES', '').split(',');
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
export const searchWithBing = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const subscriptionKey = getEnv('BING_SEARCH_KEY');
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
    const list = result?.webPages?.value || [];

    return list.map((item: any, index: number) => {
      return {
        id: index + 1,
        name: item.name,
        url: item.url,
        snippet: item.snippet,
      };
    });
  } catch (err) {
    logger.error('[Bing Search Error]:', err);
    throw err;
  }
};

// Function to search with Google
export const searchWithGoogle = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const key = getEnv('GOOGLE_SEARCH_KEY');
  const id = getEnv('GOOGLE_SEARCH_ID');
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
    const list = result.items ?? [];

    return list.map((item: any, index: number) => {
      return {
        id: index + 1,
        name: item.title,
        url: item.link,
        formattedUrl: item.formattedUrl,
        snippet: item.snippet,
        imageLink: item.image?.thumbnailLink,
        imageContextLink: item.image?.contextLink,
      };
    });
  } catch (err) {
    logger.error('Google Search Error:', err);
    throw err;
  }
};

// Function to search with Sogou
export const searchWithSogou = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  try {
    const sogou = new Sogou(query);
    await sogou.init();
    const results = await sogou.getResults();

    return results.map((item, index) => {
      return {
        id: index + 1,
        ...item,
      };
    });
  } catch (err) {
    logger.error('Sogou Search Error:', err);
    throw err;
  }
};

// Function to search with ChatGLM
export const searchWithChatGLM = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  try {
    const results = await webSearch(query);

    return results.map((item, index) => {
      return {
        id: index + 1,
        name: item.title,
        url: item.link,
        snippet: item.content,
        icon: item.icon,
        media: item.media,
      };
    });
  } catch (err) {
    logger.error('ChatGLM Search Error:', err);
    throw err;
  }
};

// Retry mechanism for network requests
const retryAsync = async <T>(
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

// Example usage with retry mechanism
export const searchWithSearXNGRetry = async (
  query: string,
  categories?: ESearXNGCategory[],
  language = 'all'
) => {
  return retryAsync(() => searchWithSearXNG(query, categories, language));
};
