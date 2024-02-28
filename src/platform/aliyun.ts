import { IChatInputMessage, IChatResponse } from '../interface';
import { httpRequest } from '../utils';

const BaseURL = 'https://dashscope.aliyuncs.com/api/v1/';
const APIS = {
  qwen: 'services/aigc/text-generation/generation',
  background: 'services/aigc/background-generation/generation',
  task: 'tasks/%s',
  embedding: 'services/embeddings/text-embedding/text-embedding',
};
const DefaultSystem = 'You are a helpful assistant.';
const DefaultModel = 'qwen-max';

export async function chat(
  messages: IChatInputMessage[],
  system = DefaultSystem,
  model = DefaultModel,
): Promise<IChatResponse> {
  const authorization = process.env.ALIYUN_KEY;
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
      'Authorization': `Bearer ${authorization}`
    },
    data: payload
  });
  const data = await res.json();
  if (data?.message) {
    console.error(data);
    throw new Error(data.message ?? 'bad request.');
  }
  const resData = {
    text: data.output.text,
    usage: {
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    }
  };
  return resData;
}

export async function chatStream(
  messages: IChatInputMessage[],
  onMessage?: (data: Uint8Array | null, done: boolean) => void,
  system = DefaultSystem,
  model = DefaultModel,
) {
  const authorization = process.env.ALIYUN_KEY;
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
  const abort = new AbortController();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        'Content-type': 'application/json',
        'Authorization': `Bearer ${authorization}`
      },
      body: payload,
      signal: abort.signal
    });
    const reader = res.body?.getReader();
    while(true) {
      if (!reader) break;
      const { value, done } = await reader.read();
      onMessage?.(value || null, done);
      if (done) break;
    }
  } catch (err) {
    console.error(err);
    abort.abort();
  }
}
