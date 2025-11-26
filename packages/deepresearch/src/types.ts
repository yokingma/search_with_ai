import { ResearchState } from './state.js';

/**
 * Search result item definition (e.g. search results)
 */
export interface SearchResultItem {
  id: string | number;
  title: string;
  content: string;
  source?: string;
  url?: string;
  date?: string;
  // confidence score
  score?: number;
}

export type SearcherFunction = (
  input: typeof ResearchState.State
) => Promise<SearchResultItem[]>;
