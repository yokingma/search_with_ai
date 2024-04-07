# Search with AI
基于AI大语言模型的对话式搜索引擎的一个简单实现，基于Node.js&Vue3。 [Live Demo](https://isou.chat/)
<div align="center">
 <img src="./screenshot.jpg" alt="Search with AI" />
</div>

仓库地址：[GitHub仓库](https://github.com/yokingma/search_with_ai)、 [Gitee仓库](https://gitee.com/zac_ma/search_with_ai)

## 功能说明
* 1、内置主流的LLM接口支持，如OpenAI、Google、通译千问、百度文心一言、Lepton等。
* 2、内置搜索引擎支持，如Bing、Sogou。
* 3、简洁的搜索对话Web界面。
* 4、Web界面支持暗色模式。
* 5、Web界面支持移动端。
* 6、支持搜索引擎切换、AI模型切换。
* 7、搜索历史记录(TODO)。
* 8、基于结果的多轮对话(TODO)。
* 9、抓取参考网页的全部内容作为上下文(TODO)。

## 大模型支持
* OpenAI ChatGPT
* Google Gemini
* Lepton LLama2、Mixtral8*7B
* 阿里云通译千问
* 百度文心一言
* 零一万物
* 月之暗面（Kimi）
* 腾讯混元

## 搜索引擎配置
内置了搜索引擎服务：Bing、Sogou、Google(TODO)。

#### Bing搜索
如果要使用必应搜索，需要注册并订阅[Bing搜索服务](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)，获取必应订阅密钥(key)。

> Bing搜索接口是收费的，但是每月有1000次免费调用额度。

#### Sogou搜索
内置的Sogou搜索并非直接调用API实现（似乎没有开放的API），只是通过类似爬虫的方式分析获取搜索结果。
> 内置的Sogou搜索优点是免费的，**但是会触发人机验证**，遇到不返回参考资料的情况可以手动打开sogou.com随便搜索关键词，根据提示手动验证一下解除。

## 安装使用

需要：
> Node.js >= 18

国内用户推荐使用阿里云通译千问大模型，在阿里云[模型服务灵积](https://dashscope.aliyun.com/)注册可以获取密钥(key)，通译千问部分API使用是免费的(qwen-max、qwen-max-1201、qwen-max-longcontext)，除了longcontext模型其他限制是60次请求/分钟。

* **服务端**
```shell
yarn install && yarn run build
```

* **前端页面**
```shell
cd web && yarn install && yarn run build
```

* **配置**
```ts
// .env
// Bing key
BING_SEARCH_KEY=your-key
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

启动成功后可以在浏览器打开http://localhost:3000 即可使用。
