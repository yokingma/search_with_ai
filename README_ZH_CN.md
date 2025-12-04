<a name="top"></a>

<div align="center">

# 🔍 SearChat

**基于AI大语言模型的对话式搜索引擎**

*多模型、搜索引擎集成  | 实时对话式搜索 | 支持 Deep Research 深度研究*

<p align="center">
  <a href="https://github.com/sear-chat/SearChat/stargazers"><img src="https://img.shields.io/github/stars/sear-chat/SearChat" alt="Github Stars"></a>
  <a href="https://github.com/sear-chat/SearChat/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-purple" alt="License"></a>
  <a href="https://github.com/sear-chat/SearChat/issues/new"><img src="https://img.shields.io/badge/Report a bug-Github-%231F80C0" alt="Report a bug"></a>
  <a href="https://github.com/sear-chat/SearChat/discussions/new?category=q-a"><img src="https://img.shields.io/badge/Ask a question-Github-%231F80C0" alt="Ask a question"></a>
</p>

[English](./README.md) | **中文** | [日本語](./README_JP.md)

</div>

---

<div align="center">
 <img src="./assets/screenshot.png" alt="AI Search Chat 界面截图" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"></img>
</div>

## 🌟 项目简介

SearChat 是一个基于现代 AI 大语言模型的对话式搜索引擎。

🎯 **核心特色**：
- [x] 🤖 **多模型支持** - 支持OpenAI、Anthropic、Gemini兼容的API
- [x] 🔍 **多搜索引擎** - 支持 Bing、Google、SearXNG 等多种搜索源
- [x] 💬 **对话式搜索** - 支持多轮聊天式的搜索
- [x] ⏰ **对话历史记录** - 历史对话记录缓存在浏览器中（基于IndexedDB/LocalStorage）
- [x] 🧠 **Deep Research 模式** - 重构深度研究功能
- [ ] 🔌 **MCP支持** - (TODO) 支持接入外部各类MCP服务
- [ ] 🖼️ **图片搜索** - (TODO) 支持图片或者视频搜索
- [ ] 📂 **文件解析** - (TODO) 支持上传文档并提取内容

## ✨ 核心功能

### 🧠 Deep Research 深度研究
- **智能研究模式** - 深度研究功能
- **迭代式探索** - 基于 LangChain + LangGraph 的工作流编排
- **全面报告生成** - 自动生成结构化的研究报告

### 🤖 AI 模型支持

> [!IMPORTANT]
> 为了达到最佳效果，模型**必须支持 Tool Call (Function Calling)**。

- OpenAI API兼容
- Google Gemini API兼容
- Anthropic API兼容
- Google Vertex AI 兼容

### 🔍 多搜索引擎集成

- **SearXNG** - 开源聚合搜索，无需 API Key
- **Bing Search** - 微软官方搜索 API
- **Google Search** - 支持多种 API 接入方式
- **Tavily** - 专为 LLM 优化的搜索引擎
- **Exa** - Exa.ai 网络搜索 API
- **Bocha** - BochaAI 网络搜索 API
- **ChatGLM Web Search** - 智谱 AI 免费搜索插件

### 🎨 现代化界面体验

- **响应式设计** - 完美适配桌面端和移动端
- **深色/浅色主题** - 支持系统主题自动切换
- **国际化支持** - 多语言界面 (i18n)
- **实时流式输出** - 打字机效果的回答展示
- **上下文对话** - 支持多轮对话和历史记录

## 🔬 Deep Research 深度研究模式

Deep Research 模式通过 AI 驱动的迭代式搜索和分析，为任何主题生成全面深入的研究报告。

### 📹 功能演示

