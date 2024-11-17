<a name="top"></a>
# Search with AI

<br>
<p align="center">
  Build your conversation-based search with AI, a simple implementation with Node.js & Vue3.
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
  
**English** | [中文](./README_CN.md) | [日本語](./README_JP.md)

</div>

<div align="center">
 <img src="./assets/screenshot.jpg"></img>
</div>

Repositories: [GitHub](https://github.com/yokingma/search_with_ai) [Gitee](https://gitee.com/zac_ma/search_with_ai) [CNB](https://cnb.cool/isou/AiSearch) 

## Features

* Built-in support for LLM: OpenAI, Google, Lepton, DeepSeek, Ollama(local)
* Built-in support for search engine: Bing, Google, SearXNG(Free)
* Built-in support for web search plugin: ChatGLM
* Customizable pretty UI interface
* Support dark mode
* Support mobile display
* Support Ollama, [LMStudio](https://github.com/lmstudio-ai/lms)
* Support i18n
* Support Continue Q&A with contexts.
* Support Cache results, Force reload.
* Support images search.

## Deploy with Docker (recommended)

[Install Docker](https://docs.docker.com/install/).
> Project pre-built image [Docker Hub](https://hub.docker.com/r/zacma/aisearch/tags)

1.**Get the code.**

```shell
git clone https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2.**Edit** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) **file.** in ```docker``` directory.

> After modifying the .env.docker file, restart the Docker container to apply changes.

You must set at least one KEY.

```shell
...
# OpenAI's key & baseUrl
OPENAI_KEY=#your key
OPENAI_PROXY_URL=#baseURL

# Searxng hostname.
SEARXNG_HOSTNAME=http://searxng:8080
```

3.**Edit** [model.json](https://github.com/yokingma/search_with_ai/blob/main/docker/model.json) **file.** [Optional]

```json
{
  "platform": "openai",
  "type": "openai",
  // add your models
  "models": ["o1-preview", "o1-mini", "gpt-4o", "gpt-4o-mini"]
}
```

4.**Run with Docker Compose.**

```shell
docker compose up -d
```

Then visit <http://localhost:3000>

5.**Update**

- Delete old images using Docker Desktop or Docker CLI (if needed)
- Run ```docker compose down```
- Run ```docker compose up -d```

## LLMs

#### Support

* OpenAI ChatGPT
* Google Gemini
* Lepton LLama2、Mixtral8*7B
* AliYun Qwen
* Baidu Wenxin
* 01.ai
* Moonshot(Kimi)
* DeepSeek
* ChatGLM
* Tencent Hunyuan
* Ollama, LMStudio

#### Local LLM

Support [Ollama](https://github.com/ollama/ollama), [LMStudio](https://github.com/lmstudio-ai/lms)

## Search Engine

Built-in support for search engine: Bing, Google, SearXNG

#### SearXNG (Free, No Key required)

Install [SearXNG](https://github.com/searxng/searxng) with [searxng-docker](https://github.com/searxng/searxng-docker)
> SearXNG is a free internet metasearch engine which aggregates results from various search services and databases. The service does not track or profile its users, providing online anonymity for those who seek it. Additionally, SearXNG can be used over Tor for online anonymity.

When you install SearxNG, the only active output format by default is the HTML format. You need to activate the json format to use the API. This can be done by adding the following line to the settings.yml file:

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

You can also set the host in .env:

```shell
# SEARXNG_HOSTNAME=<host>
```

#### Bing Search

To use the Bing Web Search API, please visit [this link](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api) to obtain your Bing subscription key.
> The Bing Search API is billed, but has a free tier of 1000 calls per month.

#### Google Search

You have three options for Google Search: you can use the SearchApi Google Search API from [SearchApi](https://www.searchapi.io/), [Serper](https://www.serper.dev/) Google Search API from Serper, or opt for the [Programmable Search Engine](https://developers.google.com/custom-search) provided by Google.

#### ChatGLM Web Search

[2024/09/17] Added Zhipu AI's ChatGLM Web Search plugin, used as a Chinese search engine.
> Zhipu AI's glm-flash is currently free, and its Web Search plugin is also free. Based on these two, ChatGLM has been added as a free Chinese search engine.

## Deploy & Development

> Node.js >= 20
> Turborepo
> PackageManager: yarn@3.5.1

* **Directory Structure**

```text
apps/
  | server: backend
  | web: frontend
deploy/
  | docker-compose.yaml: docker deployment file
  | .env.docker: backend configuration file
  | model.json: backend model configuration file
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

## License

This repository's source code is available under the [MIT License](LICENSE).

[🚀Back to top](#top)
