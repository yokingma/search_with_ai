// Search engine related. You don't really need to change this.
export const EndPoint = {
  BING_SEARCH_V7_ENDPOINT: 'https://api.bing.microsoft.com/v7.0/search',
  GOOGLE_SEARCH_ENDPOINT: 'https://customsearch.googleapis.com/customsearch/v1'
};

export const BING_MKT = 'en-US';

// default timeout ms
export const DEFAULT_SEARCH_ENGINE_TIMEOUT = 10000;

export const REFERENCE_COUNT = 8;

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
  QWEN_MAX: 'qwen-max'
};

export const OpenAIModels = {
  GPT35TURBO: 'gpt-3.5-turbo',
  GPT4: 'gpt-4',
  GPT4TURBO_PREVIEW: 'gpt-4-turbo-preview'
};

export const AllModels = Object.assign({}, AliyunModels, OpenAIModels);
