import { BaseOpenAIChat } from './base/openai';

const ApiKey = process.env.OPENAI_KEY;
const BaseURL = process.env.OPENAI_PROXY_URL;

export const openai = new BaseOpenAIChat('openai', ApiKey, BaseURL);
