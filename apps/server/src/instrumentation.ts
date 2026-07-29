import { createFilesSpanExporterFromRuntimeEnv } from '@agentpond/files-sdk/otel';
import { OpenAIInstrumentation } from '@arizeai/openinference-instrumentation-openai';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import OpenAI from 'openai';

let agentPondSpanProcessor: BatchSpanProcessor | undefined;

if (process.env.AGENTPOND_ENABLED === 'true') {
  agentPondSpanProcessor = new BatchSpanProcessor(
    createFilesSpanExporterFromRuntimeEnv()
  );
  const openAIInstrumentation = new OpenAIInstrumentation({
    traceConfig: {
      hideInputs: true,
      hideOutputs: true,
    },
  });

  const sdk = new NodeSDK({
    spanProcessors: [agentPondSpanProcessor],
    instrumentations: [openAIInstrumentation],
  });

  sdk.start();
  openAIInstrumentation.manuallyInstrument(OpenAI);
}

export async function forceFlushAgentPond() {
  await agentPondSpanProcessor?.forceFlush();
}