[功能演示](https://youtu.be/W_455aI14hI)

### 📦 独立使用

如果你想在自己的 Node.js 项目中集成 Deep Research 能力：

```bash
npm install deepsearcher
```

详细文档：[DeepResearch NPM 包](https://www.npmjs.com/package/deepsearcher)

## 🐳 快速部署 (推荐 Docker)

### 📋 部署前准备

- [安装 Docker](https://docs.docker.com/install/) 和 Docker Compose
- 准备 AI 模型 API Key (在 `model.json` 中配置)
- 可选：配置搜索引擎 API Key (在 `.env.docker` 中配置)
- 确保主机网络能访问相关服务 (SearXNG 需要访问 Google等)

### 🚀 一键部署

#### 1. 创建 [docker-compose.yaml](./deploy/docker-compose.yaml) 文件
请参考 [deploy/docker-compose.yaml](./deploy/docker-compose.yaml)文件。

#### 2. 配置环境变量

编辑 `docker-compose.yaml` 文件，在 `search_chat` 服务中修改相应的环境变量：

```yaml
services:
  search_chat:
    container_name: search_chat
    image: docker.cnb.cool/aigc/aisearch:v1.2.0-alpha
    environment:
      # 服务器配置
      - PORT=3000

      # 搜索引擎 API Keys (根据需要配置)
      - BING_SEARCH_KEY=your_bing_key
      - GOOGLE_SEARCH_KEY=your_google_key
      - GOOGLE_SEARCH_ID=your_google_cse_id
      - TAVILY_KEY=your_tavily_key
      - ZHIPU_KEY=your_zhipu_key
      - EXA_KEY=your_exa_key
      - BOCHA_KEY=your_bocha_key

      # 网页内容提取 (可选)
      - JINA_KEY=your_jina_key

      # SearXNG 配置 (默认已包含，开箱即用)
      - SEARXNG_HOSTNAME=http://searxng:8080
      - SEARXNG_SAFE=0
      - SEARXNG_LANGUAGE=zh
      - SEARXNG_ENGINES=bing,google
      - SEARXNG_IMAGES_ENGINES=bing,google

      # DeepResearch 配置
      - DEEP_MAX_RESEARCH_LOOPS=3
      - DEEP_NUMBER_OF_INITIAL_QUERIES=3

      # 域名白名单 (可选)
      - WHITELIST_DOMAINS=
    volumes:
      - ./model.json:/app/apps/server/dist/model.json
    ports:
      - "3000:3000"
    restart: always
```

#### 3. 配置 AI 模型 (必需)

在docker-compose.yaml同级目录下创建&编辑 [model.json](./deploy/model.json) 文件，配置 AI 模型和 API Keys：

```json
[
  {
    "provider": "openai",
    "type": "openai",
    "baseURL": "https://api.openai.com/v1",
    "apiKey": "sk-your-openai-api-key",
    "models": [
      {
        "name": "gpt-4o-mini",
        "alias": "GPT-4o Mini",
        "description": "OpenAI GPT-4o Mini 模型",
        "maxTokens": 262144,
        "intentAnalysis": true
      },
      {
        "name": "gpt-4o",
        "alias": "GPT-4o",
        "description": "OpenAI GPT-4o 模型",
        "maxTokens": 262144
      }
    ]
  },
  {
    "provider": "anthropic",
    "type": "anthropic",
    "baseURL": "https://api.anthropic.com/v1",
    "apiKey": "sk-your-anthropic-api-key",
    "models": [
      {
        "name": "claude-sonnet-4-5",
        "alias": "Claude Sonnet 4.5",
        "description": "Anthropic Claude Sonnet 4.5",
        "maxTokens": 131072
      }
    ]
  }
]
```

其中设定为 `intentAnalysis: true` 的模型会被用来进行搜索意图分析、搜索问题重写，建议此处可以设定为较小尺寸的模型以提高回答速度。

**配置说明**：
- `provider`: 模型提供商名称
- `type`: API 类型 (openai/anthropic/google 等)
- `baseURL`: API 基础地址
- `apiKey`: 你的 API Key
- `models`: 模型列表，包含名称、别名、描述和最大 Token 数

#### 4. 启动服务

```bash
cd deploy
docker compose up -d
```

#### 5. 访问应用

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

### 🔄 更新部署

```bash
# 停止服务
docker compose down

# 拉取最新镜像
docker pull docker.cnb.cool/aigc/searchchat:latest

# 重新启动
docker compose up -d
```

## 🔍 搜索引擎配置

项目支持多种搜索引擎，可根据需求选择合适的搜索源，推荐使用SearXNG搜索引擎。

### 🆓 SearXNG (推荐 - 免费开源)

**优势**：完全免费、无需 API Key、聚合多个搜索源、保护隐私

SearXNG 是开源的元搜索引擎，聚合多个搜索服务结果，不追踪用户。Docker 部署已内置，开箱即用。

**配置选项**：
- `SEARXNG_ENGINES`: 设置搜索引擎 (默认: bing,google)
- `SEARXNG_LANGUAGE`: 搜索语言 (zh=中文, en-US=英文, all=全部)
- `SEARXNG_SAFE`: 安全搜索级别 (0=关闭, 1=中等, 2=严格)

**[!重要]**

确保激活json格式以使用API。可以通过在`searxng/settings.yml`文件中添加以下行来完成：
```yaml
search:
    formats:
        - html
        - json
```

## 💻 本地开发

### 📋 环境要求

- **Node.js** >= 20
- **包管理器** yarn@3.5.1
- **构建工具** Turborepo

### 🏗️ 项目架构

```text
search_with_ai/
├── apps/
│   ├── server/          # 后端服务 (Koa + TypeScript)
│   │   ├── src/
│   │   │   ├── app.ts           # 应用入口
│   │   │   ├── controller.ts    # 路由控制器
│   │   │   ├── interface.ts     # 类型定义
│   │   │   └── model.json       # 模型配置
│   │   └── package.json
│   └── web/             # 前端应用 (Vue 3 + TypeScript)
│       ├── src/
│       │   ├── pages/           # 页面组件
│       │   ├── stores/          # Pinia 状态管理
│       │   └── components/      # 通用组件
│       └── package.json
├── deploy/              # 部署配置
│   ├── docker-compose.yaml
│   ├── .env.docker
│   └── model.json
└── package.json         # 根目录配置
```

### 🚀 开发流程

#### 1. 安装依赖

```bash
# 克隆项目
git clone https://github.com/sear-chat/SearChat.git
cd SearChat

# 安装依赖 (根目录执行，会自动安装所有子项目依赖)
yarn install
```

#### 2. 配置环境

复制并编辑服务端环境配置：

```bash
# 复制环境配置模板
cp apps/server/.env apps/server/.env.local

# 编辑配置文件
vim apps/server/.env.local
```

#### 3. 启动开发服务

```bash
# 同时启动前后端开发服务器
yarn dev

# 或使用 Turborepo 命令
turbo dev
```

访问地址：

- 前端：[http://localhost:5173](http://localhost:5173)
- 后端：[http://localhost:3000](http://localhost:3000)

#### 4. 构建生产版本

```bash
# 构建所有应用
yarn build

# 或
turbo build
```

### 🔧 开发工具

#### 后端技术栈

- **框架**：Koa.js + TypeScript
- **AI 集成**：LangChain + LangGraph
- **搜索引擎**：多引擎适配器模式

#### 前端技术栈

- **框架**：Vue 3 + Composition API
- **构建**：Vite + TypeScript
- **UI 库**：TDesign Vue Next
- **状态管理**：Pinia + 持久化
- **样式**：Tailwind CSS + Less

## 🤝 贡献指南

欢迎参与项目[贡献](./CONTRIBUTION.md)！请遵循以下步骤：

1. **Fork 项目** 到你的 GitHub 账户
2. **创建功能分支** `git checkout -b feature/amazing-feature`
3. **提交更改** `git commit -m 'Add amazing feature'`
4. **推送分支** `git push origin feature/amazing-feature`
5. **创建 Pull Request**

### 🐛 问题反馈

- [GitHub Issues](https://github.com/sear-chat/SearChat/issues) - 报告 Bug 或功能请求
- [GitHub Discussions](https://github.com/sear-chat/SearChat/discussions) - 技术讨论和问答

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [SearXNG](https://github.com/searxng/searxng) - 开源搜索引擎
- [LangChain](https://github.com/langchain-ai/langchain) - AI 应用开发框架
- [Tencent EdgeOne](https://edgeone.ai/?from=github) - CDN 加速支持

### 💬 微信群

请先添加微信进群
![微信](wechat.jpg)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**

[🚀 回到顶部](#top)

</div>