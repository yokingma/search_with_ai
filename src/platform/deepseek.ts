import { BaseOpenAIChat } from './base/openai';

const ApiKey = process.env.DEEPSEEK_KEY;
const BaseURL = process.env.DEEPSEEK_BASE_URL;

export const deepseek = new BaseOpenAIChat(ApiKey, BaseURL);
