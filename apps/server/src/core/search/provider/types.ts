export type TSearchEngine = 'GOOGLE' | 'BING' | 'SOGOU' | 'SEARXNG' | 'ZHIPU' | 'TAVILY';

export interface ISearchResponseResult {
  id?: number;
  name: string;
  url: string;
  snippet: string;
  thumbnail?: string;
  img?: string;
  source?: string;
  engine?: string;
  [key: string]: string | number | unknown;
}

export type SearchFunc = (...args: any[]) => Promise<ISearchResponseResult[]>;

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
