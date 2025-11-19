import { logger, httpRequest, getConfig } from '../../../utils/index.js';
import { ISearchResponseResult, SearchFunc } from './types.js';

const GOOGLE_SEARCH_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';
const TIMEOUT = 20000;

const searchWithGoogle: SearchFunc = async (query: string) => {
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
      endpoint: GOOGLE_SEARCH_ENDPOINT,
      query: {
        key,
        cx: id,
        q: query,
      },
      timeout: TIMEOUT,
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

export default searchWithGoogle;
