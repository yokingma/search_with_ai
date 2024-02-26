import { EBackend, SearchFunc } from './interface';
import { searchWithBing, searchWithGoogle } from './service';
import { MoreQuestionsPrompt } from './prompt';
import { memoryCache } from './utils';
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
