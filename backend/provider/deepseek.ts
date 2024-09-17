import { BaseOpenAIChat } from './base/openai';

const ApiKey = process.env.DEEPSEEK_KEY;
const BaseURL = 'https://api.deepseek.com/v1';

export const deepseek = new BaseOpenAIChat('deepseek', ApiKey, BaseURL);
