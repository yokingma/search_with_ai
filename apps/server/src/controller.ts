import { Context } from 'koa';
import { SearchChat } from './core/agent/index.js';
import Models from './model.json';
import { IProviderItemConfig, IChatInputMessage } from './interface.js';
import { ESearXNGCategory, TSearchEngine } from './core/search/index.js';
import Joi from 'joi';
import { getConfig } from './utils/index.js';
// import { DeepResearch, EResearchProgress } from './service/research';

const models = Models as IProviderItemConfig[];

interface ISearchChatRequest {
  messages: IChatInputMessage[];
  engine: TSearchEngine;
  categories?: ESearXNGCategory[];
  language?: string;
  systemPrompt?: string;
  temperature?: number;
  provider: string;
  model: string;
  enabledDeepResearch?: boolean;
}

const searchChatSchema = Joi.object<ISearchChatRequest>({
  messages: Joi.array().items(Joi.object({
    role: Joi.string().valid('user', 'assistant', 'system').required(),
    content: Joi.string().required(),
  })),
  engine: Joi.string().required(),
  categories: Joi.array().items(Joi.string()).optional(),
  language: Joi.string().optional().default('all'),
  provider: Joi.string().required(),
  systemPrompt: Joi.string().optional(),
  temperature: Joi.number().optional().default(0.6),
  model: Joi.string().required(),
  enabledDeepResearch: Joi.boolean().optional().default(false),
});

/**
 * Get available models
 */
export const modelsController = async (ctx: Context) => {
  const getModels = models.filter(item => item.models && item.models.length > 0);
  ctx.body = getModels.map(item => ({
    ...item,
    apiKey: '<API_KEY>',
  }));
};

/**
 * Get available search engines
 */
export const enginesController = async (ctx: Context) => {
  const googleKey = getConfig('GOOGLE_SEARCH_KEY');
  const tavilyKey = getConfig('TAVILY_KEY');
  const zhipuKey = getConfig('ZHIPU_KEY');
  const bingKey = getConfig('BING_SEARCH_KEY');
  const availableEngines: { code: TSearchEngine; name: string }[] = [];
  const SEARXNG_URL = getConfig('SEARXNG_HOSTNAME');
  if (SEARXNG_URL) availableEngines.push({ code: 'SEARXNG', name: 'SearXNG' });
  if (googleKey) availableEngines.push({ code: 'GOOGLE', name: 'Google' });
  if (bingKey) availableEngines.push({ code: 'BING', name: 'Bing' });
  if (tavilyKey) availableEngines.push({ code: 'TAVILY', name: 'Tavily' });
  if (zhipuKey) availableEngines.push({ code: 'ZHIPU', name: 'Zhipu' });
  // Sogou are always available
  availableEngines.push({ code: 'SOGOU', name: 'Sogou' });
  ctx.body = {
    count: availableEngines.length,
    list: availableEngines,
  };
};

/**
 * Search and Chat controller
 */
export const searchChatController = async (ctx: Context) => {
  const body = ctx.request.body;
  const { error, value } = searchChatSchema.validate(body);
  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  ctx.res.setHeader('Content-Type', 'text/event-stream');
  ctx.res.setHeader('Cache-Control', 'no-cache');
  ctx.res.setHeader('Connection', 'keep-alive');
  ctx.res.statusCode = 200;

  const { messages, engine, categories, language, provider, model, temperature, systemPrompt } = value;

  // get intent model from config
  const providerConfig = models.find(item => item.provider === provider);
  const intentModel = providerConfig?.models.find(m => m.intentAnalysis === true)?.name;

  try {
    const searchChat = new SearchChat({
      model,
      intentModel, // Use the same model for intent analysis
      engine,
      provider
    });

    await searchChat.chat({
      systemPrompt,
      temperature,
      messages,
      searchOptions: { categories, language }
    }, (response, done) => {
      if (done) return;
      const eventData = `data:${JSON.stringify({ data: response })}\n\n`;
      ctx.res.write(eventData, 'utf-8');
    });
    ctx.res.write('[DONE] \n\n');
    ctx.res.end();
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    ctx.body = { error: msg };
    ctx.status = 500;
  }
};

