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
  public getRelatedQuestions(query: string, contexts: any[]) {
    const context = contexts.map(item => item.snippet).join('\n\n');
    const system = util.format(MoreQuestionsPrompt, context);
    const messages = [
      {
        role: 'system',
        content: system
      },
      {
        role: 'user',
        content: query
      }
    ];
  }

  public query(query: string, searchUUID: string) {}

  public saveToCache(contexts: any[], llmResponse: string, relatedQuestionsFuture: any[], searchUUID: string) {}
}
