import { IChatInputMessage, IStreamHandler } from '../interface';
import { httpRequest } from '../utils';
import { BaseChat } from './base/base';
import { fetchEventData } from 'fetch-sse';

const BaseURL = 'https://dashscope.aliyuncs.com/api/v1/';
const APIS = {
  qwen: 'services/aigc/text-generation/generation',
  background: 'services/aigc/background-generation/generation',
  task: 'tasks/%s',
  embedding: 'services/embeddings/text-embedding/text-embedding',
};

export class AliyunChat implements BaseChat {
  private key?: string;
  platform = 'aliyun';

  constructor() {
    this.key = process.env.ALIYUN_KEY;
  }

  public async chat(
    messages: IChatInputMessage[],
    model: string,
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
    const options = {
      input: {
        messages,
      },
    };
    const url = `${BaseURL}${APIS.qwen}`;
    const payload = JSON.stringify({
      model,
      input: options.input
    });
    const res = await httpRequest({
      endpoint: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.key}`
      },
      data: payload
    });
    const data = await res.json();
    if (data?.message) {
      console.error(data);
      throw new Error(data.message ?? 'bad request.');
    }
    return data.output.text;
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model: string,
    system?: string
  ): Promise<void> {
    if (system) {
      messages = [
        {
          role: 'system',
          content: system,
        },
        ...messages,
      ];
    }
    const options = {
      input: {
        messages,
      }
    };
    const url = `${BaseURL}${APIS.qwen}`;
    const payload = {
      model,
      input: options.input,
      parameters: {
        incremental_output: true
      }
    };
    const abort = new AbortController();
    const key = this.key;
    try {
      await fetchEventData(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        data: payload,
        signal: abort.signal,
        onMessage: (eventData) => {
          const data = eventData?.data;
          try {
            const result = JSON.parse(data || '{}');
            const msg = result.output?.text ?? '';
            onMessage(msg, false);
          } catch(error) {
            console.error('Aliyun onMessage Error: ', error);
          }
        },
        onClose: () => {
          onMessage(null, false);
        }
      });
    } catch (err) {
      console.error(err);
      abort.abort();
    }
  }
}

export const aliyun = new AliyunChat();
