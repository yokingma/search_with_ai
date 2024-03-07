import { DefaultSystem, AllModels } from '../constant';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { httpRequest } from '../utils';
import { SSEDecoder } from '../utils/sse';
import { BaseChat } from './base';

const BaseURL = 'https://dashscope.aliyuncs.com/api/v1/';
const APIS = {
  qwen: 'services/aigc/text-generation/generation',
  background: 'services/aigc/background-generation/generation',
  task: 'tasks/%s',
  embedding: 'services/embeddings/text-embedding/text-embedding',
};

export class AliyunChat implements BaseChat {
  private key?: string;
  private sse: SSEDecoder;
  constructor() {
    this.key = process.env.ALIYUN_KEY;
    this.sse = new SSEDecoder();
  }

  public async chat(
    messages: IChatInputMessage[],
    model = AllModels.QWEN_MAX,
    system = DefaultSystem
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
    model = AllModels.QWEN_MAX,
    system = DefaultSystem,
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
    const payload = JSON.stringify({
      model,
      input: options.input,
      parameters: {
        incremental_output: true
      }
    });
    const abort = new AbortController();
    const key = this.key;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: payload,
        signal: abort.signal
      });
      const reader = res.body?.getReader();
      try {
        while(true) {
          if (!reader) break;
          const { value, done } = await reader.read();
          let msg = '';
          if (value) {
            const decoded = this.sse.decode(value);
            const data = decoded?.data;
            const result = JSON.parse(data || '{}');
            msg = result.output?.text ?? '';
          }
          onMessage?.(msg, done);
          if (done) break;
        }
      } catch (err) {
        console.log('Aliyun:', err);
        onMessage?.(null, true);
      }
    } catch (err) {
      console.error(err);
      abort.abort();
    }
  }
}
