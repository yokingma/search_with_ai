import { type AllModels } from './constant';

export type SearchFunc = (...args: any[]) => Promise<any[]>;

export enum EBackend {
  GOOGLE = 'GOOGLE',
  BING = 'BING'
}

export type TModelKeys = keyof typeof AllModels


export type TStreamHandler = (message: string | null, done: boolean) => void;
