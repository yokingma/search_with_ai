import { BaseOpenAIChat } from './base/openai';

const ApiKey = process.env.GLM_KEY;
const BaseURL = 'https://open.bigmodel.cn/api/paas/v4/';

export const chatglm = new BaseOpenAIChat('chatglm', ApiKey, BaseURL);
