import { BaseChat } from './base.js';
import { IChatInputMessage, IStreamHandler } from '../../interface.js';
import { IChatOptions } from './openai.js';
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
        onMessage({ content: text }, false);
      }
      content += text;
    }

    return { content };
  }

  public async listModels() {
    return [];
  }

  private transformMessage(messages: IChatInputMessage[]) {
    return messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
}
