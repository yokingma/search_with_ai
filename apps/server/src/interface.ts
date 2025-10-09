export interface RequestConfig {
  endpoint: string;
  timeout?: number;
  query?: Record<string, any>;
  data?: BodyInit | null;
  headers?: Record<string, any>;
  method?: RequestInit['method']
}

export type SearchFunc = (...args: any[]) => Promise<ISearchResponseResult[]>;

export type TSearchEngine = 'GOOGLE' | 'BING' | 'SOGOU' | 'SEARXNG' | 'CHATGLM' | 'TAVILY';

export type ChatRoleType = 'user' | 'assistant' | 'system';

export interface IModelItemConfig {
  name: string;
  alias?: string;
  description?: string;
  maxTokens?: number;
  [x: string]: any;
}

export interface IProviderItemConfig {
  provider: string;
  type: 'openai' | 'gemini' | 'anthropic';
  models: IModelItemConfig[];
  baseURL?: string;
  apiKey?: string;
}

export interface IChatInputMessage {
  content: string;
  role: ChatRoleType;
}

export interface IChatResponse {
  content: string;
  reasoningContent?: string;
  usage?: {
    outputTokens: number;
    inputTokens: number;
  };
}


export interface IStreamHandler {
  (response: IChatResponse | null, done?: boolean): void
}

// search engine result
export interface ISearchResponseResult {
  id?: number;
  name: string;
  url: string;
  snippet: string;
  thumbnail?: string;
  img?: string;
  source?: string;
  engine?: string;
  [key: string]: string | number | undefined;
}
