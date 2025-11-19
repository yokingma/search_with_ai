import Models from '../../model.json';
import { IProviderItemConfig } from '../../interface.js';
import { BaseOpenAIChat } from './openai.js';
import { GeminiChat } from './gemini.js';
import { BaseAnthropicChat } from './anthropic.js';

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
    case 'gemini':
      return new GeminiChat(key, baseUrl);
    case 'anthropic':
      return new BaseAnthropicChat(provider, key, baseUrl);
    case 'vertexai':
      return new GeminiChat(key, baseUrl, true);
    case 'openai':
    default:
      return new BaseOpenAIChat(provider, key, baseUrl);
  }
}
