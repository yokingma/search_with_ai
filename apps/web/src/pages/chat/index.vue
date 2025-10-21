<script setup lang="ts">
import router from '../../router';
import { search } from '../../api';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../../store';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChatAnswer, ChatMedia  } from '@/components';
import { getChat, updateChat, IChatRecord, store } from '@/storage/chat';
import { IChatMessage, IQueryResult } from '@/types';
import { ROUTE_NAME } from '@/constants';
import { useScrollToBottom } from '@/utils/useScroll';

const appStore = useAppStore();

const { t } = useI18n();

// chat id(uuid)
const uuid = computed(() => router.currentRoute.value.params.uuid as string);

const query = ref<string>();
const isAnswering = ref(false);
const loading = ref(false);

let abortCtrl: AbortController | null = null;

const messages = ref<IChatMessage[]>([]);

const scrollWrapper = ref<HTMLElement | null>(null);

const result = ref<IQueryResult>({
  related: '',
  reasoning: '',
  answer: '',
  contexts: [],
  images: []
});

const onSelectQuery = (val: string) => {
  query.value = val;
  sendMessage(val);
};

// const onSearchModeChanged = (mode: TSearchMode) => {
//   if (!query.value) return;
//   if (mode === 'research') {
//     router.push({ name: 'DeepResearch', params: { query: query.value } });
//   } else {
//     querySearch(query.value, false);
//   }
// };

// const onSearch = (val: string) => {
//   if (!val) return;
//   if (appStore.mode === 'research') {
//     router.push({ name: 'DeepResearch', params: { query: val } });
//   } else {
//     query.value = val;
//     router.currentRoute.value.query.q ??= val;
//     querySearch(val);
//   }
// };

watch(() => uuid.value, async (val) => {
  if (!val) return;
  const res = await getChat(val as string);
  messages.value = [...(res?.messages ?? [])];
  // first message
  if (messages.value.length === 1 && isAnswering.value === false) {
    const message = messages.value[0];
    messages.value = [];
    await sendMessage(message.content);
    clearUserQuery();
  }
  nextTick(() => {
    useScrollToBottom({ target: scrollWrapper.value });
  });
});

onMounted(() => {
  if (!uuid.value) {
    router.push({ name: ROUTE_NAME.HOME });
    return;
  }
  initChat();
});

onUnmounted(() => {
  abortCtrl?.abort();
  abortCtrl = null;
  loading.value = false;
  isAnswering.value = false;
});

async function sendMessage(val: string | null, reload?: boolean) {
  if (!val) return;
  clear();
  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
  }

  const language = appStore.language === 'en' ? 'all' : 'zh';
  const ctrl = new AbortController();
  abortCtrl = ctrl;
  try {
    loading.value = true;
    const { model, engine, category } = appStore;
    const provider = model?.provider;
    const modelName = model?.name;
    await search(val, {
      model: modelName,
      provider,
      engine,
      language,
      categories: [category],
      reload,
      ctrl,
      onMessage: (data: any) => {
        if (data?.context) {
          result.value.contexts?.push(data.context);
        }
        if (data?.image) {
          result.value.images?.push(data.image);
        }
        if (data?.content) {
          result.value.answer += data.content;
        }
        if (data?.reasoningContent) {
          result.value.reasoning += data.reasoningContent;
        }
        if (data?.related) {
          result.value.related += data.related;
        }
      },
      onClose: () => {
        console.log('closed');
        abortCtrl = null;
        loading.value = false;
      },
      onError: (err) => {
        console.error('error', err);
         MessagePlugin.error(`${t('message.queryError')}: ${err.message}`);
        loading.value = false;
      }
    });
  } catch(err) {
    ctrl.abort();
    abortCtrl = null;
    console.log(err);
    loading.value = false;
    MessagePlugin.error(t('message.queryError'));
  }
}

function clear () {
  result.value = {
    related: '',
    reasoning: '',
    answer: '',
    contexts: [],
    images: []
  };
}

async function initChat () {
  if (isAnswering.value) return;
  if (!uuid.value) return;
  const res = await getChat(uuid.value);
  if (!res?.messages?.length) {
    return router.push({ name: ROUTE_NAME.HOME });
  }
  // first message
  if (res.messages.length === 1) {
    await sendMessage(res.messages[0].content);
    clearUserQuery();
  } else {
    // load history messages
    messages.value.push(...res.messages);
  }
}

function clearUserQuery () {
  if (query.value) query.value = undefined;
}
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
};
</script>

<template>
  <div ref="scrollWrapper" class="size-full">
    <div class="inset-0 flex items-center justify-center">
      <div class="size-full lg:max-w-2xl xl:max-w-4xl">
        <div class="p-4 lg:p-0">
          <div class="mt-0">
            <ChatAnswer
              :answer="result?.answer"
              :reasoning="result?.reasoning"
              :contexts="result?.contexts"
              :loading="loading"
              :related="result?.related"
            />
          </div>
          <div v-if="appStore.engine === 'SEARXNG'" class="mt-4">
            <ChatMedia :loading="loading" :sources="result?.images" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
