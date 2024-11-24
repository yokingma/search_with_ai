import { httpRequest } from '../utils';
import { ISearchResponseResult } from '../../interface';

const URL = process.env.SEARXNG_HOSTNAME || 'http://localhost:8080';

// https://docs.searxng.org/dev/search_api.html
export interface ISearXNGOptions {
  q: string;
  pageno?: number;
  categories?: ESearXNGCategory[];
  language?: string;
  engines?: string;
}

export enum ESearXNGCategory {
  SCIENCE = 'science',
  IT = 'it',
  GENERAL = 'general',
  IMAGES = 'images',
  VIDEOS = 'videos',
  NEWS = 'news',
  MUSIC = 'music'
}

export default async function search(params: ISearXNGOptions): Promise<ISearchResponseResult[]> {
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
}
