<script setup lang="tsx">
import router from '@/router';
import { ChatSenderBox } from '@/components';
import logoUrl from '@/assets/logo.png';
import { computed } from 'vue';
import { useAppStore } from '@/store';
import { IChatInputParams } from '@/types';
import { ROUTE_NAME } from '@/constants';

defineOptions({
  name: ROUTE_NAME.HOME
});

const appStore = useAppStore();

const enableAdvanced = computed(() => appStore.engine === 'SEARXNG');

const search = (params: IChatInputParams) => {
  const { value: val } = params;
  if (!val) {
    return;
  }
  router.push({
    name: ROUTE_NAME.SEARCH_PAGE,
    query: {
      q: val
    }
  });
};
</script>


<template>
  <div id="home" class="flex size-full items-center justify-center dark:bg-black">
    <div class="flex w-full flex-col gap-8 p-4 sm:-mt-28 lg:max-w-3xl xl:max-w-4xl">
      <div class="flex items-center justify-center gap-4">
        <img :src="logoUrl" class="w-14" />
        <span class="text-5xl font-bold dark:text-gray-100">SearchChat</span>
      </div>
      <div class="">
        <ChatSenderBox :autofocus="true" :loading="false" :show-science="enableAdvanced" @send="search" />
      </div>
    </div>
  </div>
</template>
