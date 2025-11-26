# 🤖 DeepResearch Agent with LangGraph🦜🕸️

DeepResearch Agent with LangGraph, using any LLM models, search engine, RAG retrieval.

> [!NOTE]
> This package is part of the [search_with_ai](https://github.com/yokingma/search_with_ai) monorepo.
> The original standalone repository is archived at [deepresearch](https://github.com/yokingma/deepresearch).
>
> The code logic referenced [Google's Gemini LangGraph Project](https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart).

A LangGraph-powered research agent that performs comprehensive web research through dynamic query generation, iterative refinement, and citation-supported responses using any LLM model, search engine, or RAG retrieval.

```bash
# Node.js
npm install deepsearcher # or yarn add deepsearcher
```

## Features

- 🧠 Deep Research Agent based on LangGraph
- 🔍 Dynamic search query generation using any LLM model
- 🌐 Integrated web research through web search engines or RAG retrieval
- 🤔 Reflective reasoning, identifying knowledge gaps and optimizing searches
- 📄 Generate cited answers based on collected sources

## 🚀 Getting Started

```ts
import { DeepResearch, type SearcherFunction } from 'deepsearcher';

// Search engine adapter
const searcher: SearcherFunction = ({ query, id }) => {
  // You need to provide a searcher function
  // which can be a web search engine or a RAG retrieval function
}

const instance = new DeepResearch({
  searcher,
  // OpenAI-Like API (Optional)
  options: {
    apiKey: 'YOUR_OPENAI_OR_LLM_API_KEY',
    baseURL: 'https://api.openai.com/v1',
  },
});

// langgraph compile
const agent = await instance.compile();

// debug (optional)
agent.debug = true;

// use the stream() method. 
const chunks = await agent.stream(
  {
    messages: [{
      role: 'user',
      content: 'How to use LangGraph to build intelligent agents?'
    }],
  },
  {
    streamMode: 'updates',
    // runtime configuration
    configurable: {
      maxResearchLoops: 3, // default 3.
      numberOfInitialQueries: 3, // default 3.
      // Required model parameters (can use same model)
      queryGeneratorModel: 'Qwen/Qwen3-32B',
      reflectionModel: 'Qwen/Qwen3-32B',
      answerModel: 'Qwen/Qwen3-32B',
    },
  }
);

for await (const chunk of chunks) {
  console.log('chunk', chunk);
}
```

## How to stream from the target node

```ts
// use the streamEvents() method. 
const eventStream = agent.streamEvents(
  {
    messages: [{
      role: 'user',
      content: 'How to use LangGraph to build intelligent agents?'
    }],
  },
  {
    version: 'v2',
    configurable: {
      maxResearchLoops: 2,
      numberOfInitialQueries: 2,
      queryGeneratorModel: 'Qwen/Qwen3-32B',
      reflectionModel: 'Qwen/Qwen3-32B',
      answerModel: 'Qwen/Qwen3-32B',
    },
  }
);

for await (const { event, tags, data } of eventStream) {
  // Stream outputs from the 'FinalizeAnswer' node
  if (
    event === EventStreamEnum.ChatModelStream &&
    tags?.includes(NodeEnum.FinalizeAnswer)
  ) {
    console.log(data.chunk.content);
  }
}
```

Below are the definitions of nodes and commonly used event names:

```ts
export enum NodeEnum {
  GenerateQuery = 'generate_query',
  Research = 'research',
  Reflection = 'reflection',
  FinalizeAnswer = 'finalize_answer',
}

export enum EventStreamEnum {
  ChatModelStart = 'on_chat_model_start',
  ChatModelStream = 'on_chat_model_stream',
  ChatModelEnd = 'on_chat_model_end',
}
```

For detailed usage documentation, please refer to: [streaming-from-final-node](https://langchain-ai.github.io/langgraphjs/how-tos/streaming-from-final-node/)

## How the Agent Works

![agent](./agent.png)

- **Generate Initial Queries:** Based on your input, it generates a set of initial search queries using an LLM model.
- **Research:** For each query, it uses the LLM model with the Search API (SearcherFunction) to find relevant knowledge.
- **Reflection & Knowledge Gap Analysis:** The agent analyzes the search results to determine if the information is sufficient or if there are knowledge gaps. It uses an LLM model for this reflection process.
- **Iterative Refinement:** If gaps are found or the information is insufficient, it generates follow-up queries and repeats the research and reflection steps (up to a configured maximum number of loops).
- **Finalize Answer:** Once the research is deemed sufficient, the agent synthesizes the gathered information into a coherent answer, including citations from the sources, using an LLM model.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
