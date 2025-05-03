<template>
  <div id="home" class="flex size-full items-center justify-center dark:bg-black">
    <div class="mt-36 flex w-full flex-col gap-4 p-4 sm:-mt-28 lg:max-w-3xl xl:max-w-4xl">
      <div class="flex items-center justify-center gap-2">
        <img :src="logoUrl" class="w-10" />
        <span class="text-3xl font-bold dark:text-gray-100">AI Search</span>
        <t-tag variant="light" class="text-xs text-gray-500">beta</t-tag>
      </div>
      <SearchInputBar :autofocus="true" :loading="false" @search="search" />
      <div class="my-2 flex flex-wrap items-center justify-center gap-4">
        <SearchMode />
        <SearCategory v-if="enableAdvanced" />
      </div>
      <div class="flex w-full justify-center">
        <div class="flex flex-wrap justify-center gap-2">
          <t-tag
            v-for="(item, index) in list"
            :key="index" shape="round"
            variant="outline"
            size="medium"
            class="cursor-pointer hover:opacity-80"
            @click="onQuickSearch(item)"
          >
            {{ item }} <RiSearch2Line class="ml-1" size="12"/>
          </t-tag>
        </div>
      </div>
      <div class="mt-4">
        <PageFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import router from '@/router';
import { RiSearch2Line } from '@remixicon/vue';
import { PageFooter, SearchInputBar, SearCategory, SearchMode } from '@/components';
import logoUrl from '@/assets/logo.png';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useAppStore } from '@/store';

const { locale } = useI18n();
const appStore = useAppStore();

const enableAdvanced = computed(() => appStore.engine === 'SEARXNG');

const quickly: Record<string, string[]> = {
  zh: [
    '怎么使用Ollama在本地部署大模型?',
    '70b模型一般需要什么样的硬件配置？',
    'DeepSeek R1和o3-mini有什么区别？',
  ],
  en: [
    'What is LLM?',
    'What is RAG?',
    'How to use LLM in enterprise?'
  ],
  ptBR: [
    "O que é LLM?",
    "O que é RAG?",
    "Como utilizar LLM em empresas?"
  ],
  ja: [
    'Ollamaをローカルでデプロイする方法は？',
    '70bモデルにはどのようなハードウェア構成が必要ですか？',
    'DeepSeek R1とo3-miniの違いは何ですか？',
  ],
  zhTW: [
    '如何在本地使用 Ollama 部署大型模型？',
    '70b 模型通常需要什麼樣的硬體配置？',
    'DeepSeek R1 和 o3-mini 有什麼區別？',
  ],
};

const list = computed(() => {
  const key = locale.value;
  return quickly[key] || quickly.en; // 添加默认英语，防止 locale 不匹配
});

const search = (val: string) => {
  if (!val) {
    return;
  }
  if (appStore.mode === 'research') {
    router.push({
      name: 'DeepResearch',
      params: {
        query: val
      }
    });
  } else {
    router.push({
      name: 'SearchPage',
      query: {
        q: val
      }
    });
  }
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
