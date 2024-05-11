import { BaseChat } from './base/base';
import OpenAI from 'openai';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { MoonshotModels } from '../constant';
const baseURL = 'https://api.moonshot.cn/v1';

class MoonshotChat implements BaseChat {
  private key?: string;
  private openai: OpenAI | null;
  public platform = 'moonshot';

  constructor() {
    this.key = process.env.MOONSHOT_KEY;
    if (this.key) {
      this.openai = new OpenAI({
        baseURL,
        apiKey: this.key
      });
    } else {
      this.openai = null;
    }
    console.log('[Moonshot BaseURL]:', baseURL);
  }

  async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = MoonshotModels.MOONSHOT8K,
    system?: string | undefined
  ): Promise<void> {
    if (!this.openai) throw new Error('Moonshot: Key is Required.');
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

  async listModels() {
    if (!this.openai) throw new Error('Moonshot: Key is Required.');
    const models = await this.openai.models.list();
    console.log('Moonshot: Models:', models);
    return models.data.map((model) => model.id);
  }
}

export const moonshot = new MoonshotChat();
