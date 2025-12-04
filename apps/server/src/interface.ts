import { ToolCall } from 'langchain';

export interface RequestConfig {
  endpoint: string;
  timeout?: number;
  query?: Record<string, any>;
  data?: BodyInit | null;
  headers?: Record<string, any>;
  method?: RequestInit['method']
}

export type ChatRoleType = 'user' | 'assistant' | 'system' | 'tool';

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

/**
 * Standard chat message from user, assistant, or system.
 * Does not include tool messages.
 */
export interface IChatInputMessage {
  content: string;
  role: Exclude<ChatRoleType, 'tool'>;
}

/**
 * Tool message containing the result of a tool execution.
 * Must include tool_call_id to link back to the original tool call.
 */
export interface IChatInputToolMessage {
  role: 'tool';
  content: string;
  tool_call_id: string;
}

/**
 * Union type for all possible input message types.
 * Use this when accepting any kind of chat message.
 */
export type IChatMessage = IChatInputMessage | IChatInputToolMessage;

export interface IChatResponse {
  content: string;
  role: ChatRoleType;
  reasoningContent?: string;
  toolCalls?: IToolCall[];
  contexts?: unknown;
  usage?: {
    outputTokens: number;
    inputTokens: number;
  };
}

export interface IToolCall extends ToolCall {
  status: 'pending' | 'completed' | 'error' | 'interrupted';
  result: string;
}

export interface IStreamHandler {
  (response: IChatResponse | string | null, done?: boolean): void
}
