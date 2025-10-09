import { IChatResponse, IStreamHandler } from '../../interface';
import { IChatOptions } from './openai';

export abstract class BaseChat {
  provider: string;

  abstract chat(
    options: IChatOptions,
    onMessage?: IStreamHandler
  ): Promise<IChatResponse>

  abstract listModels(): Promise<string[]>
}
