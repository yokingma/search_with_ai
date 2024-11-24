import platform from './libs/provider';

export type SearchFunc = (...args: any[]) => Promise<ISearchResponseResult[]>;

export type TSearchEngine = 'GOOGLE' | 'BING' | 'SOGOU' | 'SEARXNG' | 'CHATGLM';

export type ChatRoleType = 'user' | 'assistant' | 'system';
export interface IChatInputMessage {
  content: string;
  role: ChatRoleType;
}

export type Provider = 'ollama' | 'lmstudio';

export interface IChatResponse {
  text: string;
  usage?: {
    outputTokens: number;
    inputTokens: number;
  };
}

export interface IModelInfo {
  platform: keyof typeof platform;
  type: string;
  models: string[];
}


export interface IStreamHandler {
  (message: string | null, done: boolean): void
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

export type TSearchMode = 'simple' | 'deep' | 'research'
