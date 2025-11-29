import { Exa } from 'exa-js';
import { ISearchResponseResult, SearchFunc } from './types.js';
import { logger, getConfig } from '../../../utils/index.js';

export interface IExaSearchOptions {
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  type?: 'keyword' | 'neural' | 'auto';
}

const searchWithExa: SearchFunc = async (query: string, options?: IExaSearchOptions) => {
  const apiKey = getConfig('EXA_KEY');
  if (!apiKey) {
    throw new Error('Exa API key is not provided.');
  }

  const exa = new Exa(apiKey);

  try {
    // Use search to get snippets/text directly
    // searchAndContents is deprecated
    const result = await exa.search(query, {
      numResults: options?.numResults || 10,
      includeDomains: options?.includeDomains,
      excludeDomains: options?.excludeDomains,
      startPublishedDate: options?.startPublishedDate,
      endPublishedDate: options?.endPublishedDate,
      useAutoprompt: options?.useAutoprompt,
      type: options?.type,
      contents: {
        text: true, // Request text content for snippets
      },
    });

    const results: ISearchResponseResult[] = result.results.map(
      (item: any, index: number) => {
        return {
          id: index + 1,
          name: item.title || '',
          url: item.url,
          snippet: item.text || item.summary || '', // Use text as snippet
          date: item.publishedDate,
          score: item.score,
        };
      }
    );

    return results;
  } catch (err) {
    logger.error('[Exa Search Error]:', err);
    throw err;
  }
};

export default searchWithExa;
