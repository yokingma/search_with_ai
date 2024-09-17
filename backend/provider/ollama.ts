import { DefaultSystem } from '../utils/constant';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { BaseChat } from './base/base';
import { Ollama } from 'ollama';

const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
const ollamaClient = new Ollama({
  host
});
/**
 * run large language models locally with Ollama.
 */
export class OllamaChat implements BaseChat {
  public platform = 'ollama';

  public async chat(
    messages: IChatInputMessage[],
    model = 'llama2',
    system = DefaultSystem
  ): Promise<string | null> {
    if (system) {
      messages.unshift({
        role: 'system',
        content: system
      });
    }
    const response = await ollamaClient.chat({
      model,
      messages
    });
    return response.message.content;
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = 'llama2',
    system = DefaultSystem
  ): Promise<void> {
    if (system) {
      messages.unshift({
        role: 'system',
        content: system
      });
    }
    const response = await ollamaClient.chat({
      model,
      stream: true,
      messages,
    });

    for await (const chunk of response) {
      onMessage?.(chunk.message.content, false);
    }
    onMessage?.(null, true);
  }

  public async list() {
    return ollamaClient.list();
  }
}

export const ollama = new OllamaChat();
