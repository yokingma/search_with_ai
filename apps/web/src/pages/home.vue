<script setup lang="tsx">
import router from '@/router';
import { PageFooter, ChatSenderBox } from '@/components';
import logoUrl from '@/assets/logo.png';
import { computed } from 'vue';
import { useAppStore } from '@/store';
import { InputParams } from '@/components/type';

defineOptions({
  name: 'HomePage'
});

const appStore = useAppStore();

const enableAdvanced = computed(() => appStore.engine === 'SEARXNG');

const search = (params: InputParams) => {
  const { value: val } = params;
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
</script>


<template>
  <div id="home" class="flex size-full items-center justify-center dark:bg-black">
    <div class="mt-36 flex w-full flex-col gap-8 p-4 sm:-mt-28 lg:max-w-3xl xl:max-w-4xl">
      <div class="flex items-center justify-center gap-4">
        <img :src="logoUrl" class="w-14" />
        <span class="text-5xl font-bold dark:text-gray-100">Search with AI</span>
      </div>
      <div class="">
        <ChatSenderBox :autofocus="true" :loading="false" :show-science="enableAdvanced" @send="search" />
      </div>
      <div class="mt-4">
        <PageFooter />
      </div>
    </div>
  </div>
</template>
