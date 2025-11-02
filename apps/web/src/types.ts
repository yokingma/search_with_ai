import { InjectionKey, Ref } from "vue";

export interface ISelectOptions {
  name: string;
  value: string;
}

export enum EDeepResearchProgress {
  Heartbeat = 'heartbeat',
  Analyzing = 'analyzing',
  Start = 'start',
  Searching = 'searching',
  Researching = 'researching',
  Reporting = 'reporting',
  Done = 'done'
}

export enum EResearchStatus {
  Searching = 'searching',
  Reading = 'reading'
}

export interface ISearchProgress {
  status: EResearchStatus;
  target: {
    query: string;
    researchGoal: string;
  };
  total?: number;
}

export interface IProcessResearchProgress {
  currentDepth: number;
  currentQuery: string;
  visitedUrls: string[];
  searchProgress?: ISearchProgress;
}

export interface IResearchProgress {
  time: number;
  progress?: EDeepResearchProgress;
  researchProgress?: IProcessResearchProgress;
  searchProgress?: ISearchProgress;
  sources?: string[];
  report?: string;
}

export type TSearCategory = 'general' | 'science' | 'images' | 'videos' | 'news'
export type TSearchEngine = 'GOOGLE' | 'BING' | 'SOGOU' | 'SEARXNG' | 'CHATGLM'

export type Theme = 'dark' | 'light';
export type Lan = 'zh' | 'en' | 'ptBR';

export interface IChatInputParams {
  value: string;
  enabledDeepResearch?: boolean;
  enabledScience?: boolean;
}

export interface IModelItem {
  name: string;
  provider: string;
  type: string;
  alias?: string;
}

export type Role = 'user' | 'assistant' | 'system' | 'function';
export interface IContextImage {
  url: string
  uuid: string
}

interface IAgentProcessedEvent<Event extends string = string, Data extends string | Record<string, any> = string> {
    title: string;
    event: Event;
    data: Data;
}

interface IChatSource {
  datetime?: string;
  reasoning_duration?: number;
  contexts?: Record<string, any>[];
  images?: Record<string, any>[];
  [x: string]: any;
}

export interface IChatMessage {
  role: Role
  content: string
  reasoning_content?: string
  source?: IChatSource
  events?: Array<IAgentProcessedEvent<string, string | Record<string, any>>>
}

export const scrollWrapperKey = Symbol('scrollWrapper') as InjectionKey<{
  scrollWrapper: Ref<HTMLElement | null>
}>;