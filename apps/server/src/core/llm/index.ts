import Models from '../../model.json';
import { IProviderItemConfig } from '../../interface';
import { BaseOpenAIChat } from './openai';
import { GeminiChat } from './gemini';

const models = Models as IProviderItemConfig[];

export function getProviderClient(provider: string, key?: string, baseUrl?: string) {
  const target = models.find(item => {
    return item.provider === provider;
  });

  if (!target) {
    throw new Error(`Provider ${provider} not found`);
  }

  baseUrl = baseUrl || target.baseURL;

  // api type
  switch (target.type) {
    case 'openai':
      return new BaseOpenAIChat(provider, key, baseUrl);
    case 'gemini':
      return new GeminiChat();
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}
