<a name="top"></a>
<br>
<p align="center" style="font-size: 32px;"><b>Search with AI</b></p>
<p align="center">
  基于AI大语言模型的对话式搜索引擎，基于Node.js&Vue3。适合新手入门AI大模型开发参考:)，文档后有交流群二维码。
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

[English](./README.md) **中文** [日本語](./README_JP.md)

<div align="center">
 <img src="./assets/screenshot_cn.jpg"></img>
</div>

仓库地址：[GitHub仓库](https://github.com/yokingma/search_with_ai) [Gitee仓库](https://gitee.com/zac_ma/search_with_ai) [CNB](https://cnb.cool/isou/AiSearch) 

## 功能说明

* 内置主流的LLM接口支持，如OpenAI、Google、通译千问、百度文心一言、Lepton、DeepSeek。
* 内置搜索引擎支持，如Bing、Sogou、Google、SearXNG（免费开源）。
* 支持ChatGLM Web搜索插件 [作为搜索引擎, 目前免费]。
* 简洁的搜索对话Web界面。
* Web界面支持暗色模式。
* Web界面支持移动端。
* 支持搜索引擎切换、AI模型切换。
* 支持本地大模型（基于Ollama、lmStudio）。
* 支持多语言(i18n)。
* 支持根据结果上下文继续问答。
* 支持缓存结果、强制刷新结果。
* 支持图片搜索。

## 使用 Docker 安装部署

> 文档后面二维码加入微信群交流。

**注意：使用SearXNG搜索引擎请确保你的网络能正常访问到Google**

[安装Docker](https://docs.docker.com/install/).

> 项目预构建Docker镜像
> 1. [Docker Hub](https://hub.docker.com/r/zacma/aisearch/tags)
> 2. [CNB.cool](https://cnb.cool/aigc/AiSearch) (国内镜像源 > 制品库)

1、**克隆仓库**

```shell
git clone https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2、**编辑** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) 文件位于```docker```目录下

在此处配置你的KEY[如 OpenAI、Google、DeepSeek、阿里云 ]即可。
> 如果修改了.env.docker文件，只需要重启Docker容器即可生效。

```shell
# 示例
# openai KEY, docker compose 默认带了FreeGPT35，如果你没有自己的Key, 这里保持默认
OPENAI_KEY=#your key
# openai Base Url, 
OPENAI_PROXY_URL=#OpenAI Base Url, OneAPI接口也是支持的。
...
# docker compose 部署默认带了SearXNG聚合搜索, 默认不需要修改
SEARXNG_HOSTNAME=http://searxng:8080
```

3、[可选]编辑模型配置文件: ```/docker/model.json```

```json
{
  "platform": "openai",
  "type": "openai",
  // 增加修改你的模型名称
  "models": ["o1-preview", "o1-mini", "gpt-4o", "gpt-4o-mini"]
}
```

4、在```docker```目录下运行：

```shell
# 默认包含了 SearXNG 服务
docker compose up -d
```

浏览器访问 <http://localhost:3000>

5、 **更新**

- 手动删除旧版本的镜像（如果需要）
- 执行 ```docker compose down```
- 执行 ```docker compose up -d```

## 大模型支持

#### 基于在线大模型的API（需要Key）

* OpenAI ChatGPT
* Google Gemini
* Lepton
* 阿里云通译千问
* 百度文心一言
* 零一万物
* 月之暗面
* DeepSeek
* ChatGLM
* 腾讯混元
* 本地大模型支持：Ollama、LMStudio

> 如果有新的模型项目暂时不支持的，可以修改(/backend/utils/constant.ts)文件，添加新的模型名称即可。

## 搜索引擎配置

内置了搜索引擎服务：Bing、Sogou、Google、SearXNG。

#### 推荐使用SearXNG (免费开源，不需要KEY)

安装 [SearXNG](https://github.com/searxng/searxng) ，推荐用Docker部署 [searxng-docker](https://github.com/searxng/searxng-docker)
> SearXNG 是一款免费的互联网元搜索引擎，它集合了来自多个搜索服务和数据库的结果。该服务不会追踪或构建其用户档案，为寻求在线匿名性的用户提供保护。此外，SearXNG 还可通过 Tor 网络来实现在线匿名访问。

安装 SearXNG 时，默认情况下唯一处于激活状态的输出格式是 HTML 格式。若要使用 API，您需要启用 json 格式。可以通过在 settings.yml 文件中添加以下行来实现：

```yaml
search:
    formats:
        - html
        - json
```

并且需要设置limiter为false:

```yaml
server:
   limiter: false # default is true
```

也可以设置SEARXNG_HOSTNAME (编辑.env文件):

```shell
# SEARXNG_HOSTNAME=<host>
```

#### Bing搜索

如果要使用必应搜索，需要注册并订阅[Bing搜索服务](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)，获取必应订阅密钥(key)。

> Bing搜索接口是收费的，但是每月有1000次免费调用额度。

#### Google搜索

如果要使用谷歌搜索引擎， 需要[注册谷歌搜索API服务](https://developers.google.com/custom-search)，每天有100次免费搜索额度。

#### Sogou搜索

内置的Sogou搜索并非直接调用API实现，只是通过简单的网页爬取获取搜索结果。
> 内置的Sogou搜索本地测试用（只是简单的网页爬取），**会触发人机验证**，遇到不返回参考资料的情况可以手动打开sogou.com随便搜索关键词，根据提示手动验证一下解除。

#### ChatGLM Web Search插件
[2024/09/17] 新增智谱AI的ChatGLM Web Search插件，作为中文搜索引擎使用。
> 智谱AI的glm-flash目前免费，其Web Search插件目前也是免费，基于结合这两者新增了ChatGLM作为免费的中文搜索引擎。

## 普通安装部署

需要：
> Node.js >= 20

国内用户推荐使用阿里云通译千问、DeepSeek、ChatGLM等大模型服务

* **服务端**

```shell
yarn install && yarn run build
```

* **前端页面**

```shell
cd web && yarn install && yarn run build
```

* **配置** (.env)

各项配置在[.env](https://github.com/yokingma/search_with_ai/blob/main/.env)文件中，请按照需求配置即可。

> [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/docker/.env.docker) 是docker部署配置文件。

* **启动**
在项目根目录中执行:

```shell
yarn run start 
```

* **更新**
在项目根目录执行

```shell
git pull
yarn install
cd web && yarn install && yarn run build
```

启动成功后可以在浏览器打开<http://localhost:3000> 即可使用。

## API

项目前后端分离， 如果你需要使用API服务，也可以单独部署后端服务。

HOST: <http://localhost:3000>

- ```POST /api/search```  AI搜索

```json
// 请求参数 Request body
{
  "q": "今日新闻", // [必填]搜索关键词
  "model": "qwen-max", // [必填]模型名称
  "engine": "bing", // [必填]搜索引擎，默认bing

  "stream": true, // [可选]是否流式输出，默认true
  "reload": false, // [可选]是否强制刷新缓存，默认false
  "categories": [], // [可选]SearXNG搜索引擎分类，默认[]
  "mode": "simple", // [可选]搜索模式，type TMode = "simple" | "deep" | "research"
  "language": "all", // [可选]SearXNG搜索引擎语言
  "locally": false, // [可选]是否使用本地大模型
  "provider": "ollama" // [可选]本地大模型服务, 默认ollama
}
```

**[stream = false] 非流式输出**

```json
// 响应参数 Response body
{
  "answer": "text", // AI回答答案
  "contexts": [], // 上下文搜索结果
  "related": [], // 相关搜索问题
  "images": [], // 图片搜索结果
}
```

**[stream = true] 流式输出**

```text
data: {"data": { "answer": "I" } }\n\n
data: {"data": { "answer": "'m " } }\n\n
data: {"data": { "answer": "a robot" } }\n\n
data: {"data": { "image": {...} } }\n\n
data: {"data": { "image": {...} } }\n\n
data: {"data": { "context": {...} } }\n\n
data: {"data": { "context": {...} } }\n\n
data: {"data": { "related": {...} } }\n\n
data: {"data": { "related": {...} } }\n\n
```

参数类型说明

```ts
// 搜索引擎支持类型
export enum ESearchEngine {
  GOOGLE = 'GOOGLE',
  BING = 'BING',
  SOGOU = 'SOGOU',
  SEARXNG = 'SEARXNG',
  CHATGLM = 'CHATGLM'
}

// SearXNG搜索引擎分类
export enum ESearXNGCategory {
  SCIENCE = 'science',
  IT = 'it',
  GENERAL = 'general',
  IMAGES = 'images',
  VIDEOS = 'videos',
  NEWS = 'news',
  MUSIC = 'music'
}

// 搜索模式
export type TMode = 'simple' | 'deep' | 'research'

// 本地大模型服务
export type Provider = 'ollama' | 'lmstudio';
```


- ```GET /api/models``` 获取模型列表

- ```GET /api/local/models``` 本地模型列表

## 部署案例展示

* [UI版本]( https://github.com/onenov/search_with_ai ) 一个漂亮的UI实现
* [sou.ffa.chat](https://sou.ffa.chat/)
* [orence.net/ai](https://orence.net/ai)
* [sou.mofa.chat](https://sou.mofa.chat)

<div align="center">
 <img width="200" src="./assets/wechat.jpg"></img>
 <div>扫码添加助手进群交流</div>
</div>


## 许可证

此存储库的源代码在[MIT许可证](LICENSE)下提供。

[🚀回到顶部](#top)