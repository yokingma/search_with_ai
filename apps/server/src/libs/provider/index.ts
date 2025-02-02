import Models from '../../model.json';
import { IProviderModel, Provider } from '../../interface';
import { BaseOpenAIChat } from './base/openai';
import { GoogleChat } from './google';
import { LeptonChat } from './lepton';
import { getProviderKeys } from '../../config';

const models = Models as IProviderModel[];
const keys = getProviderKeys();

export function getProvider(provider: Provider, key?: string, baseUrl?: string) {
  const target = models.find(item => {
    return item.provider === provider;
  });

  if (!target) {
    throw new Error(`Provider ${provider} not found`);
  }

  baseUrl = baseUrl || target.baseURL;

  switch (target.type) {
    case 'openai':
      return new BaseOpenAIChat(provider, key, baseUrl);
    case 'google':
      return new GoogleChat();
    case 'lepton':
      return new LeptonChat();
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}

export function getChatByProvider(providerName: string) {
  const model = models.find(item => {
    return item.provider === providerName;
  });
  if (!model) throw new Error(`Provider ${providerName} not found`);
  const key = keys[model.provider];
  if (!key) throw new Error(`Provider ${model.provider} key not found`);
  const provider = getProvider(model.provider, key);
  return provider.chat.bind(provider);
}
