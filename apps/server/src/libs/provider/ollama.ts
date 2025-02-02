import { DefaultSystem } from '../utils/constant';
import { IChatResponse, IStreamHandler, Provider } from '../../interface';
import { BaseChat } from './base/base';
import { Ollama } from 'ollama';
import { IChatOptions } from './base/openai';

const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
const ollamaClient = new Ollama({
  host
});
/**
 * run large language models locally with Ollama.
 */
export class OllamaChat implements BaseChat {
  public platform = Provider.OLLAMA;

  public async chat(options: IChatOptions, onMessage?: IStreamHandler): Promise<IChatResponse> {
    const { system = DefaultSystem, messages, model } = options;
    if (system) {
      messages.unshift({
        role: 'system',
        content: system
      });
    }

    if (typeof onMessage === 'function') {
      const response = await ollamaClient.chat({
        model,
        stream: true,
        messages,
      });
      let content = '';
      for await (const chunk of response) {
        content += chunk.message.content;
        onMessage?.({
          content: chunk.message.content
        }, false);
      }
      onMessage?.(null, true);
      return {
        content
      };
    }

    const response = await ollamaClient.chat({
      model,
      messages
    });
    return {
      content: response.message.content,
      // reasoningContent: response.message.reasoning_content
    };
  }

  public async listModels() {
    const list = await ollamaClient.list();
    return list.models.map((model) => model.name);
  }
}

export const ollama = new OllamaChat();
