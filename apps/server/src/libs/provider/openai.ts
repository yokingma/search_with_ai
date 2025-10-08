import OpenAI from 'openai';
import { IChatInputMessage, IChatResponse, IStreamHandler, Provider } from '../../interface';
import { BaseChat } from './base';

export interface IChatOptions {
  messages: IChatInputMessage[];
  model: string;
  system?: string;
  temperature?: number;
}

export class BaseOpenAIChat implements BaseChat {
  private openai: OpenAI | null;
  public platform: string;

  constructor(platform: Provider, apiKey?: string, baseURL?: string) {
    this.platform = platform;
    if (apiKey) {
      this.openai = new OpenAI({
        baseURL,
        apiKey,
      });
    }
  }

  async chat(options: IChatOptions): Promise<IChatResponse>
  async chat(options: IChatOptions, onMessage: IStreamHandler): Promise<IChatResponse>

  async chat(options: IChatOptions, onMessage?: IStreamHandler) {
    if (!this.openai) {
      throw new Error(`${this.platform} key is not set`);
    }
    const { model, system, temperature } = options;
    let messages = options.messages;
    if (system) {
      messages = [
        {
          role: 'system',
          content: system,
        },
        ...messages,
      ];
    }
    if (typeof onMessage === 'function') {
      const stream = await this.openai.chat.completions.create({
        messages,
        model,
        stream: true,
        temperature
      });
      let content = '';
      let reasoningContent = '';
      for await (const chunk of stream) {
        if (chunk.choices[0]) {
          const response: IChatResponse = {
            content: chunk.choices[0].delta?.content ?? '',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reasoningContent: chunk.choices[0].delta?.reasoning_content ?? '',
          };
          content += response.content;
          reasoningContent += response.reasoningContent ?? '';
          onMessage?.(response);
        }
      }
      return {
        content,
        reasoningContent
      };
    }

    const res = await this.openai.chat.completions.create({
      messages,
      model,
      temperature
    });
    return {
      content: res.choices[0]?.message.content || '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reasoningContent: res.choices[0].message.reasoning_content || '',
    };
  }

  async listModels() {
    if (!this.openai) throw new Error(`${this.platform} Key is Required.`);
    const models = await this.openai.models.list();
    return models.data.map((model) => model.id);
  }
}
