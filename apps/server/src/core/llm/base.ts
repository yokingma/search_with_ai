import { IChatResponse, IStreamHandler } from '../../interface.js';
import { IChatOptions } from './type.js';

export abstract class BaseChat {
  provider: string;

  abstract chat(options: IChatOptions): Promise<IChatResponse>
  abstract chat(options: IChatOptions, onMessage: IStreamHandler): Promise<IChatResponse>

  abstract listModels(): Promise<string[]>
}
