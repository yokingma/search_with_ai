import OpenAI from 'openai';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { AllModels } from '../constant';
import { BaseChat } from './base';

export class OpenAIChat implements BaseChat {
  private key?: string;
  private baseUrl?: string;
  private openai: OpenAI;
  constructor() {
    this.key = process.env.OPENAI_KEY;
    this.baseUrl = process.env.OPENAI_PROXY_URL;
    this.openai = new OpenAI({
      baseURL: this.baseUrl,
      apiKey: this.key
    });
    console.log('OpenAI BaseURL:', this.baseUrl);
  }

  public async chat(
    messages: IChatInputMessage[],
    model = AllModels.GPT35TURBO,
    system?: string
  ) {
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
