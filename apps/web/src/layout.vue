<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { RiGithubLine, RiHistoryLine, RiPencilAi2Line, RiSidebarFoldLine, RiSidebarUnfoldLine } from '@remixicon/vue';
import { PageHeader, ChatHistory } from './components';
import { scrollWrapperKey } from '@/types';
import { ROUTE_NAME } from '@/constants';
import { useRouter } from 'vue-router';
import { IChatRecord, listChat, removeChat } from '@/storage/chat';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import { useAppStore } from './store';
import { useWindowSize } from '@vueuse/core';
import logoUrl from '@/assets/logo.png';

defineOptions({
  name: 'PageLayout',
});

const { width } = useWindowSize();

const { t } = useI18n();
const appStore = useAppStore();
const theme = computed(() => appStore.theme);
const collapsed = ref(false);
const curMenu = ref('');

const router = useRouter();
const scrollWrapper = ref<HTMLElement | null>(null);
const histories = ref<IChatRecord[]>([]);
const curHistory = ref<string>();
const count = ref(0);

const showHistoryModal = ref(false);

provide(scrollWrapperKey, {
  scrollWrapper
});

const backHome = () => {
  router.push({ name: ROUTE_NAME.HOME });
};

const cur = computed(() => router.currentRoute.value.params.uuid);

const onSelectChat = (uuid: string) => {
  showHistoryModal.value = false;
  router.push({ name: ROUTE_NAME.CHAT_PAGE, params: { uuid } });
};

const onRemoveItem = async (uuid: string) => {
  await removeChat(uuid);
  await loadHistory();
  MessagePlugin.success(t('message.success'));
  router.push({ name: ROUTE_NAME.HOME });
};

watch(() => cur.value, async () => {
  curHistory.value = cur.value as string;
  await loadHistory();
});

watch(() => width.value, () => {
  if (width.value < 640) {
    collapsed.value = true;
  }
  if (width.value >= 1024) {
    collapsed.value = false;
  }
}, { immediate: true });

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
    <div class="flex shrink-0 flex-col border-r border-solid border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-black">
      <t-menu
        v-model="curMenu"
        width="288px"
        :theme="theme"
        :collapsed="collapsed"
        @change="() => { curMenu = ''; }"
      >
        <template #logo>
          <img :src="logoUrl" class="w-8 cursor-pointer" @click="backHome" />
        </template>
        <t-menu-item value="chat" @click="backHome">
          <template #icon>
            <RiPencilAi2Line class="text-zinc-600" size="16px" />
          </template>
          <span class="px-2 font-bold">{{ t('newChat') }}</span>
        </t-menu-item>
        <div class="mt-4">
          <t-divider />
        </div>
        <t-menu-item v-if="collapsed" @click="showHistoryModal = !showHistoryModal">
          <template #icon>
            <RiHistoryLine size="16px" />
          </template>
          <span class="px-2 font-bold">{{ t('history') }} ({{ count }})</span>
        </t-menu-item>
        <div class="flex grow flex-col justify-between gap-4 overflow-hidden">
          <div class="grow overflow-hidden">
            <div v-if="!collapsed" class="size-full overflow-y-auto overflow-x-hidden">
              <ChatHistory v-model="curHistory" :list="histories" @select="onSelectChat" @remove="onRemoveItem" />
            </div>
          </div>
          <div class="shrink-0 px-4">
            <t-tooltip content="Github" placement="right">
              <t-link href="https://github.com/yokingma/search_with_ai" hover="color" target="_blank">
                <template #prefix-icon>
                  <RiGithubLine size="18px" />
                </template>
                <span v-if="!collapsed" class="font-bold">Github</span>
              </t-link>
            </t-tooltip>
          </div>
        </div>
        <template #operations>
          <t-tooltip :content="collapsed ? t('expand') : t('collapse')" placement="right">
            <t-button variant="text" shape="square" @click="() => { collapsed = !collapsed; }">
              <template #icon>
                <RiSidebarFoldLine v-if="!collapsed" size="18px" />
                <RiSidebarUnfoldLine v-else size="18px" />
              </template>
            </t-button>
          </t-tooltip>
        </template>
      </t-menu>
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
    <t-dialog v-if="collapsed" v-model:visible="showHistoryModal" :footer="false" :header="t('history')">
      <ChatHistory v-model="curHistory" :list="histories" @select="onSelectChat" @remove="onRemoveItem" />
    </t-dialog>
  </div>
</template>

<style lang="less" scoped>
:deep(.t-menu) {
  display: flex;
  flex-direction: column;
}
:deep(.t-menu__logo) {
  border-bottom: none!important;
}
:deep(.t-menu__item) {
  border-radius: 0.5rem;
}
:deep(.t-dialog--default) {
  padding: 1rem;
}
</style>
