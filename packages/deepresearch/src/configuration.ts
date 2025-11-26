import { RunnableConfig } from '@langchain/core/runnables';
import { z } from 'zod';

export const ConfigurationSchema = z.object({
  queryGeneratorModel: z
    .string()
    .describe(
      'The name of the language model to use for the agent\'s query generation.'
    ),
  reflectionModel: z
    .string()
    .describe(
      'The name of the language model to use for the agent\'s reflection.'
    ),
  answerModel: z
    .string()
    .describe('The name of the language model to use for the agent\'s answer.'),
  numberOfInitialQueries: z
    .number()
    .describe('The number of initial search queries to generate.'),
  maxResearchLoops: z
    .number()
    .describe('The maximum number of research loops to perform.'),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

const DEFAULT_CONFIG: Omit<
  Configuration,
  'queryGeneratorModel' | 'reflectionModel' | 'answerModel'
> = {
  numberOfInitialQueries: 3,
  maxResearchLoops: 3,
};

/**
 * Create a Configuration object from a RunnableConfig.
 */
export function getConfigurationFromRunnableConfig(
  config?: RunnableConfig<Partial<Configuration>>
): Configuration {
  const configurable = config?.configurable ?? {};

  if (
    !configurable.answerModel ||
    !configurable.queryGeneratorModel ||
    !configurable.reflectionModel
  ) {
    throw new Error(
      'Missing required model configuration: answerModel, queryGeneratorModel, and reflectionModel must be provided'
    );
  }

  const rawValues: Configuration = {
    queryGeneratorModel: configurable.queryGeneratorModel,
    reflectionModel: configurable.reflectionModel,
    answerModel: configurable.answerModel,
    numberOfInitialQueries:
      configurable.numberOfInitialQueries ??
      DEFAULT_CONFIG.numberOfInitialQueries,
    maxResearchLoops:
      configurable.maxResearchLoops ?? DEFAULT_CONFIG.maxResearchLoops,
  };

  // Filter out undefined values and convert string numbers to numbers
  Object.entries(rawValues).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'numberOfInitialQueries' || key === 'maxResearchLoops') {
        const numValue =
          typeof value === 'string' ? parseInt(value, 10) : value;
        (rawValues as Record<string, unknown>)[key] = numValue;
      }
    }
  });

  return rawValues;
}
