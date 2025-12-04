import { BaseChat } from './base.js';
import { IChatMessage, IStreamHandler } from '../../interface.js';
import { IChatOptions } from './type.js';
import { GoogleGenAI } from '@google/genai';

export class GeminiChat implements BaseChat {
  private key?: string;
  public provider = 'gemini';
  private client?: GoogleGenAI;
  private baseUrl?: string;

  constructor(key?: string, baseUrl?: string, vertexai = false) {
    this.key = key;
    this.baseUrl = baseUrl;
    if (this.key) {
      this.client = new GoogleGenAI({
        vertexai,
        apiKey: this.key,
        ...(this.baseUrl && { baseUrl: this.baseUrl })
      });
    }
  }

  public async chat(
    options: IChatOptions,
    onMessage?: IStreamHandler
  ) {
    if (!this.client) {
      throw new Error('Google AI: Key is Required.');
    }
    const { messages, temperature, system = 'You are a helpful assistant.', model } = options;

    const history = this.transformMessage(messages);
    const response = await this.client.models.generateContentStream({
      model,
      contents: history,
      config: {
        systemInstruction: system,
        temperature
      }
    });

    let content = '';

    for await (const chunk of response) {
      const text = chunk.text;
      if (typeof onMessage === 'function') {
        onMessage({ content: text || '', role: 'assistant' }, false);
      }
      content += text;
    }

    return { content, role: 'assistant' as const };
  }

  public async listModels() {
    return [];
  }

  private transformMessage(messages: IChatMessage[]) {
    return messages
      .filter(msg => {
        // Filter out empty content messages to avoid Gemini API errors
        return msg.content && msg.content.trim().length > 0;
      })
      .map(msg => {
        // Gemini only supports 'user' and 'model' roles
        // Map: assistant -> model, everything else -> user
        // Note: tool messages are treated as user messages with the tool result
        let role: 'user' | 'model' = 'user';

        if (msg.role === 'assistant') {
          role = 'model';
        } else if (msg.role === 'tool') {
          // Tool messages should be sent as user messages
          role = 'user';
        }
        // 'user' and 'system' both map to 'user' in Gemini

        return {
          role,
          parts: [{ text: msg.content }]
        };
      });
  }
}
