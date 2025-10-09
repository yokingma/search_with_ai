import { BaseChat } from './base';
import { IChatInputMessage, IStreamHandler } from '../../interface';
import { DefaultSystem } from '../utils/constant';
import { IChatOptions } from './openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiChat implements BaseChat {
  private key?: string;
  public provider = 'gemini';
  private genAI?: GoogleGenerativeAI;
  private baseUrl?: string;

  constructor() {
    this.key = process.env.GOOGLE_KEY;
    this.baseUrl = process.env.GOOGLE_PROXY_URL;
    if (this.key) {
      this.genAI = new GoogleGenerativeAI(this.key);
    }
  }

  public async chat(
    options: IChatOptions,
    onMessage?: IStreamHandler
  ) {
    if (!this.genAI) {
      throw new Error('Google AI: Key is Required.');
    }
    const { messages, system = DefaultSystem, model } = options;
    const userMessage = messages.pop();
    if (!userMessage?.content) {
      throw new Error('Google AI: User message is Required.');
    }
    const msgs = this.transformMessage(messages);
    const modelChat = this.genAI.getGenerativeModel({
      model,
      systemInstruction: system
    }, {
      baseUrl: this.baseUrl
    });
    const chat = modelChat.startChat({
      history: msgs,
    });
    if (typeof onMessage === 'function') {
      // stream
      let content = '';
      const result = await chat.sendMessageStream(userMessage.content);
      for await (const chunk of result.stream) {
        content += chunk.text();
        onMessage({
          content: chunk.text()
        }, false);
      }
      onMessage(null, true);
      return {
        content
      };
    }
    const result = await chat.sendMessage(userMessage.content);
    return {
      content: result.response.text()
    };
  }

  public async listModels() {
    return [];
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
