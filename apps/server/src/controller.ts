import { Context } from 'koa';
import { SearchChat } from './core/agent';
import Models from './model.json';
import { IProviderItemConfig, IChatInputMessage } from './interface';
import { ESearXNGCategory, TSearchEngine } from './core/search';
import Joi from 'joi';
// import { DeepResearch, EResearchProgress } from './service/research';

const models = Models as IProviderItemConfig[];

interface ISearchChatRequest {
  messages: IChatInputMessage[];
  engine: TSearchEngine;
  categories?: ESearXNGCategory[];
  language?: string;
  provider: string;
  model: string;
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
  model: Joi.string().required(),
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

  const { messages, engine, categories, language, provider, model } = value;

  console.log(messages, engine, categories, language, provider, model);

  const searchChat = new SearchChat({
    model,
    engine,
    provider
  });

  await searchChat.chat({
    messages,
    searchOptions: { categories, language }
  }, (response, done) => {
    if (done) return;
    const eventData = `data:${JSON.stringify({ data: response })}\n\n`;
    ctx.res.write(eventData, 'utf-8');
  });
  ctx.res.write('[DONE] \n\n');
  ctx.res.end();

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
