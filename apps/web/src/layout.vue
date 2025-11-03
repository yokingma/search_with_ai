<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { RiExternalLinkLine, RiGithubLine, RiPencilAi2Line } from '@remixicon/vue';
import { PageHeader, ChatHistory } from './components';
import { scrollWrapperKey } from '@/types';
import logoUrl from '@/assets/logo.png';
import { ROUTE_NAME } from '@/constants';
import { useRouter } from 'vue-router';
import { IChatRecord, listChat, removeChat } from '@/storage/chat';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PageLayout',
});

const { t } = useI18n();

const router = useRouter();
const scrollWrapper = ref<HTMLElement | null>(null);
const histories = ref<IChatRecord[]>([]);
const curHistory = ref<string>();
const count = ref(0);

provide(scrollWrapperKey, {
  scrollWrapper
});

const backHome = () => {
  router.push({ name: ROUTE_NAME.HOME });
};

const cur = computed(() => router.currentRoute.value.params.uuid);

const onSelectChat = (uuid: string) => {
  router.push({ name: ROUTE_NAME.CHAT_PAGE, params: { uuid } });
};

const onRemoveItem = async (uuid: string) => {
  await removeChat(uuid);
  await loadHistory();
  MessagePlugin.success(t('success'));
  router.push({ name: ROUTE_NAME.HOME });
};

watch(() => cur.value, async () => {
  curHistory.value = cur.value as string;
  await loadHistory();
});

onMounted(async () => {
  curHistory.value = cur.value as string;
  loadHistory();
});

async function loadHistory () {
  const res = await listChat(1, 40);
  count.value = res.count;
  histories.value = res.list;
}
</script>

<template>
  <div class="flex size-full flex-nowrap">
    <div class="flex w-72 shrink-0 flex-col border-r border-solid border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-black">
      <div class="relative flex grow flex-col justify-between overflow-y-auto">
        <div class="sticky top-0 z-50 flex shrink-0 flex-col bg-zinc-50 p-4 dark:bg-black">
          <img :src="logoUrl" class="w-8 cursor-pointer" @click="backHome" />
          <div class="mt-4 flex flex-col gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-700">
            <div class="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800" @click="backHome">
              <RiPencilAi2Line class="text-zinc-600" size="16px" />
              <span class="dark:text-white">{{ t('newChat') }}</span>
            </div>
          </div>
        </div>
        <div class="flex grow p-4">
          <ChatHistory v-model="curHistory" :list="histories" @select="onSelectChat" @remove="onRemoveItem" />
        </div>
      </div>
      <div class="shrink-0 p-4">
        <t-link href="https://github.com/yokingma/search_with_ai" hover="color" target="_blank">
          <template #prefix-icon>
            <RiGithubLine size="16px" />
          </template>
          <template #suffix-icon>
            <RiExternalLinkLine size="14px" class="opacity-60" />
          </template>
          Github
        </t-link>
      </div>
    </div>
    <div ref="scrollWrapper" class="flex grow flex-col overflow-y-auto overflow-x-hidden">
      <div class="sticky top-0 z-10 shrink-0">
        <PageHeader />
      </div>
      <div class="box-border flex w-full grow items-start justify-center">
        <div class="size-full lg:max-w-2xl xl:max-w-4xl">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
