const URL = process.env.SEARXNG_HOSTNAME || 'http://localhost:8080';
import { httpRequest } from '../utils';
import { ISearchResponseResult } from '../interface';
export interface ISearXNGOptions {
  q: string;
  pageno?: number;
  categories?: ESearXNGCategory[];
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
    const { q, pageno = 1, categories = [ESearXNGCategory.GENERAL] } = params;
    const res = await httpRequest({
      endpoint: `${URL}/search`,
      method: 'POST',
      query: {
        q,
        pageno,
        categories: categories.join(','),
        format: 'json'
      }
    });
    const result = await res.json();
    if (result.results) {
      return result.results.map((item: any, index: number) => {
        return {
          id: index + 1,
          name: item.title,
          url: item.url,
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
