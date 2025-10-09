export interface IQueryResult {
  related?: string;
  reasoning?: string;
  answer?: string;
  contexts?: Record<string, any>[];
  images?: Record<string, any>[];
}

export interface ISelectOptions {
  name: string;
  value: string;
}

export type Role = 'user' | 'assistant'

export interface IMessage {
  role: Role;
  content: string;
  reasoning?: string;
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
export type TSearchMode = 'simple' | 'deep' | 'research'
export type TSearchEngine = 'GOOGLE' | 'BING' | 'SOGOU' | 'SEARXNG' | 'CHATGLM'

export type Theme = 'dark' | 'light';
export type Lan = 'zh' | 'en' | 'ptBR';

export type InputParams = {
  value: string;
  enabledThinking?: boolean;
  enabledScience?: boolean;
}

export interface IModelItem {
  name: string;
  provider: string;
  type: string;
  alias?: string;
}
