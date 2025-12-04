import OpenAI from 'openai';
import { IChatInputToolMessage, IChatResponse, IStreamHandler } from '../../interface.js';
import { BaseChat } from './base.js';
import { IChatOptions } from './type.js';

export class BaseOpenAIChat implements BaseChat {
  private openai: OpenAI | null;
  public provider: string;

  constructor(provider: string, apiKey?: string, baseURL?: string) {
    this.provider = provider;
    if (apiKey) {
      this.openai = new OpenAI({
        baseURL,
        apiKey,
      });
    }
  }

  async chat(options: IChatOptions, onMessage?: IStreamHandler) {
    if (!this.openai) {
      throw new Error(`${this.provider} key is not set`);
    }
    const { model, system, temperature } = options;

    // Transform messages to OpenAI's expected format
    const messages = options.messages.map(msg => {
      if (msg.role === 'tool') {
        // Type guard ensures msg is IChatInputToolMessage
        const toolMsg = msg as IChatInputToolMessage;
        return {
          role: 'tool' as const,
          content: toolMsg.content,
          tool_call_id: toolMsg.tool_call_id,
        };
      }
      return {
        role: msg.role,
        content: msg.content,
      };
    });

    if (system) {
      messages.unshift({
        role: 'system' as const,
        content: system,
      });
    }
    if (typeof onMessage === 'function') {
      const stream = await this.openai.chat.completions.create({
        messages,
        model,
        stream: true,
        temperature
      });
      let content = '';
      let reasoningContent = '';
      for await (const chunk of stream) {
        if (chunk.choices[0]) {
          const response: IChatResponse = {
            role: 'assistant',
            content: chunk.choices[0].delta?.content ?? '',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            reasoningContent: chunk.choices[0].delta?.reasoning_content ?? '',
          };
          content += response.content;
          reasoningContent += response.reasoningContent ?? '';
          onMessage?.(response);
        }
      }
      return {
        content,
        reasoningContent,
        role: 'assistant' as const
      };
    }

    const res = await this.openai.chat.completions.create({
      messages,
      model,
      temperature
    });
    return {
      content: res.choices[0]?.message.content || '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reasoningContent: res.choices[0].message.reasoning_content || '',
      role: 'assistant' as const
    };
  }

  async listModels() {
    if (!this.openai) throw new Error(`${this.provider} Key is Required.`);
    const models = await this.openai.models.list();
    return models.data.map((model) => model.id);
  }
}
