import { BaseOpenAIChat } from './base/openai';

const baseURL = 'https://api.lingyiwanwu.com/v1';
const key = process.env.YI_KEY;


export const yi = new BaseOpenAIChat('yi', key, baseURL);
