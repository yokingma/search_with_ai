import Anthropic from '@anthropic-ai/sdk';
import { IChatInputMessage, IChatResponse, IStreamHandler } from '../../interface.js';
import { BaseChat } from './base.js';

export interface IChatOptions {
  messages: IChatInputMessage[];
  model: string;
  system?: string;
  temperature?: number;
}

export class BaseAnthropicChat implements BaseChat {
  private anthropic: Anthropic | null;
  public provider: string;

  constructor(provider: string, apiKey?: string, baseURL?: string) {
    this.provider = provider;
    if (apiKey) {
      this.anthropic = new Anthropic({
        baseURL,
        apiKey,
      });
    }
  }

  async chat(options: IChatOptions): Promise<IChatResponse>
  async chat(options: IChatOptions, onMessage: IStreamHandler): Promise<IChatResponse>

  async chat(options: IChatOptions, onMessage?: IStreamHandler) {
    if (!this.anthropic) {
      throw new Error(`${this.provider} key is not set`);
    }
    const { model, system, temperature } = options;
    const messages = options.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    if (typeof onMessage === 'function') {
      const stream = await this.anthropic.messages.create({
        model,
        max_tokens: 4096,
        messages,
        system,
        temperature,
        stream: true,
      });
      let content = '';
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const response: IChatResponse = {
            content: chunk.delta.text,
            role: 'assistant'
          };
          content += response.content;
          onMessage?.(response);
        }
      }
      return { content };
    }

    const res = await this.anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages,
      system,
      temperature,
    });

    const content = res.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    return {
      content,
      role: 'assistant',
      usage: res.usage ? {
        inputTokens: res.usage.input_tokens,
        outputTokens: res.usage.output_tokens,
      } : undefined,
    };
  }

  async listModels() {
    // Anthropic doesn't provide a models endpoint, return common models
    return [];
  }
}
