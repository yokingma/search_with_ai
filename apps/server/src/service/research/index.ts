import { deepResearchSystemPrompt, generateFollowUpPrompt, generateInitialQueryPrompt, generateReportPrompt, generateSerpQueriesPrompt, processSerpResultPrompt } from './prompt';
import { generateObject, LanguageModelV1, streamText } from 'ai';
import { z } from 'zod';
import {
  createOpenAICompatible,
  type OpenAICompatibleProviderSettings
} from '@ai-sdk/openai-compatible';
import { jinaUrlsReader } from '../../libs/jina';
import { getSearchEngine } from '../search';
import { TSearchEngine } from '../../interface';
import { logger } from '../../logger';
import { retryAsync } from '../../libs/utils';

export interface IResearchOptions {
  searchEngine: TSearchEngine;
  llmOptions: OpenAICompatibleProviderSettings & { model: string };
  reportLlmOptions?: OpenAICompatibleProviderSettings & { model: string };
}

export type ResearchResult = {
  // visited urls
  urls: string[];
  // learnings
  learnings: string[];
}

export interface IResearchProgress {
  currentDepth: number;
  currentQuery: string;
  visitedUrls: string[];
}

export enum EResearchProgress {
  Heartbeat = 'heartbeat',
  Analyzing = 'analyzing',
  Start = 'start',
  Researching = 'researching',
  Report = 'report',
  Completed = 'completed'
}

export class DeepResearch {
  private searchEngine: TSearchEngine;
  private llm: LanguageModelV1;
  private reportLlm?: LanguageModelV1;

  constructor(options: IResearchOptions) {
    const { llmOptions, reportLlmOptions, searchEngine } = options;
    this.searchEngine = searchEngine;
    const { model, ...llmOptionsWithoutModel } = llmOptions;
    const llm = createOpenAICompatible(llmOptionsWithoutModel).chatModel(model);
    this.llm = llm;
    // report llm
    if (reportLlmOptions) {
      const { model: reportModel, ...reportLlmOptionsWithoutModel } = reportLlmOptions;
      const reportLlm = createOpenAICompatible(reportLlmOptionsWithoutModel).chatModel(reportModel);
      this.reportLlm = reportLlm;
    }
  }

  public async research({
    query,
    depth,
    breadth,
    learnings = [],
    visitedUrls = [],
    concurrencyLimit = 2,
    onProgress
  }: {
    query: string;
    depth: number;
    breadth: number;
    learnings?: string[];
    visitedUrls?: string[];
    concurrencyLimit?: number;
    onProgress?: (progress: IResearchProgress) => void;
  }): Promise<ResearchResult> {

    const progress: IResearchProgress = {
      currentDepth: depth,
      currentQuery: query,
      visitedUrls
    };

    onProgress?.(progress);

    const serpQueries = await this.generateSerpQueries(query, breadth, learnings);

    const results = await Promise.all(
      serpQueries.map(async (query) => {
        try {
          const results = await this.search(query.query);
          const urls = results.map(item => item.url);

          const { learnings: newLearnings, followUpQuestions } = await this.processSerpResult({
            query: query.query,
            urls,
            numFollowUpQuestions: Math.ceil(breadth / 2)
          });

          const allLearnings = [...learnings, ...newLearnings];

          const allUrls = [...visitedUrls, ...urls];

          const newDepth = depth - 1;

          if (newDepth > 0) {
            const newQuery = `Previous research goal: ${query.researchGoal}\nFollow-up research directions: ${followUpQuestions.map(q => `\n${q}`).join('')}`.trim();
            return this.research({
              query: newQuery,
              depth: newDepth,
              breadth: Math.ceil(breadth / 2),
              learnings: allLearnings,
              visitedUrls: allUrls,
              concurrencyLimit,
              onProgress
            });
          } else {
            return { learnings: allLearnings, urls: allUrls };
          }
        } catch (error) {
          logger.error('[Error researching]', error);
          return { learnings: [], urls: [] };
        }
      })
    );

    return {
      learnings: results.flatMap((item) => item.learnings),
      urls: results.flatMap((item) => item.urls)
    };
  }

  public async generateCombinedQuery({
    initialQuery,
    numFollowUpQuestions = 3
  }: {
    initialQuery: string;
    numFollowUpQuestions?: number;
  }) {
    const queries = await this.generateInitialQuery(initialQuery, numFollowUpQuestions);
    const followUpQuestions = await this.generateFollowUpQuestions(queries);
    const combinedQuery = `
      Initial Query: ${initialQuery}
      Follow-up Questions and Answers:
      ${followUpQuestions.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n')}
    `;
    return combinedQuery;
  }

  public async generateReport({
    combinedQuery,
    learnings,
    onProgress
  }: {
    combinedQuery: string;
    learnings: string[];
    onProgress: (text: string) => void;
  }) {
    const learningsString = learnings.map(item => `<learning>\n${item}\n</learning>`).join('\n');
    const systemPrompt = deepResearchSystemPrompt();
    const newPrompt = generateReportPrompt(combinedQuery, learningsString);

    const result = streamText({
      model: this.reportLlm ?? this.llm,
      system: systemPrompt,
      prompt: newPrompt,
    });

    for await (const textPart of result.textStream) {
      onProgress(textPart);
    }
  }

  /**
   * Step 0: Generate initial query
   */
  private async generateInitialQuery(query: string, numQuestions = 3) {
    const systemPrompt = deepResearchSystemPrompt();
    const prompt = generateInitialQueryPrompt(query, numQuestions);
    try {
      const res = await retryAsync(async () => {
        const res = await generateObject({
          model: this.llm,
          system: systemPrompt,
          prompt,
          schema: z.object({
            queries: z.array(z.string()).describe(`A list of queries to research, maximum of ${numQuestions}`)
          })
        });
        return res.object.queries.slice(0, numQuestions);
      });
      return res;
    } catch (error) {
      logger.error('[Error generating initial query]', error);
      return [];
    }
  }

  /**
   * Step 1: Generate follow up questions and answers
   */
  private async generateFollowUpQuestions(queries: string[]) {
    const systemPrompt = deepResearchSystemPrompt();
    const results = await Promise.all(
      queries.map(async (query) => {
        const results = await this.search(query);
        return results;
      })
    );
    const contexts = results.flatMap(item => item.map(item => item.snippet));
    const prompt = generateFollowUpPrompt(queries, contexts);
    try {
      const res = await retryAsync(async () => {
        const res = await generateObject({
          model: this.llm,
          system: systemPrompt,
          prompt,
          schema: z.object({
            questions: z.array(z.object({
              question: z.string().describe('The follow up question to the research direction'),
              answer: z.string().describe('The answer to the question')
            })).describe('A list of follow up questions and answers to the research direction')
          })
        });
        return res.object.questions;
      });
      return res;
    } catch (error) {
      logger.error('[Error generating follow up questions]', error);
      return [];
    }
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
      const res = await retryAsync(async () => {
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
      });
      return res;
    } catch (error) {
      logger.error('[Error generating SERP queries]', error);
      return [];
    }
  }

  private async search(query: string, limit = 5) {
    const search = getSearchEngine(this.searchEngine);
    const results = await search(query);
    return results.slice(0, limit);
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

    try {
      const res = await retryAsync(async () => {
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
      });
      return res;
    } catch (error) {
      logger.error('[Error processing SERP result]', error);
      return { learnings: [], followUpQuestions: [] };
    }
  }
}
