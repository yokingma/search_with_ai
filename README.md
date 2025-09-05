<a name="top"></a>
# Open AI Search (Support Deep Research)

<br>
<p align="center">
  Build your conversation-based search with LLM, support DeepResearch / DeepSeek R1.
</p>
<p align="center">
  <a href="https://isou.chat/">Live Demo</a>
</p>

<p align="center">
  <a href="https://github.com/yokingma/search_with_ai/stargazers"><img src="https://img.shields.io/github/stars/yokingma/search_with_ai" alt="Github Stars"></a>
  <a href="https://github.com/yokingma/search_with_ai/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-purple" alt="License"></a>
  <a href="https://github.com/yokingma/search_with_ai/issues/new"><img src="https://img.shields.io/badge/Report a bug-Github-%231F80C0" alt="Report a bug"></a>
  <a href="https://github.com/yokingma/search_with_ai/discussions/new?category=q-a"><img src="https://img.shields.io/badge/Ask a question-Github-%231F80C0" alt="Ask a question"></a>
</p>

<div align="center">

**English** | [中文](./README_ZH_CN.md) | [日本語](./README_JP.md)

</div>

<div align="center">
 <img src="./assets/screenshot.jpg"></img>
</div>

Repositories: [GitHub](https://github.com/yokingma/search_with_ai) [CNB](https://cnb.cool/isou/AiSearch)

## Features

* 🔍 **New!** Support "**Deep Research**" like OpenAI/Gemini/Perplexity.
* Built-in support for LLM: OpenAI, Google, Lepton, DeepSeek(R1), SiliconFlow, AliYun, Baidu, ChatGLM, Moonshot, Tencent, Lepton, Yi and more.
* Support Ollama, [LMStudio](https://github.com/lmstudio-ai/lms)
* Built-in support for search engine: Bing, Google, [Tavily](https://tavily.com/), [SearXNG](https://github.com/searxng/searxng)
* Customizable pretty UI interface
* Support light&dark mode/mobile
* Support i18n
* Support Continue Q&A with contexts.
* Support Cache results, Force reload.
* Support images search.

## About DeepResearch

Support "Deep Research" like OpenAI/Gemini/Perplexity, through search engine, web scraping and LLM to iterate on any topic or question, and generate a comprehensive report. Project reference [dzhng/deep-research](https://github.com/dzhng/deep-research).

https://github.com/user-attachments/assets/da5e038d-5e0a-4a6f-bae2-b1a58eee193e

**Note:**

- **Warning:** It will cost a lot of Tokens.
- Need to support `Function Calling`.
- Use JINA.ai to extract web page content (No need to configure KEY, limited: 20RPM).

**Workflow:**

1. Analyze user's query.
2. Generate follow-up questions to refine the research direction.
3. Generate and execute search queries.
4. Process and analyze search results.
5. Recursive exploration leads to deeper exploration base on `step 4`.
6. Generate a comprehensive report.

> [!NOTE]
> If you want to integrate DeepResearch capabilities into your own (Node.js) project, we recommend using the following npm package, built on LangGraph, with detailed usage instructions: [DeepResearch](https://github.com/yokingma/deepresearch)

```shell
npm install deepsearcher
```

## Deploy with Docker (recommended)

[Install Docker](https://docs.docker.com/install/).

```shell
docker pull docker.cnb.cool/aigc/aisearch
```

1.**Get the code.**

```shell
git clone https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2.**Edit** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) **file.** in ```deploy``` directory.

> After modifying the .env.docker file, restart the Docker container to apply changes.

You must set at least one KEY.

```shell
...
# OpenAI's key
OPENAI_KEY=#your key

# Searxng hostname.
SEARXNG_HOSTNAME=http://searxng:8080
```

3.**Edit** [model.json](https://github.com/yokingma/search_with_ai/blob/main/deploy/model.json) **file.** [Optional]

```json
{
  "provider": "openai",
  "type": "openai",
  "baseURL": "https://api.openai.com/v1",
  "models": ["o1-preview", "o1-mini", "gpt-4o", "gpt-4o-mini"]
}
```

4.**Run with Docker Compose.**

```shell
docker compose up -d
```

Then visit <http://localhost:3000>

5.**Update**

* Delete old images.
* Run ```docker compose down```
* Run ```docker compose up -d```

## Search Engine

Built-in support for search engine: SearXNG, Bing, Google, Tavily, etc.

#### SearXNG (Free, No Key required)

Install [SearXNG](https://github.com/searxng/searxng) with [searxng-docker](https://github.com/searxng/searxng-docker)

Make sure to activate the json format to use the API. This can be done by adding the following line to the settings.yml file:

```yaml
search:
    formats:
        - html
        - json
```

And set limiter to false:

```yaml
server:
   limiter: false # default is true
```

`apps/server/.env`:

```shell
# SEARXNG_HOSTNAME=<host>
```

#### Bing Search

To use the Bing Web Search API, please visit [this link](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api) to obtain your Bing subscription key.

#### Google Search

You have three options for Google Search: you can use the SearchApi Google Search API from [SearchApi](https://www.searchapi.io/), [Serper](https://www.serper.dev/) Google Search API from Serper, or opt for the [Programmable Search Engine](https://developers.google.com/custom-search) provided by Google.

#### Tavily Search

[Tavily](https://tavily.com/) is a search engine optimized for LLMs.

#### Jina Reader URL API

[Jina](https://jina.ai/) Reader URL API, supporting full web content extraction. used in [DeepResearch] mode.
JINA KEY is optional (limited to 20RPM).

```shell
# JINA API KEY
JINA_KEY=#your key
```

## Deploy & Development

* Node.js >= 20
* Turborepo
* PackageManager: yarn@3.5.1

* **Directory Structure**

```text
apps/
  | server # backend
  | web # frontend
deploy/
  | docker-compose.yaml # docker deployment file
  | .env.docker # backend configuration file
  | model.json # backend model configuration file
  ...
```

* **Development & Build**
In the root of the project:

```shell
turbo dev
# or
turbo build
```

* **Update**
In the root of the project:

```shell
git pull
```

## CDN acceleration and security protection for this project are sponsored by Tencent EdgeOne
EdgeOne offers a long-term free plan with unlimited traffic and requests, covering Mainland China nodes, with no overage charges. Interested friends can click the link below to claim it

<p align="center">
<img src="https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png" width="50%">
</p>

<p align="center">
<a href="https://edgeone.ai/?from=github">Best Asian CDN, Edge, and Secure Solutions - Tencent EdgeOne</a>
</p>

## License

This repository's source code is available under the [MIT License](LICENSE).

[🚀Back to top](#top)
