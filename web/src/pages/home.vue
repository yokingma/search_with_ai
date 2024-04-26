<template>
  <div id="home" class="flex size-full items-center justify-center dark:bg-black">
    <div class="mt-36 flex w-full flex-col gap-4 p-4 sm:-mt-28 lg:max-w-3xl xl:max-w-4xl">
      <div class="flex items-center justify-center gap-2">
        <img :src="logoUrl" class="w-10" />
        <span class="text-3xl font-bold dark:text-gray-100">AI Search</span>
        <t-tag variant="light" class="text-xs text-gray-500">beta</t-tag>
      </div>
      <SearchInputBar :autofocus="true" :loading="false" @search="search" />
      <div class="grid grid-cols-1 justify-center gap-2 sm:grid-cols-2 md:grid-cols-3">
        <t-tag v-for="(item, index) in list" :key="index" shape="round" variant="light" class="cursor-pointer hover:opacity-80" @click="onQuickSearch(item)">
          {{ item }}
        </t-tag>
      </div>
      <div class="mt-4">
        <PageFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import router from '../router';
import { PageFooter, SearchInputBar } from '../components';
import logoUrl from '../assets/logo.png';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { locale } = useI18n();

const quickly: Record<string, string[]> = {
  zh: [
    '什么是大语言模型LLM?',
    '什么是RAG?',
    'LLM如何在企业落地应用?'
  ],
  en: [
    'What is LLM?',
    'What is RAG?',
    'How to use LLM in enterprise?'
  ]
};

const list = computed(() => {
  const key = locale.value;
  return quickly[key];
});

const search = (val: string) => {
  if (!val) {
    return;
  }
  router.push({
    name: 'SearchPage',
    query: {
      q: val
    }
  });
};

const onQuickSearch = (val: string) => {
  search(val);
};
</script>

<script lang="tsx">
export default {
  name: 'HomePage'
};
</script>
