import { IChatInputMessage, IStreamHandler } from '../interface';

export abstract class BaseChat {
  abstract chat?(
    messages: IChatInputMessage[],
    model?: string,
    system?: string
  ): Promise<string | null>;

  abstract chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model?: string,
    system?: string
  ): Promise<void>;
}
