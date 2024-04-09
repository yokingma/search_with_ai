# Search with AI
**English** [中文](./README_CN.md)  
Building a quick conversation-based search with AI, a simple implementation with Node.js & Vue3. [Live Demo](https://isou.chat/)
<div align="center">
  <video width="800" height="678" controls>
    <source src="./screenshot.mp4" type="video/mp4">
  </video>
</div>

repo: [GitHub](https://github.com/yokingma/search_with_ai)、 [Gitee](https://gitee.com/zac_ma/search_with_ai)

## Features
* Built-in support for LLM: OpenAI, Google, Lepton
* Built-in support for search engine: Bing, Sogou, Google
* Customizable pretty UI interface
* Support dark mode
* Support mobile display
* Support local LLM with Ollama

## LLM

#### Support API (needs KEY)
* OpenAI ChatGPT
* Google Gemini
* Lepton LLama2、Mixtral8*7B
* AliYun Qwen
* Baidu Wenxin
* 01.ai
* Moonshot(Kimi)
* Tencent Hunyuan

#### Local LLM
Support [Ollama](https://github.com/ollama/ollama), just need run ollama serve.

## Search Engine
Built-in support for search engine: Bing, Sogou, Google(TODO).

#### Bing Search
To use the Bing Web Search API, please visit [this link](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api) to obtain your Bing subscription key.
> The Bing Search API is billed, but has a free tier of 1000 calls per month.

#### Google Search
You have three options for Google Search: you can use the SearchApi Google Search API from [SearchApi](https://www.searchapi.io/), [Serper](https://www.serper.dev/) Google Search API from Serper, or opt for the [Programmable Search Engine](https://developers.google.com/custom-search) provided by Google.

#### Sogou Search
For users in China.

## Setup LLM and KV

Required:
> Node.js >= 18

* **Server**
```shell
yarn install && yarn run build
```

* **Web**
```shell
cd web && yarn install && yarn run build
```

* **Config(.env)**
```ts
// .env
// Bing key
BING_SEARCH_KEY=your-key
// Google search key
GOOGLE_SEARCH_KEY=
GOOGLE_SEARCH_ID=
// aliyun key
ALIYUN_KEY=your-key
// baidu key
BAIDU_KEY=your-key
BAIDU_SECRET=your-secret
// google gemini key & base url
GOOGLE_KEY=
// Google api base url
GOOGLE_PROXY_URL=
// tencent KEY:ID, SECRET:KEY
TENCENT_KEY=
TENCENT_SECRET=
// Yi Key
YI_KEY=
// openai ChatGPT key
OPENAI_KEY=your-key
// openai base url
OPENAI_PROXY_URL=https://api.openai.com/v1
```

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

Now you can visit http://localhost:3000
