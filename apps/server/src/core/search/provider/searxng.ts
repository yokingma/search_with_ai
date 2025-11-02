import { httpRequest, retryAsync } from '../../../utils';
import { getConfig } from '../../../utils/config';
import { ESearXNGCategory, ISearXNGOptions, SearchFunc } from './types';
import { logger } from '../../../utils/logger';

const URL = process.env.SEARXNG_HOSTNAME || 'http://localhost:8080';

const search: SearchFunc = async (params: ISearXNGOptions) => {
  try {
    const { q, pageno = 1, categories = [ESearXNGCategory.GENERAL], engines = '', language = 'all' } = params;
    console.log('searxng language', language);
    const safesearch = process.env.SEARXNG_SAFE ?? 0;
    const res = await httpRequest({
      endpoint: `${URL}/search`,
      method: 'POST',
      query: {
        q,
        pageno,
        categories: categories.join(','),
        format: 'json',
        safesearch,
        language,
        engines
      }
    });
    const result = await res.json();
    if (result.results) {
      return result.results.map((item: any, index: number) => {
        return {
          id: index + 1,
          name: item.title,
          url: item.url,
          source: item.source,
          img: item.img_src,
          thumbnail: item.thumbnail_src,
          snippet: item.content,
          engine: item.engine
        };
      });
    }
    return [];
  } catch (err) {
    return [];
  }
};

const searchWithSearXNG: SearchFunc = async (
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
    const res = await retryAsync(() => search({
      q: query,
      categories,
      language,
      engines: engines.join(','),
    }));

    return res;
  } catch (err) {
    logger.error('[SearXNG Search Error]:', err);
    throw err;
  }
};

export default searchWithSearXNG;
