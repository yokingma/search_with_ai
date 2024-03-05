import { IChatInputMessage, TStreamHandler } from '../interface';

export abstract class BaseChat {
  abstract chat(
    messages: IChatInputMessage[],
    system?: string,
    model?: string
  ): Promise<string | null>;

  abstract chatStream(
    messages: IChatInputMessage[],
    onMessage: TStreamHandler,
    system?: string,
    model?: string
  ): Promise<void>;
}
