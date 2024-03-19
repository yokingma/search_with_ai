<template>
  <div id="home" class="flex size-full items-center justify-center">
    <div class="mt-36 flex flex-col gap-4 p-4 sm:-mt-28">
      <div class="flex items-center justify-center gap-2">
        <img :src="logoUrl" class="w-10" />
        <span class="text-3xl font-bold">AI Search</span>
        <t-tag variant="light" class="text-xs text-gray-500">beta</t-tag>
      </div>
      <SearchInputBar :loading="false" @search="search" />
      <div class="grid grid-cols-1 justify-center gap-2 sm:grid-cols-2 md:grid-cols-3">
        <t-tag v-for="(item, index) in quickly" :key="index" variant="light" class="cursor-pointer hover:opacity-80" @click="onQuickSearch(item)">
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

const quickly = [
  '什么是大语言模型LLM?',
  '什么是RAG?',
  'LLM如何在企业落地应用?'
];

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
