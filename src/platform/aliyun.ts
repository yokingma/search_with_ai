import { IChatInputMessage, IChatResponse } from '../interface';
import { httpRequest } from '../utils';

const BaseURL = 'https://dashscope.aliyuncs.com/api/v1/';
const APIS = {
  qwen: 'services/aigc/text-generation/generation',
  background: 'services/aigc/background-generation/generation',
  task: 'tasks/%s',
  embedding: 'services/embeddings/text-embedding/text-embedding',
};

export async function chat(
  messages: IChatInputMessage[],
  system = 'You are a helpful assistant.',
  model = 'qwen-max',
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
    },
    requestId: data.request_id,
  };
  return resData;
}
