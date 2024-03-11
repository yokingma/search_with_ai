# Search with AI
基于AI大语言模型的对话式搜索引擎的简单实现，基于Node.js&Vue3。


## 功能说明
* 1、内置主流的LLM接口支持，如OpenAI、Google Gemini、阿里云通译千问、百度文心一言等。
* 2、内置搜索引擎支持，如Bing、Sogou。
* 3、简介的搜索对话界面。
* 4、搜索历史记录(TODO)。
* 5、基于结果的多轮对话(TODO)。

## 搜索引擎配置
内置了两个搜索引擎服务：Bing、Sogou、Google(TODO)。

#### Bing搜索
如果要使用必应搜索，需要注册并订阅[Bing搜索服务](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)，获取必应订阅密钥(key)。

> Bing搜索接口是收费的，但是每人每月有1000次免费调用额度。

#### Sogou搜索
内置的Sogou搜索并非直接调用API实现（似乎没有开放的API），只是通过类似爬虫的方式分析获取搜索结果。
> 优点是免费的，(但是似乎会触发人机验证?)

## 安装使用

国内用户推荐使用阿里云通译千问大模型，在阿里云注册可以获取密钥(key)，API使用是免费的，限制是60QPS。
搜索引擎使用内置的Sogou搜索，也是免费的。

* **服务端**
```shell
yarn install
```

* **前端页面**
```shell
cd web && yarn install && yarn run build
```

* **配置**
```ts
// 根目录下的.env文件为环境配置文件，此处配置各种key等
// Bing 搜索服务 key
BING_SEARCH_KEY=your-key
// aliyun 通译千问 key
ALIYUN_KEY=your-key
// openai ChatGPT key
OPENAI_KEY=your-key
// openai代理服务地址，便于无法直接使用openai服务的用户，不用可留空
OPENAI_PROXY_URL=https://api.openai.com/v1
```

* 启动
```shell
yarn run start 
```

启动成功后可以在浏览器打开http://localhost:3000/search 即可使用。

## Docker 部署
也可以使用Docker一键部署
```shell
```

