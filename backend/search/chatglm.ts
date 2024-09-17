/**
 * 来自智谱的搜索接口，标准版和专业版，标准版没有直接接口[免费，并发100]
 * Web-Search-Pro 专业版联网搜索[付费，并发1~5]
 * 利用glm-4-flash 免费模型，免费web-search 实现免费搜索
 * @reference https://bigmodel.cn/dev/api/search-tool/web-search-pro
 */

const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';
const KEY = process.env.GLM_KEY;

export interface IWebSearchResult {
  index: number;
  icon: string;
  title: string;
  link: string;
  content: string;
  media: string;
  refer: string;
  [x: string]: any;
}

export async function webSearch(query: string): Promise<IWebSearchResult[]> {
  const tools = [
    {
      type: 'web_search',
      web_search: {
        enable: true,
        search_result: true,
        search_query: query,
      },
    },
  ];
  const msg = [
    {
      role: 'user',
      content: 'hi',
    },
  ];

  try {
    const baseUrl = `${BASE_URL}/chat/completions`;
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: msg,
        stream: false,
        tools,
      }),
    });

    const data = await res.json();
    return data?.web_search ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function webSearchPro(query: string): Promise<IWebSearchResult[]> {
  const tool = 'web-search-pro';
  const msg = [
    {
      role: 'user',
      content: query,
    },
  ];

  try {
    const baseUrl = `${BASE_URL}/tools`;
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        messages: msg,
        stream: false,
        tool,
      }),
    });

    const data = await res.json();
    const result = data.choices[0]?.message?.tool_calls;
    return result?.[0] ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
