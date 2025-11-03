<script setup lang="tsx">
import router from '@/router';
import { ChatSenderBox, PageFooter } from '@/components';
import logoUrl from '@/assets/logo.png';
import { computed } from 'vue';
import { useAppStore } from '@/store';
import { IChatInputParams, IChatMessage } from '@/types';
import { ROUTE_NAME } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { saveChat } from '@/storage/chat';

defineOptions({
  name: ROUTE_NAME.HOME
});

const appStore = useAppStore();

const enableScience = computed(() => appStore.engine === 'SEARXNG');

const onSend = async (params: IChatInputParams) => {
  const { value: val } = params;
  if (!val) {
    return;
  }
  const uuid = uuidv4();
  const message: IChatMessage = {
    role: 'user',
    content: val,
  };
  await saveChat(uuid, {
    title: val.slice(0, 30),
    uuid,
    time: new Date().getTime(),
    messages: [message]
  });
  router.push({ name: ROUTE_NAME.CHAT_PAGE, params: { uuid } });
};
</script>

<template>
  <div id="home" class="flex size-full flex-col items-center justify-center dark:bg-black">
    <div class="box-border flex w-full flex-col gap-8 p-4 sm:-mt-28 lg:max-w-3xl xl:max-w-4xl">
      <div class="flex items-center justify-center gap-4">
        <img :src="logoUrl" class="w-14" />
        <span class="text-5xl font-bold dark:text-gray-100">SearchChat</span>
      </div>
      <div class="">
        <ChatSenderBox :autofocus="true" :loading="false" :show-science="enableScience" @send="onSend" />
      </div>
    </div>
    <div class="absolute bottom-2 w-full">
      <PageFooter />
    </div>
  </div>
</template>
