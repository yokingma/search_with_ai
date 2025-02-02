import { BaseChat } from './base/chat';
import OpenAI from 'openai';
import util from 'util';
import { IChatResponse, IStreamHandler } from '../../interface';
import { DefaultSystem } from '../utils/constant';
import { IChatOptions } from './base/openai';

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
  }

  async chat(options: IChatOptions, onMessage?: IStreamHandler): Promise<IChatResponse> {
    if (!this.openai) throw new Error('Lepton AI: Key is Required.');
    const { system = DefaultSystem, messages, model } = options;
    const url = this.getBaseURL(model);
    this.openai.baseURL = url;
    if (system) messages.unshift({ role: 'system', content: system });


    if (typeof onMessage === 'function') {
      const stream = await this.openai.chat.completions.create({
        messages,
        model,
        stream: true
      });
      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0].delta.content || '';
        const msg = {
          content: chunk.choices[0].delta.content || ''
        };
        if (chunk.choices[0]) onMessage?.(msg, false);
      }
      onMessage?.(null, true);
      return {
        content: content
      };
    }

    const response = await this.openai.chat.completions.create({
      messages,
      model,
      stream: false
    });
    return {
      content: response.choices[0].message.content || ''
    };
  }

  public async listModels() {
    return [];
  }

  private getBaseURL(model: string) {
    // Mixtral-8*7b -> mixtral-8x7b
    return util.format(BASE_URLS, model).replace('*', 'x').toLowerCase();
  }
}

export const lepton = new LeptonChat();
