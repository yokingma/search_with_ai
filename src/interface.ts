import { type AllModels } from './constant';

export type SearchFunc = (...args: any[]) => Promise<any[]>;

export enum EBackend {
  GOOGLE = 'GOOGLE',
  BING = 'BING',
  SOGOU = 'SOGOU'
}

export type ChatRoleType = 'user' | 'assistant' | 'system';
export interface IChatInputMessage {
  content: string;
  role: ChatRoleType;
}

export interface IChatResponse {
  text: string;
  usage?: {
    outputTokens: number;
    inputTokens: number;
  };
}

export type TypeModelKeys = keyof typeof AllModels


export interface IStreamHandler {
  (message: string | null, done: boolean): void
}
