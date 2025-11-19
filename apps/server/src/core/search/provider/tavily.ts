import { tavily, TavilyClient, TavilySearchOptions } from '@tavily/core';
import { ISearchResponseResult, SearchFunc } from './types.js';

export type SearchDepth = 'basic' | 'advanced';

export type SearchTopic = 'general' | 'news' | 'finance';

export type SearchTimeRange = 'year' | 'month' | 'week' | 'day' | 'y' | 'm' | 'w' | 'd';

let tvly: TavilyClient | null = null;

async function tavilySearch(query: string, options: TavilySearchOptions) {
  if (process.env.TAVILY_KEY && !tvly) {
    tvly = tavily({
      apiKey: process.env.TAVILY_KEY,
    });
  }
  if (!tvly) {
    throw new Error('Tavily client not initialized');
  }
  const res = await tvly.search(query, options);
  const results: ISearchResponseResult[] =  res.results.map((item, index) => ({
    id: index + 1,
    name: item.title,
    url: item.url,
    snippet: item.content,
    rawContent: item.rawContent,
    score: item.score,
    publishedDate: item.publishedDate,
  })) as ISearchResponseResult[];
  return results;
}

const searchWithTavily: SearchFunc = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }
  const count = process.env.REFERENCE_COUNT || 8;
  const results = await tavilySearch(
    query,
    {
      topic: 'general',
      timeRange: 'year',
      searchDepth: 'basic',
      maxResults: +count,
    }
  );
  return results;
};

export default searchWithTavily;
