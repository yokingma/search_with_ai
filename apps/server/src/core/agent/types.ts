/**
 * Search result item definition (e.g. search results)
 */
export interface SearchResultItem<T = any> {
  id: string | number;
  title: string;
  content: string;
  source?: string;
  url?: string;
  date?: string;
  // confidence score
  score?: number;
  raw: T;
}

export type SearcherFunction = (input: {
  query: string;
  count: number;
}) => Promise<SearchResultItem[]>;
