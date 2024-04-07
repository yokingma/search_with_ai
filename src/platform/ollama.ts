import { IChatInputMessage, IStreamHandler } from '../interface';
import { BaseChat } from './base';
import ollama from 'ollama';

/**
 * run large language models locally with Ollama.
 */
export class OllamaChat implements BaseChat {
  public async chat(
    messages: IChatInputMessage[],
    model = 'llama2'
  ): Promise<string | null> {
    const response = await ollama.chat({
      model,
      messages
    });
    return response.message.content;
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = 'llama2'
  ): Promise<void> {
    const response = await ollama.chat({
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
    return ollama.list();
  }
}

export const local = new OllamaChat();
