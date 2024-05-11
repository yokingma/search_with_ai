import { BaseChat } from './base/base';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { DefaultSystem, GoogleModels } from '../constant';
import { httpRequest } from '../utils';
import { fetchEventData } from 'fetch-sse';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

const URLS = {
  geminiPro: '/models/gemini-pro:generateContent',
  geminiProStream: '/models/gemini-pro:streamGenerateContent?alt=sse',
};

export class GoogleChat implements BaseChat {
  private key?: string;
  private baseUrl?: string;
  public platform = 'google';

  constructor() {
    this.key = process.env.GOOGLE_KEY;
    this.baseUrl = process.env.GOOGLE_PROXY_URL || BASE_URL;
    console.log('GoogleAI BaseURL: ', this.baseUrl);
  }

  public async chat(
    messages: IChatInputMessage[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    model = GoogleModels.GEMINI_PRO
  ) {
    const msgs = this.transformMessage(messages);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    model = GoogleModels.GEMINI_PRO,
    system = DefaultSystem
  ) {
    const msgs = this.transformMessage(messages);
    if (system) {
      msgs.unshift({
        role: 'user',
        parts: [
          {
            text: system
          }
        ]
      }, {
        role: 'model',
        parts: [
          {
            text: 'ok.'
          }
        ]
      });
    }
    const url = `${this.baseUrl}${URLS.geminiProStream}`;
    const data = {
      contents: msgs
    };
    const abort = new AbortController();
    await fetchEventData(url, {
      method: 'POST',
      data,
      signal: abort.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.key
      },
      onOpen: async () => {
        //
      },
      onMessage: (eventData) => {
        const data = eventData?.data;
        const result = JSON.parse(data || '{}');
        const msg = result.candidates?.[0]?.content?.parts[0]?.text ?? '';
        onMessage(msg, false);
      },
      onClose: () => {
        onMessage(null, true);
      },
      onError: (error) => {
        abort.abort();
        console.log(error);
      },
    });
  }

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

export const google = new GoogleChat();