// export const deepResearchController = async (ctx: Context) => {
//   const query: string = ctx.request.body.query;
//   // llm provider
//   const provider: Provider = ctx.request.body.provider;
//   const model: string = ctx.request.body.model;
//   const reportModel: string = ctx.request.body.reportModel;
//   // search engine
//   const searchEngine: TSearchEngine = ctx.request.body.searchEngine;
//   const llmProvider = getInfoByProvider(provider);
//   // options
//   const { depth = 2, breadth = 2 } = ctx.request.body;

//   const { baseURL } = llmProvider;
//   const keys = getProviderKeys();
//   const apiKey = keys[provider];
//   if (!baseURL || !provider) throw new Error('Provider not found');

//   ctx.res.setHeader('Content-Type', 'text/event-stream');
//   ctx.res.setHeader('Cache-Control', 'no-cache');
//   ctx.res.setHeader('Connection', 'keep-alive');
//   ctx.res.statusCode = 200;

//   const deepResearch = new DeepResearch({
//     llmOptions: {
//       model,
//       baseURL,
//       apiKey,
//       name: provider
//     },
//     reportLlmOptions: {
//       model: reportModel,
//       baseURL,
//       apiKey,
//       name: provider
//     },
//     searchEngine
//   });

//   const startTime = Date.now();


//   // 创建心跳定时器
//   const heartbeat = setInterval(() => {
//     const eventData = `data: ${JSON.stringify({
//       progress: EResearchProgress.Heartbeat,
//       time: Date.now() - startTime
//     })}\n\n`;
//     ctx.res.write(eventData);
//   }, 3000); // 3秒一次

//   try {
//     ctx.res.write(`data: ${JSON.stringify({
//       progress: EResearchProgress.Analyzing,
//       time: Date.now() - startTime
//     })}\n\n`);

//     const combinedQuery = await deepResearch.generateCombinedQuery({
//       initialQuery: query,
//       numFollowUpQuestions: 3
//     });

//     ctx.res.write(`data: ${JSON.stringify({
//       progress: EResearchProgress.Start,
//       time: Date.now() - startTime
//     })}\n\n`);

//     const { learnings, urls } = await deepResearch.research({
//       query: combinedQuery,
//       depth,
//       breadth,
//       onProgress: (progress) => {
//         const eventData = `data: ${JSON.stringify({
//           progress: EResearchProgress.Researching,
//           time: Date.now() - startTime,
//           researchProgress: progress
//         })}\n\n`;
//         ctx.res.write(eventData);
//       }
//     });

//     const eventData = `data: ${JSON.stringify({
//       progress: EResearchProgress.Done,
//       time: Date.now() - startTime,
//       researchProgress: {
//         currentDepth: 0,
//         currentQuery: null,
//         visitedUrls: urls
//       }
//     })}\n\n`;
//     ctx.res.write(eventData);

//     ctx.res.write(`data: ${JSON.stringify({
//       progress: EResearchProgress.Reporting,
//       time: Date.now() - startTime
//     })}\n\n`);

//     await deepResearch.generateReport({
//       combinedQuery,
//       learnings,
//       onProgress: (text: string) => {
//         const eventData = `data: ${JSON.stringify({
//           progress: EResearchProgress.Reporting,
//           time: Date.now() - startTime,
//           report: text
//         })}\n\n`;
//         ctx.res.write(eventData);
//       }
//     });

//     ctx.res.write(`data: ${JSON.stringify({
//       progress: EResearchProgress.Done,
//       time: Date.now() - startTime,
//       sources: urls
//     })}\n\n`);

//     ctx.res.write('[DONE] \n\n');
//     ctx.res.end();

//   } finally {
//     clearInterval(heartbeat);
//     ctx.res.end();
//   }
// };
