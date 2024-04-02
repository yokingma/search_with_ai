import { BaseChat } from './base';
import OpenAI from 'openai';
import util from 'util';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { LeptonModels } from '../constant';

const BASE_URLS = 'https://%s.lepton.run/api/v1';

export class LeptonChat implements BaseChat {
  private key: string;
  private openai: OpenAI | null;

  constructor() {
    this.key = process.env.LEPTON_KEY || '';
    if (this.key) {
      this.openai = new OpenAI({
        apiKey: this.key
      });
    } else {
      this.openai = null;
    }
    console.log('Lepton AI loaded.');
  }

  async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = LeptonModels.MIXTRAL8x7B
  ): Promise<void> {
    if (!this.openai) throw new Error('Lepton AI: Key is Required.');
    const url = this.getBaseURL(model);
    this.openai.baseURL = url;
    const stream = await this.openai.chat.completions.create({
      messages,
      model,
      max_tokens: 2048,
      stream: true
    });
    for await (const chunk of stream) {
      if (chunk.choices[0]) onMessage?.(chunk.choices[0].delta.content || null, false);
    }
    onMessage?.(null, true);
  }

  private getBaseURL(model = LeptonModels.MIXTRAL8x7B) {
    // Mixtral-8*7b -> mixtral-8x7b
    return util.format(BASE_URLS, model).replace('*', 'x').toLowerCase();
  }
}

export const lepton = new LeptonChat();
