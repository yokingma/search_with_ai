import { EBackend, IChatInputMessage, SearchFunc } from './interface';
import { searchWithBing, searchWithGoogle, searchWithSogou } from './service';
import { MoreQuestionsPrompt, RagQueryPrompt } from './prompt';
import { AliyunChat } from './platform';
// import { memoryCache } from './utils';
import util from 'util';

interface RagOptions {
  backend: EBackend
}

const CACHE_NAME = 'search_with_ai';

export class Rag {
  private search: SearchFunc;
  constructor(params: RagOptions) {
    const { backend = EBackend.BING } = params;
    switch (backend) {
      case EBackend.GOOGLE:
        this.search = searchWithGoogle;
        break;
      case EBackend.BING:
        this.search = searchWithBing;
        break;
      default:
        throw new Error('Invalid params: backend');
    }
  }

  public async query(query: string) {
    const contexts = await this.search(query);
    const relatedPromise = this.getRelatedQuestions(query, contexts);
    const answerPromise = this.getAiAnswer(query, contexts);
    const [related, answer] = await Promise.all([relatedPromise, answerPromise]);
    return {
      related,
      answer,
      contexts
    };
  }

  public async queryStream(query: string) {
    console.log(query, this.stream);
  }

  // Gets related questions based on the query and context.
  private async getRelatedQuestions(query: string, contexts: any[]) {
    try {
      const context = contexts.map(item => item.snippet).join('\n\n');
      const system = util.format(MoreQuestionsPrompt, context);
      const messages: IChatInputMessage[] = [
        {
          role: 'user',
          content: query
        }
      ];
      const res = await this.chat(messages, system);
      return res.split('\n');
    } catch(err) {
      console.error('encountered error while generating related questions:', err);
      return [];
    }
  }

  private async getAiAnswer(query: string, contexts: any[]) {
    try {
      const { messages, system } = this.paramsFormatter(query, contexts, 'answer');
      const res = await this.chat(messages, system);
      return res;
    } catch (err) {
      return '';
    }
  }

  private async chat(messages: IChatInputMessage[], system: string) {
    const aliyun = new AliyunChat();
    const res = await aliyun.chat(messages, system);
    return res.text;
  }

  private paramsFormatter(query: string, contexts: any[], type: 'answer' | 'related') {
    const context = contexts.map((item, index) => `[[citation:${index + 1}]] ${item.snippet}` ).join('\n\n');
    const system = util.format(RagQueryPrompt, context);
    const messages: IChatInputMessage[] = [
      {
        role: 'user',
        content: query
      }
    ];
  }

  public query(query: string, searchUUID: string) {}

  // private saveResult(contexts: any[], llmResponse: string, relatedQuestionsFuture: any[], searchUUID: string) {}
}
