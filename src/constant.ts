// Search engine related. You don't really need to change this.
export const EndPoint = {
  BING_SEARCH_V7_ENDPOINT: 'https://api.bing.microsoft.com/v7.0/search',
  GOOGLE_SEARCH_ENDPOINT: 'https://customsearch.googleapis.com/customsearch/v1',
  SOGOU_SEARCH_ENDPOINT: 'https://www.sogou.com/web'
};

export const BING_MKT = 'en-US';

// default timeout ms
export const DEFAULT_SEARCH_ENGINE_TIMEOUT = 10000;

export const REFERENCE_COUNT = 8;

// default search keywords
export const DefaultQuery = 'Who said \'live long and prosper';

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
