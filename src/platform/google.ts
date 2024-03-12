import { BaseChat } from './base';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { AllModels, DefaultSystem, GoogleModels } from '../constant';
import { httpRequest } from '../utils';

const BASE_URL = '';

const URLS = {
  geminiPro: 'models/gemini-pro:generateContent',
  geminiProStream: 'models/gemini-pro:streamGenerateContent',
};

export class GoogleChat implements BaseChat {
  private key?: string;
  private baseUrl?: string;
  constructor() {
    this.key = process.env.GOOGLE_KEY;
    this.baseUrl = process.env.GOOGLE_PROXY_URL || BASE_URL;
  }

  public async chat(
    messages: IChatInputMessage[],
    model = GoogleModels.GEMINI_PRO,
    system = DefaultSystem
  ) {
    console.log('Google AI: ', model);
    const msgs = this.transformMessage(messages);
    if (system) {
      if (system) {
        msgs[0].parts[0].text = `${system}\n\n Question: ${msgs[0].parts[0].text}`;
      }
    }
    const url = `${this.baseUrl}/${URLS.geminiProStream}`;
    const res = await httpRequest({
      endpoint: url,
      method: 'POST',
      data: JSON.stringify({
        contents: msgs
      }),
      query: {
        key: this.key,
      },
    });
    const data = await res.json();
    const resMsg = data.candidates?.[0];
    if (res.status !== 200 || !resMsg) {
      throw new Error(data.message ?? 'Google AI request error.');
    }
    return resMsg.content?.parts[0]?.text;
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = GoogleModels.GEMINI_PRO,
    system = DefaultSystem
  ) {}

  private transformMessage(messages: IChatInputMessage[]) {
    return messages.map(msg => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return {
        role,
        parts: [
          {
            text: msg.content,
          },
        ],
      };
    });
  }
}
