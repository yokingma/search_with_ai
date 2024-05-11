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

export const AliyunModels = {
  QWEN_MAX: 'qwen-max',
  QWEN_MAX1201: 'qwen-max-1201',
  QWEN_TURBO: 'qwen-turbo',
  QWEN_PLUS: 'qwen-plus'
};

export const OpenAIModels = {
  GPT35TURBO: 'gpt-3.5-turbo',
  GPT4_PREVIEW: 'gpt-4-0125-preview',
  GPT4TURBO_PREVIEW: 'gpt-4-turbo-preview'
};

export const BaiduModels = {
  'ERNIE-Bot-turbo': 'eb-instant',
  'ERNIE-Bot-4': 'completions_pro',
  'ERNIE-Bot-8K': 'ernie_bot_8k'
};

export const GoogleModels = {
  GEMINI_PRO: 'gemini-pro',
  GEMINI_PRO15: 'gemini-1.5-pro-latest'
};

export const YiModels = {
  Yi34B0205: 'yi-34b-chat-0205',
  Yi34B200K: 'yi-34b-chat-200k'
};

export const MoonshotModels = {
  MOONSHOT8K: 'moonshot-v1-8k',
  MOONSHOT32K: 'moonshot-v1-32k',
  MOONSHOT128K: 'moonshot-v1-128k',
};

export const DeepSeekModels = {
  DeepSeekChat: 'deepseek-chat'
};

export const TencentModels = {
  STD: 'standard',
  PRO: 'pro'
};

export const LeptonModels = {
  LLAMA2_7B: 'llama2-7b',
  LLAMA2_13B: 'llama2-13b',
  LLAMA2_70B: 'llama2-70b',
  MIXTRAL8x7B: 'mixtral-8*7b',
  MIXTRAL8x22B: 'mixtral-8*22b'
};

export const AllModels = Object.assign(
  {},
  AliyunModels,
  OpenAIModels,
  BaiduModels,
  GoogleModels,
  YiModels,
  LeptonModels,
  DeepSeekModels
);
