import { googleSearch, bingSearch, tavilySearch, zhipuSearch, sogouSearch, searxngSearch, bochaSearch, exaSearch, sofyaSearch } from './index.js';
import { TSearchEngine } from './provider/types.js';

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
    case 'ZHIPU':
      return zhipuSearch;
    case 'TAVILY':
      return tavilySearch;
    case 'BOCHA':
      return bochaSearch;
    case 'EXA':
      return exaSearch;
    case 'SOFYA':
      return sofyaSearch;
    default:
      return searxngSearch;
  }
}
