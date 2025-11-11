# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Open AI Search" - a conversation-based search application with LLM support that includes Deep Research capabilities. It's built as a monorepo using Turborepo with two main applications: a Node.js/Koa backend server and a Vue.js frontend.

## Architecture

### Monorepo Structure
- **Root**: Turborepo workspace with yarn@3.5.1 package manager
- **apps/server**: Node.js backend (Koa.js framework, TypeScript)
- **apps/web**: Vue.js frontend (Vue 3, TypeScript, Vite, TDesign UI)

### Key Technologies
- **Backend**: Koa.js, TypeScript, LangChain, multiple LLM providers (OpenAI, Google, DeepSeek, etc.)
- **Frontend**: Vue 3, TypeScript, Vite, Pinia (state management), TDesign Vue Next, Tailwind CSS
- **Build System**: Turborepo for monorepo management
- **Search Engines**: SearXNG, Bing, Google, Tavily integration
- **AI Features**: Deep Research mode with iterative search and analysis

## Development Commands

### Root Level (Turborepo)
```bash
# Start development servers for both apps
turbo dev
# or
yarn dev

# Build all applications
turbo build
# or
yarn build
```

### Server (apps/server)
```bash
# Development with hot reload
yarn dev

# Production start
yarn start

# Type checking
yarn check-types

# Build TypeScript
yarn build
```

### Web (apps/web)
```bash
# Development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Key Features & Components

### Deep Research Mode
- Iterative search and analysis workflow
- Uses LangChain and LangGraph for orchestration
- Supports multiple search engines and web scraping
- Generates comprehensive reports through recursive exploration

### LLM Provider Support
The application supports multiple LLM providers configured through model.json:
- OpenAI (including o1 models)
- Google Gemini
- DeepSeek (including R1)
- Ollama, LMStudio
- Various Chinese providers (Baidu, ChatGLM, Moonshot, Tencent, etc.)

### Search Engine Integration
- SearXNG (free, no API key required)
- Bing Search API
- Google Search (via SearchApi, Serper, or Programmable Search)
- Tavily (LLM-optimized search)
- Jina Reader for web content extraction

## Configuration

### Environment Files
- **Development**: `apps/server/.env.local` and `apps/server/.env`
- **Docker**: `deploy/.env.docker`
- **Model Configuration**: `apps/server/src/model.json` or `deploy/model.json`

### Required Environment Variables
At minimum, set one LLM provider key:
```bash
OPENAI_KEY=your_key
# or other provider keys
```

For search engines:
```bash
SEARXNG_HOSTNAME=http://localhost:8080  # if using SearXNG
BING_SEARCH_KEY=your_key               # if using Bing
# etc.
```

## Development Notes

### Server Architecture
- Main entry: `apps/server/src/app.ts`
- Controllers: `apps/server/src/controller.ts`
- Middleware: `apps/server/src/middleware.ts`
- Interfaces: `apps/server/src/interface.ts`
- Serves static files from built web app

### Frontend Architecture
- Vue 3 with Composition API
- Pinia for state management with persistence
- TDesign Vue Next for UI components
- Vue Router for navigation
- i18n support for internationalization
- Dark/light mode support

### Docker Deployment
The project includes Docker Compose setup in the `deploy/` directory with SearXNG integration for search functionality.