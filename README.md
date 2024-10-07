# Search with AI

**English** [中文](./README_CN.md) [日本語](./README_JP.md)

```Updated: 2024/10/06```

Build your own conversation-based search with AI, a simple implementation with Node.js & Vue3. [Live Demo](https://isou.chat/)  

<div align="center">
 <img src="./assets/screenshot.jpg"></img>
</div>

repo: [GitHub](https://github.com/yokingma/search_with_ai)、 [Gitee](https://gitee.com/zac_ma/search_with_ai)  

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
> Project pre-built image [Docker Hub](https://hub.docker.com/r/zacma/aisearch)

1.**Get the code.**

```shell
git clone https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2.**Edit** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) **file.** in ```docker``` directory.

> If you modify the .env.docker file, simply restart the Docker container for the changes to take effect.

You must set at least one KEY.

```shell
...
# OpenAI's key & baseUrl
OPENAI_KEY=#your key
OPENAI_PROXY_URL=#baseURL

# Searxng hostname.
SEARXNG_HOSTNAME=http://searxng:8080
```

3.**run with docker-compose.**

```shell
docker compose up -d
```

then visit <http://localhost:3000>

4.**Update**

1. Delete old images using Docker Desktop or Docker CLI (if needed)
2. run ```docker compose down```
3. run ```docker compose up -d```

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

install [SearXNG](https://github.com/searxng/searxng) with [searxng-docker](https://github.com/searxng/searxng-docker)
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

## Setup

Required:
> Node.js >= 20

* **Server**

```shell
yarn install && yarn run build
```

* **Web**

```shell
cd web && yarn install && yarn run build
```

* **Config(.env)**

[.env](https://github.com/yokingma/search_with_ai/blob/main/.env) is the project configuration file. Please configure it according to your requirements.

[.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env.docker) is for docker deployment.

* **Run**
In the root of the project:

```shell
yarn run start 
```

* **Update**
In the root of the project:

```shell
git pull
yarn install
cd web && yarn install && yarn run build
```

Now you can visit <http://localhost:3000>

<div align="center">
 <img src="./assets/qrcode.jpg"></img>
</div>
