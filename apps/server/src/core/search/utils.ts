import { googleSearch, bingSearch, tavilySearch, chatglmSearch, sogouSearch, searxngSearch } from '.';
import { TSearchEngine } from './provider/types';

export function getSearchEngine(engine: TSearchEngine) {
  switch (engine) {
    case 'GOOGLE':
      return googleSearch;
    case 'BING':
      return bingSearch;
    case 'SOGOU':
      return sogouSearch;
    case 'SEARXNG':
      return searxngSearch;
    case 'CHATGLM':
      return chatglmSearch;
    case 'TAVILY':
      return tavilySearch;
    default:
      return searxngSearch;
  }
}
