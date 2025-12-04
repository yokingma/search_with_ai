import { IChatMessage } from '../../interface.js';

export interface IChatOptions {
  messages: IChatMessage[];
  model: string;
  system?: string;
  temperature?: number;
}
