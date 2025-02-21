import { deepResearchSystemPrompt, generateFollowUpPrompt, generateReportPrompt, generateSerpQueriesPrompt, processSerpResultPrompt } from './prompt';
import { generateObject, LanguageModelV1 } from 'ai';
import { z } from 'zod';
import {
  createOpenAICompatible,
  type OpenAICompatibleProviderSettings
} from '@ai-sdk/openai-compatible';
import { jinaUrlsReader } from '../../libs/jina';
import { getSearchEngine } from '../search';
import { TSearchEngine } from '../../interface';
import { logger } from '../../logger';

export interface IResearchOptions {
  model: string;
  searchEngine: TSearchEngine;
  openaiOptions: OpenAICompatibleProviderSettings;
}

export type ResearchResult = {
  // visited urls
  urls: string[];
  // learnings
  learnings: string[];
}

export interface IResearchProgress {
  totalDepth: number;
  currentDepth: number;
  totalQueries: number;
  currentQuery: string;
  completedQueries: number;
}

export class DeepResearch {
  private searchEngine: TSearchEngine;
  private llm: LanguageModelV1;

  constructor(options: IResearchOptions) {
    const { openaiOptions, model, searchEngine } = options;
    this.searchEngine = searchEngine;
    const { baseURL, apiKey, name } = openaiOptions;
    const llm = createOpenAICompatible({
      baseURL,
      apiKey,
      name,
    }).chatModel(model);
    this.llm = llm;
  }

  public async research({
    query,
    depth,
    breadth,
    learnings = [],
    visitedUrls = [],
    concurrencyLimit = 2
  }: {
    query: string;
    depth: number;
    breadth: number;
    learnings?: string[];
    visitedUrls?: string[];
    concurrencyLimit?: number;
  }): Promise<ResearchResult> {
    const progress: IResearchProgress = {
      totalDepth: 0,
      currentDepth: depth,
      totalQueries: 0,
      currentQuery: query,
      completedQueries: 0
    };

    console.log(progress);

    const serpQueries = await this.generateSerpQueries(query, breadth, learnings);

    const results = await Promise.all(
      serpQueries.map(async (query) => {
        try {
          const urls = await this.search(query.query);

          const { learnings: newLearnings, followUpQuestions } = await this.processSerpResult({
            query: query.query,
            urls,
            numFollowUpQuestions: Math.ceil(breadth / 2)
          });

          console.log('research result', {
            learnings: newLearnings,
            followUpQuestions
          });

          const allLearnings = [...learnings, ...newLearnings];

          const allUrls = [...visitedUrls, ...urls];

          const newDepth = depth - 1;

          if (newDepth > 0) {
            const newQuery = `
              Previous research goal: ${query.researchGoal}
              Follow-up research directions: ${followUpQuestions.map(q => `\n${q}`).join('')}
            `.trim();
            return this.research({
              query: newQuery,
              depth: newDepth,
              breadth: Math.ceil(breadth / 2),
              learnings: allLearnings,
              visitedUrls: allUrls,
              concurrencyLimit
            });
          } else {
            return { learnings: allLearnings, urls: allUrls };
          }
        } catch (error) {
          console.error(error);
          return { learnings: [], urls: [] };
        }
      })
    );

    return {
      learnings: results.flatMap((item) => item.learnings),
      urls: results.flatMap((item) => item.urls)
    };
  }

  public async generateReport({
    prompt,
    learnings,
    urls
  }: {
    prompt: string;
    learnings: string[];
    urls: string[];
  }) {
    const learningsString = learnings.map(item => `<learning>\n${item}\n</learning>`).join('\n');
    const systemPrompt = deepResearchSystemPrompt();
    const newPrompt = generateReportPrompt(prompt, learningsString);

    const res = await generateObject({
      model: this.llm,
      system: systemPrompt,
      prompt: newPrompt,
      schema: z.object({
        report: z.string().describe('The final report in markdown format')
      })
    });

    // visited urls
    const visitedUrlsString = urls.map(item => `- ${item}`).join('\n');
    return {
      report: res.object.report,
      sources: visitedUrlsString
    };
  }

  public async generateFollowUpQuestions(query: string, numQuestions = 3) {
    const systemPrompt = deepResearchSystemPrompt();
    const prompt = generateFollowUpPrompt(query, numQuestions);
    const res = await generateObject({
      model: this.llm,
      system: systemPrompt,
      prompt,
      schema: z.object({
        questions: z.array(z.object({
          question: z.string().describe('The follow up question to the research direction'),
          answer: z.string().describe('The answer to the question')
        })).describe(`A list of follow up questions and answers to the research direction, maximum of ${numQuestions}`)
      })
    });
    return res.object.questions.slice(0, numQuestions);
  }

  private async generateSerpQueries(
    query: string,
    numQueries = 3,
    learnings?: string[]
  ) {
    try {
      const systemPrompt = deepResearchSystemPrompt();
      const queryPrompt = generateSerpQueriesPrompt(query, numQueries, learnings);
      const llm = this.llm;
      const res = await generateObject({
        model: llm,
        system: systemPrompt,
        prompt: queryPrompt,
        output: 'object',
        schema: z.object({
          queries: z.array(z.object({
            query: z.string().describe('The query to research'),
            researchGoal: z.string().describe('The goal of the research')
          })).describe(`A list of queries to research, maximum of ${numQueries}`)
        })
      });
      return res.object.queries.slice(0, numQueries);
    } catch (error) {
      logger.error('[Error generating SERP queries]', error);
      return [];
    }
  }

  private async search(query: string, limit = 5) {
    const search = getSearchEngine(this.searchEngine);
    const results = await search(query);
    const urls = results.map(item => item.url).slice(0, limit);
    return urls;
  }

  private async processSerpResult({
    query,
    urls,
    numLearnings = 3,
    numFollowUpQuestions = 3
  }: {
    query: string,
    urls: string[],
    numLearnings?: number,
    numFollowUpQuestions?: number
  }) {
    const results = await jinaUrlsReader({ urls });
    const contents = results.map(item => item.content).filter(item => item !== null);
    const systemPrompt = deepResearchSystemPrompt();
    const prompt = processSerpResultPrompt(query, contents, numLearnings);

    const res = await generateObject({
      model: this.llm,
      system: systemPrompt,
      prompt,
      schema: z.object({
        learnings: z.array(z.string()).describe(`A list of learnings from the contents, maximum of ${numLearnings}`),
        followUpQuestions: z.array(z.string()).describe(`A list of follow up questions to the contents, maximum of ${numFollowUpQuestions}`)
      })
    });
    return res.object;
  }
}
