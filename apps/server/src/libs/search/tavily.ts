import { tavily, TavilySearchOptions } from '@tavily/core';
import { ISearchResponseResult } from '../../interface';

export type SearchDepth = 'basic' | 'advanced';

export type SearchTopic = 'general' | 'news' | 'finance';

export type SearchTimeRange = 'year' | 'month' | 'week' | 'day' | 'y' | 'm' | 'w' | 'd';

const tvly = tavily({
  apiKey: process.env.TAVILY_KEY,
});

export async function tavilySearch(query: string, options: TavilySearchOptions) {
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
