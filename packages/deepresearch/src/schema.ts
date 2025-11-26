import { z } from 'zod';

// 搜索查询列表 Schema
export const SearchQueryListSchema = z.object({
  query: z
    .array(z.string())
    .describe('A list of search queries to be used for research.'),
  rationale: z
    .string()
    .describe(
      'A brief explanation of why these queries are relevant to the research topic.'
    ),
});

// 反思 Schema
export const ReflectionSchema = z.object({
  isSufficient: z
    .boolean()
    .describe(
      'Whether the provided summaries are sufficient to answer the user\'s question.'
    ),
  knowledgeGap: z
    .string()
    .describe(
      'A description of what information is missing or needs clarification.'
    ),
  followUpQueries: z
    .array(z.string())
    .describe('A list of follow-up queries to address the knowledge gap.'),
});

export type SearchQueryList = z.infer<typeof SearchQueryListSchema>;
export type Reflection = z.infer<typeof ReflectionSchema>;
