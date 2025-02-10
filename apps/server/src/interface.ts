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

export enum Provider {
  OLLAMA = 'ollama',
  LMSTUDIO = 'lmstudio',
  OPENAI = 'openai',
  GOOGLE = 'google',
  DEEPSEEK = 'deepseek',
  NVIDIA = 'nvidia',
  SILICONFLOW = 'siliconflow',
  ALIYUN = 'aliyun',
  BAIDU = 'baidu',
  CHATGLM = 'chatglm',
  MOONSHOT = 'moonshot',
  TENCENT = 'tencent',
  LEPTON = 'lepton',
  YI = 'yi'
}

export interface IProviderModel {
  provider: Provider;
  type: string;
  models: string[];
  baseURL?: string;
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

export type TSearchMode = 'simple' | 'deep' | 'research'
