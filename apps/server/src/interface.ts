import platform from './provider';

export type SearchFunc = (...args: any[]) => Promise<any[]>;

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
  name: string;
  url: string;
  snippet: string;
  thumbnail?: string;
  img?: string;
  source?: string;
  [key: string]: string | undefined;
}

export type TMode = 'simple' | 'deep' | 'research'
