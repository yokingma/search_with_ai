/**
 * 来自智谱的搜索接口
 * @reference https://bigmodel.cn/dev/api/search-tool/web-search
 */

import { getConfig } from '../../../utils/index.js';
import { SearchFunc } from './types.js';

const BaseUrl = 'https://open.bigmodel.cn/api/paas/v4/web_search';

export interface IZhipuSearchResult<
  T extends Record<string, any> = Record<string, any>
> {
  results: T[];
  intent: Record<string, any> | null;
}

export interface ZhipuWebSearchItem {
  icon: string;
  title: string;
  link: string;
  content: string;
  media: string;
  refer: string;
  publish_date: string;
}

export interface ZhipuWebSearchOptions {
  engine?: ZhipuSearchEngine | string;
  searchIntent?: boolean;
  count?: number;
}

export type ZhipuSearchEngine =
  | 'search_std'
  | 'search_pro'
  | 'search_pro_sogou'
  | 'search_pro_quark'
  | 'search_pro_jina'
  | 'search_pro_bing';

export const zhipuSearch: SearchFunc = async (query: string, options: ZhipuWebSearchOptions) => {
  const key = getConfig('ZHIPU_KEY');
  if (!key) {
    throw new Error('Zhipu search key is not provided.');
  }
  const {
    engine = 'search_std',
    searchIntent = false,
    count = 10,
  } = options;
  const params = {
    search_engine: engine,
    search_query: query,
    search_intent: searchIntent,
    count,
  };

  const res = await fetch(BaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  const results = data.search_result as ZhipuWebSearchItem[];
  // const intent = data.search_intent;

  return results.map((item, index) => ({
    id: index + 1,
    name: item.title,
    url: item.link,
    snippet: item.content,
  }));
};
