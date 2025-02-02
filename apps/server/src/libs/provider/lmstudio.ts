import { DefaultSystem } from '../utils/constant';
import { IChatResponse, IStreamHandler, Provider } from '../../interface';
import { BaseChat } from './base/base';
import { LMStudioClient } from '@lmstudio/sdk';
import { IChatOptions } from './base/openai';

const host = process.env.OLLAMA_HOST || 'localhost:1234';
const lmstudioClient = new LMStudioClient({
  baseUrl: `ws://${host}`
});
/**
 * run large language models locally with LMStudio.
 */
export class LMStudioChat implements BaseChat {
  public platform = Provider.LMSTUDIO;

  public async chat(options: IChatOptions, onMessage?: IStreamHandler): Promise<IChatResponse> {
    const { system = DefaultSystem, messages, model } = options;
    if (system) {
      messages.unshift({
        role: 'system',
        content: system
      });
    }

    if (typeof onMessage === 'function') {
      let content = '';
      const loadedModel = await lmstudioClient.llm.load(model);
      const response = loadedModel.respond(messages);
      for await (const chunk of response) {
        content += chunk.content;
        onMessage?.({
          content: chunk.content
        }, false);
      }

      onMessage?.(null, true);
      return {
        content
      };
    }

    const loadedModel = await lmstudioClient.llm.load(model);
    const response = await loadedModel.respond(messages);

    return {
      content: response.content
    };
  }

  public async listModels() {
    const models = await lmstudioClient.llm.listLoaded();
    if (models.length === 0) return Promise.reject('No models loaded.');
    return models.map((x: any) => {
      return x.identifier;
    });
  }
}

export const lmstudio = new LMStudioChat();
