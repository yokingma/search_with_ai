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