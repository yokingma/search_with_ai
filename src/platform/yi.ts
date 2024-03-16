import OpenAI from 'openai';
import { YiModels } from '../constant';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { httpRequest } from '../utils';
import { BaseChat } from './base';

const baseURL = 'https://api.lingyiwanwu.com/v1';
const URL = '/chat/completions';

export class YiChat implements BaseChat {
  private key?: string;
  private openai: OpenAI;

  constructor() {
    this.key = process.env.YI_KEY;
    this.openai = new OpenAI({
      baseURL,
      apiKey: this.key
    });
    console.log('Yi BaseURL:', baseURL);
  }

  async chat(
    messages: IChatInputMessage[],
    model = YiModels.Yi34B0205,
    system?: string | undefined,
  ): Promise<string | null> {
    if (!this.key) throw new Error('Yi: Key is Required.');
    if (system) {
      messages = [
        {
          role: 'system',
          content: system,
        },
        ...messages,
      ];
    }
    const payload = JSON.stringify({
      model,
      messages
    });
    const res = await httpRequest({
      endpoint: baseURL + URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.key}`
      },
      data: payload
    });
    const data = await res.json();
    const result = data.choices?.[0].message?.content;
    if (typeof result === 'string') return result;
    throw new Error(data.message ?? 'Yi: bad request.');
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = YiModels.Yi34B0205,
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

export const yi = new YiChat();
