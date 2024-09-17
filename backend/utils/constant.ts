import { IModelInfo } from '../interface';

// Search engine related. You don't really need to change this.
export const EndPoint = {
  BING_SEARCH_V7_ENDPOINT: 'https://api.bing.microsoft.com/v7.0/search',
  GOOGLE_SEARCH_ENDPOINT: 'https://www.googleapis.com/customsearch/v1'
};

export const BING_MKT = 'en-US';

// default timeout ms
export const DEFAULT_SEARCH_ENGINE_TIMEOUT = 20000;

// default search keywords
export const DefaultQuery = 'Who said \'live long and prosper';
export const DefaultSystem = 'You are a helpful assistant.';

export const Models: IModelInfo[] = [
  {
    platform: 'aliyun',
    type: '',
    models: ['qwen-max', 'qwen-max-0428', 'qwen-turbo', 'qwen-plus']
  },
  {
    platform: 'openai',
    type: 'openai',
    models: ['gpt-4o', 'gpt-4o-mini', 'chatgpt-4o-latest', 'gpt-3.5-turbo', 'gpt-4-preview', 'gpt-4-turbo', 'gpt-4']
  },
  {
    platform: 'baidu',
    type: 'baidu',
    models: ['eb-instant', 'completions_pro', 'ernie_bot_8k']
  },
  {
    platform: 'google',
    type: 'gemini',
    models: ['gemini-1.0-pro', 'gemini-1.5-pro', 'gemini-1.5-flash']
  },
  {
    platform: 'yi',
    type: 'openai',
    models: ['yi-large', 'yi-large-turbo', 'yi-medium', 'yi-spark']
  },
  {
    platform: 'moonshot',
    type: 'openai',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k']
  },
  {
    platform: 'lepton',
    type: 'openai',
    models: ['llama2-7b', 'llama2-13b', 'llama2-70b', 'mixtral-8*7b', 'mixtral-8*22b']
  },
  {
    platform: 'deepseek',
    type: 'openai',
    models: ['deepseek-chat', 'deepseek-coder']
  },
  {
    platform: 'chatglm',
    type: 'openai',
    models: ['glm-4', 'glm-4-plus', 'glm-4-air', 'glm-4-airx', 'glm-4-flash']
  },
  {
    platform: 'tencent',
    type: 'tencent',
    models: ['std', 'pro']
  }
];
