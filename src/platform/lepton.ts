import { BaseChat } from './base/base';
import OpenAI from 'openai';
import util from 'util';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { DefaultSystem } from '../constant';

const BASE_URLS = 'https://%s.lepton.run/api/v1';

export class LeptonChat implements BaseChat {
  private key: string;
  private openai: OpenAI | null;
  public platform = 'lepton';

  constructor() {
    this.key = process.env.LEPTON_KEY || '';
    if (this.key) {
      this.openai = new OpenAI({
        apiKey: this.key
      });
    } else {
      this.openai = null;
    }
    console.log('[Lepton AI loaded]');
  }

  async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model: string,
    system = DefaultSystem
  ): Promise<void> {
    if (!this.openai) throw new Error('Lepton AI: Key is Required.');
    const url = this.getBaseURL(model);
    this.openai.baseURL = url;
    if (system) messages.unshift({ role: 'system', content: system });
    const stream = await this.openai.chat.completions.create({
      messages,
      model,
      stream: true
    });
    for await (const chunk of stream) {
      if (chunk.choices[0]) onMessage?.(chunk.choices[0].delta.content || null, false);
    }
    onMessage?.(null, true);
  }

  private getBaseURL(model: string) {
    // Mixtral-8*7b -> mixtral-8x7b
    return util.format(BASE_URLS, model).replace('*', 'x').toLowerCase();
  }
}

export const lepton = new LeptonChat();
