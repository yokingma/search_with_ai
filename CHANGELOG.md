# Changelog

> 🤖 Generated with [Claude Code](https://claude.com/claude-code)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.2.0-alpha.1] - 2025-11-13

### 🚀 Major Rewrites

- **🔄 Server-Side Logic Rewrite**: Complete overhaul of backend architecture
  - Refactored core modules with improved API design
  - Enhanced error handling and request processing mechanisms
  - Updated prompt templates and LLM integration patterns
  - Improved chat request abortion and user message handling

- **🎨 Frontend UI Rewrite**: Comprehensive frontend redesign and optimization
  - Restructured chat components for better maintainability and performance
  - Enhanced ChatAnswer component with improved rendering efficiency
  - Redesigned code block rendering with better styling and structure
  - Improved theme consistency and dark mode support

### ✨ New Features

- **Anthropic LLM Support**: Added support for Anthropic Claude models integration
- **Chat History Sidebar**: Implemented persistent chat history with localStorage support
- **LangGraph Streaming**: Added streaming support for LangGraph content responses
- **Collapsed Sidebar Mode**: Added collapsible sidebar functionality for better UX

### 🐛 Bug Fixes

- **Web Frontend**:
  - Fixed dark mode display issues and improved theme consistency
  - Optimized citation rendering and display
  - Improved link visibility in various themes
  - Fixed user message handling and display

- **Server Backend**:
  - Enhanced error handling mechanisms
  - Fixed user message processing
  - Improved chat request abortion handling

### 🔧 Improvements

- **Component Architecture**: Restructured chat components for better maintainability
- **Internationalization**: Updated English translations (i18n/en.ts)

### 📚 Documentation

- Added CLAUDE.md file for AI assistant integration guidelines
- Updated README.md with latest project information

### 🗑️ Removed

- Removed Portuguese BR language support to streamline localization

---

## [v1.1.1] - Previous Release

### Features
- Basic AI search functionality
- Multi-engine search support
- Vue.js frontend with TypeScript
- Node.js backend with Koa framework

---

## [1.0.0] - Initial Release

### Features
- Initial project setup
- Core search functionality
- Basic AI integration