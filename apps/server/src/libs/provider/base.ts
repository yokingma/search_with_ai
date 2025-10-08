import { IChatResponse, IStreamHandler } from '../../interface';
import { IChatOptions } from './openai';

export abstract class BaseChat {
  platform: string;

  abstract chat(
    options: IChatOptions,
    onMessage?: IStreamHandler
  ): Promise<IChatResponse>

  abstract listModels(): Promise<string[]>
}
