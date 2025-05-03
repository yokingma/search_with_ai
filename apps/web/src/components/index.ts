<script setup lang="ts">
import {
  ChatAnswer,
  ChatSources,
  ChatMedia,
  SearchInputBar,
  RelatedQuery,
  ModelSelect,
  LanguageSelect,
  SearchEngineSelect,
  ToolBar,
  SearCategory,
  SearchMode,
  PageFooter,
  AppSettings
} from './components';
</script>

<template>
  <SearchInputBar />
  <ChatAnswer />
  <ChatSources />
  <ChatMedia />
  <RelatedQuery />
  <ModelSelect />
  <LanguageSelect />
  <SearchEngineSelect />
  <ToolBar />
  <SearCategory />
  <SearchMode />
  <PageFooter />
  <AppSettings />
</template>
