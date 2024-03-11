// Search engine related. You don't really need to change this.
export const EndPoint = {
  BING_SEARCH_V7_ENDPOINT: 'https://api.bing.microsoft.com/v7.0/search',
  GOOGLE_SEARCH_ENDPOINT: 'https://customsearch.googleapis.com/customsearch/v1'
};

export const BING_MKT = 'en-US';

// default timeout ms
export const DEFAULT_SEARCH_ENGINE_TIMEOUT = 10000;

export const REFERENCE_COUNT = 9;

// default search keywords
export const DefaultQuery = 'Who said \'live long and prosper';
export const DefaultSystem = 'You are a helpful assistant.';

// A set of stop words to use - this is not a complete set, and you may want to
// add more given your observation.
export const StopWords = [
  '<|im_end|>',
  '[End]',
  '[end]',
  '\nReferences:\n',
  '\nSources:\n',
  'End.',
];

export const AliyunModels = {
  QWEN_MAX: 'qwen-max',
  QWEN_MAX1201: 'qwen-max-1201',
  QWEN_TURBO: 'qwen-turbo',
  QWEN_PLUS: 'qwen-plus'
};

export const OpenAIModels = {
  GPT35TURBO: 'gpt-3.5-turbo',
  GPT4: 'gpt-4',
  GPT4TURBO_PREVIEW: 'gpt-4-turbo-preview'
};

export const BaiduModels = {
  'ERNIE-Bot-turbo': 'eb-instant',
  'ERNIE-Bot-4': 'completions_pro',
  'ERNIE-Bot-8K': 'ernie_bot_8k',
};

export const AllModels = Object.assign({}, AliyunModels, OpenAIModels, BaiduModels);

export const UserAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.95 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.95 Safari/537.36 Edg/108.0.1462.54',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12.3; en-US) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
  'Mozilla/5.0 (Linux; Android 12; SM-G988U Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'
];
