import { IChatInputMessage, IStreamHandler } from '../interface';

export abstract class BaseChat {
  abstract chat?(
    messages: IChatInputMessage[],
    system?: string,
    model?: string
  ): Promise<string | null>;

  abstract chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model?: string,
    system?: string
  ): Promise<void>;
}
