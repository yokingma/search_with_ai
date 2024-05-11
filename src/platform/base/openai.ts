import OpenAI from 'openai';
import { IChatInputMessage, IStreamHandler } from '../../interface';
import { BaseChat } from './base';

class OpenAIError extends Error {}

export class BaseOpenAIChat implements BaseChat {
  private openai: OpenAI | null;
  public platform: string;

  constructor(platform: string, apiKey?: string, baseURL?: string) {
    this.platform = platform;
    if (!apiKey) throw new OpenAIError('apikey is required.');
    this.openai = new OpenAI({
      baseURL,
      apiKey,
    });
  }

  public async chat(
    messages: IChatInputMessage[],
    model: string,
    system?: string
  ) {
    if (!this.openai) {
      throw new Error('OpenAI key is not set');
    }
    if (system) {
      messages = [
        {
          role: 'system',
          content: system,
        },
        ...messages,
      ];
    }
    const res = await this.openai.chat.completions.create({
      messages,
      model
    });
    return res.choices[0]?.message.content;
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model: string,
    system?: string
  ) {
    if (!this.openai) {
      throw new Error('OpenAI key is not set');
    }
    if (system) {
      messages = [
        {
          role: 'system',
          content: system,
        },
        ...messages,
      ];
    }
    const stream = await this.openai.chat.completions.create({
      messages,
      model,
      stream: true
    });
    for await (const chunk of stream) {
      onMessage?.(chunk.choices[0].delta.content || null, false);
    }
    onMessage?.(null, true);
  }
}
