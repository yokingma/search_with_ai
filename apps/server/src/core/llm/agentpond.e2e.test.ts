import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';

test('an OpenAI chat request still succeeds when AgentPond tracing is enabled', async (t) => {
  const mockProvider = createServer((request, response) => {
    assert.equal(request.method, 'POST');
    assert.equal(request.url, '/v1/chat/completions');

    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({
      id: 'chatcmpl_agentpond_test',
      object: 'chat.completion',
      created: 1_750_000_000,
      model: 'gpt-test',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'traced answer',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 2,
        completion_tokens: 2,
        total_tokens: 4,
      },
    }));
  });

  await new Promise<void>((resolve) => {
    mockProvider.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => {
    mockProvider.close();
  });

  const address = mockProvider.address();
  assert(address && typeof address === 'object');

  const { forceFlushAgentPond } = await import('../../instrumentation.js');
  const { BaseOpenAIChat } = await import('./openai.js');
  const chat = new BaseOpenAIChat(
    'mock-provider',
    'test-key',
    `http://127.0.0.1:${address.port}/v1`
  );

  const result = await chat.chat({
    model: 'gpt-test',
    messages: [{ role: 'user', content: 'trace this request' }],
  });

  assert.equal(result.content, 'traced answer');
  await forceFlushAgentPond();
});
