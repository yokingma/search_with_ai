import { DefaultSystem } from '../constant';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { BaseChat } from './base/base';
import { LMStudioClient } from "@lmstudio/sdk";

const host = process.env.OLLAMA_HOST || 'localhost:1234';
const lmstudioClient = new LMStudioClient({
    baseUrl: `ws://${host}`
});
/**
 * run large language models locally with LMStudio.
 */
export class LMStudioChat implements BaseChat {
    public platform = 'lmstudio';

    public async chat(
        messages: IChatInputMessage[],
        model = 'lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF',
        system = DefaultSystem
    ): Promise<string | null> {
        if (system) {
            messages.unshift({
                role: 'system',
                content: system
            });
        }

        const llama3 = await lmstudioClient.llm.load(model);
        const response = await llama3.respond(messages);

        return response.content;
    }

    public async chatStream(
        messages: IChatInputMessage[],
        onMessage: IStreamHandler,
        model = 'llama2',
        system = DefaultSystem
    ): Promise<void> {
        if (system) {
            messages.unshift({
                role: 'system',
                content: system
            });
        }
        const llama3 = await lmstudioClient.llm.load(model);

        const response = llama3.respond(messages);

        for await (const chunk of response) {
            onMessage?.(chunk, false);
        }
        onMessage?.(null, true);
    }

    public async list() {
        const models = await lmstudioClient.llm.listLoaded();

        return {
            models: models.map(x => {
                return {
                    name: x.identifier
                }
            })
        }
    }
}

export const lmstudio = new LMStudioChat();
