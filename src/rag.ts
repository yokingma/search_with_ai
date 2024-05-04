import { EBackend, IChatInputMessage, IStreamHandler, SearchFunc, TMode } from './interface';
import { searchWithBing, searchWithGoogle, searchWithSogou, searchWithSearXNG } from './service';
import { DeepQueryPrompt, MoreQuestionsPrompt, RagQueryPrompt } from './prompt';
import { aliyun, baidu, openai, google, tencent, yi, moonshot, lepton, local } from './platform';
import util from 'util';
import { AliyunModels, BaiduModels, OpenAIModels, GoogleModels, TencentModels, YiModels, MoonshotModels, LeptonModels } from './constant';
import { ESearXNGCategory } from './search/searxng';

interface RagOptions {
  backend?: EBackend
  stream?: boolean
  model?: string
  // use local llm?
  locally?: boolean
}

// const CACHE_NAME = 'search_with_ai';

export class Rag {
  private search: SearchFunc;
  private chat: (...args: any[]) => Promise<any>;
  private model: string;
  // enable stream?
  private stream: boolean;

  constructor(params?: RagOptions) {
    const { backend = EBackend.SEARXNG, stream = true, model = OpenAIModels.GPT35TURBO, locally } = params || {};
    if (locally) {
      this.chat = local.chatStream.bind(local);
    } else {
      this.chat = processModel(model);
    }
    this.model = model;
    this.stream = stream;
    console.info('[query with]:', backend, model);
    console.info('[query with local llm]:', locally);
    switch (backend) {
      case EBackend.GOOGLE:
        this.search = searchWithGoogle;
        break;
      case EBackend.BING:
        this.search = searchWithBing;
        break;
      case EBackend.SOGOU:
        this.search = searchWithSogou;
        break;
      case EBackend.SEARXNG:
        this.search = searchWithSearXNG;
        break;
      default:
        this.search = searchWithSearXNG;
    }
  }

  public async query(query: string, categories = [ESearXNGCategory.GENERAL], mode: TMode = 'simple', onMessage?: (...args: any[]) => void) {
    const contexts = await this.search(query, categories);
    console.log(`[search [${categories}] results]`, contexts.length);
    console.log(`[search mode]`, mode);
    const REFERENCE_COUNT = process.env.REFERENCE_COUNT || 8;
    const limitContexts = contexts.slice(0, +REFERENCE_COUNT);
    if (!this.stream) {
      const relatedPromise = this.getRelatedQuestions(query, limitContexts);
      const answerPromise = this.getAiAnswer(query, contexts);
      const [related, answer] = await Promise.all([relatedPromise, answerPromise]);
      return {
        related,
        answer,
        contexts: limitContexts
      };
    }
    for (const context of limitContexts) {
      onMessage?.(JSON.stringify({ context }));
    }
    await this.getAiAnswer(query, limitContexts, mode, (msg) => {
      onMessage?.(JSON.stringify({ answer: msg }));
    });
    await this.getRelatedQuestions(query, limitContexts, (msg) => {
      onMessage?.(JSON.stringify({ related: msg }));
    });
    onMessage?.(null, true);
  }

  // Gets related questions based on the query and context.
  private async getRelatedQuestions(query: string, contexts: any[], onMessage?: IStreamHandler) {
    try {
      const { messages } = this.paramsFormatter(query, undefined, contexts, 'related');
      const { model, stream, chat } = this;
      if (!stream) {
        const res = await this.chat(messages, this.model);
        return res.split('\n');
      }
      await chat(messages, onMessage, model);
    } catch(err) {
      console.error('[LLM Error]:', err);
      return [];
    }
  }

  private async getAiAnswer(query: string, contexts: any[], mode: TMode = 'simple', onMessage?: IStreamHandler) {
    const { model, stream, chat } = this;
    try {
      const { messages } = this.paramsFormatter(query, mode, contexts, 'answer');
      if (!stream) {
        const res = await this.chat(messages, this.model);
        return res;
      }
      await chat(messages, (msg: string, done: boolean) => {
        onMessage?.(msg, done);
      }, model);
    } catch (err: any) {
      console.error('[LLM Error]:', err);
      const msg = `[Oops~ Some errors seem to have occurred]: ${err?.message || 'Please check the console'}`;
      if (!stream) return msg;
      else onMessage?.(msg, true);
    }
  }

  private paramsFormatter(query: string, mode: TMode = 'simple', contexts: any[], type: 'answer' | 'related') {
    const context = contexts.map((item, index) => `[[citation:${index + 1}]] ${item.snippet}` ).join('\n\n');
    let prompt = type === 'answer' ? RagQueryPrompt : MoreQuestionsPrompt;

    // deep answer
    if (mode === 'deep' && type === 'answer') {
      prompt = DeepQueryPrompt;
    }

    const system = util.format(prompt, context);
    const messages: IChatInputMessage[] = [
      {
        role: 'user',
        content: `${system} ${query}`
      }
    ];
    return {
      messages
    };
  }

  // private saveResult(contexts: any[], llmResponse: string, relatedQuestionsFuture: any[], searchUUID: string) {}
}

function processModel(model = OpenAIModels.GPT35TURBO) {
  if (Object.values(AliyunModels).includes(model)) {
    return aliyun.chatStream.bind(aliyun);
  }
  if (Object.values(OpenAIModels).includes(model)) {
    return openai.chatStream.bind(openai);
  }
  if (Object.values(BaiduModels).includes(model)) {
    return baidu.chatStream.bind(baidu);
  }
  if (Object.values(GoogleModels).includes(model)) {
    return google.chatStream.bind(google);
  }
  if (Object.values(TencentModels).includes(model)) {
    return tencent.chatStream.bind(tencent);
  }
  if (Object.values(YiModels).includes(model)) {
    return yi.chatStream.bind(yi);
  }
  if (Object.values(MoonshotModels).includes(model)) {
    return moonshot.chatStream.bind(moonshot);
  }
  if (Object.values(LeptonModels).includes(model)) {
    return lepton.chatStream.bind(lepton);
  }
  return openai.chatStream.bind(openai);
}
