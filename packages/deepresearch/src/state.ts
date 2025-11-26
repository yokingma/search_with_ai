import { addMessages, Annotation } from '@langchain/langgraph';
import type { AIMessage } from 'langchain';
import type { BaseMessageLike } from '@langchain/core/messages';
import { SearchResultItem } from './types.js';

// Global State
export const OverallAnnotation = Annotation.Root({
  messages: Annotation<BaseMessageLike[]>({
    reducer: addMessages,
    default: () => [],
  }),
  generatedQueries: Annotation<string[]>,
  searchedQueries: Annotation<string[]>({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),
  researchResult: Annotation<string[]>({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),
  sourcesGathered: Annotation<SearchResultItem[]>({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),
  researchLoopCount: Annotation<number>,
  // reflection state
  reflectionState: Annotation<typeof ReflectionState.State>,
});

// Output state
export const OutputAnnotation = Annotation.Root({
  sourcesGathered: Annotation<SearchResultItem[]>,
  messages: Annotation<AIMessage[]>,
});

// Reflection state
export const ReflectionState = Annotation.Root({
  isSufficient: Annotation<boolean>,
  knowledgeGap: Annotation<string>,
  followUpQueries: Annotation<string[]>,
  numberOfRanQueries: Annotation<number>,
});

// research state
export const ResearchState = Annotation.Root({
  query: Annotation<string>,
  id: Annotation<string>,
});
