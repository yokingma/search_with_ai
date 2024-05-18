import { BaseOpenAIChat } from './base/openai';
const baseURL = 'https://api.moonshot.cn/v1';

export const moonshot = new BaseOpenAIChat('moonshot', process.env.MOONSHOT_KEY, baseURL);
