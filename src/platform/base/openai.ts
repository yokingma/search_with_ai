import OpenAI from 'openai';
import { AllModels } from '../../constant';
import { IChatInputMessage, IStreamHandler } from '../../interface';
import { BaseChat } from '../base';

class OpenAIError extends Error {}

export class BaseOpenAIChat implements BaseChat {
  private openai: OpenAI | null;

  constructor(apiKey?: string, baseURL?: string) {
    if (!apiKey) throw new OpenAIError('apikey is required.');
    this.openai = new OpenAI({
      baseURL,
      apiKey,
    });
  }

  public async chat(
    messages: IChatInputMessage[],
    model = AllModels.GPT35TURBO,
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
    model = AllModels.GPT35TURBO,
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
