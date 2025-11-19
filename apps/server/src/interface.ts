export interface RequestConfig {
  endpoint: string;
  timeout?: number;
  query?: Record<string, any>;
  data?: BodyInit | null;
  headers?: Record<string, any>;
  method?: RequestInit['method']
}

export type ChatRoleType = 'user' | 'assistant' | 'system';

export interface IModelItemConfig {
  name: string;
  alias?: string;
  description?: string;
  maxTokens?: number;
  intentAnalysis?: boolean;
  [x: string]: any;
}

export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'vertexai';

export interface IProviderItemConfig {
  provider: string;
  type: ProviderType;
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
  (response: IChatResponse | Record<string, any> | string | null, done?: boolean): void
}
