<template>
  <div id="search" class="size-full">
    <div class="fixed inset-x-0 top-0 z-50 w-full border-0 border-b border-solid border-zinc-100 bg-white py-2 dark:border-zinc-700 dark:bg-black">
      <div class="flex w-full items-center justify-center">
        <div class="flex w-full flex-row flex-nowrap items-center gap-4 lg:max-w-2xl lg:p-0 xl:max-w-4xl">
          <div class="grow pl-2">
            <SearchInputBar v-model="query" :autofocus="false" :loading="loading" @search="onSearch" />
          </div>
          <div class="shrink-0 grow-0 pr-2">
            <t-tooltip :content="t('back')">
              <t-button shape="circle" theme="default" @click="onBackHome">
                <template #icon>
                  <RiArrowGoBackLine size="14px" />
                </template>
              </t-button>
            </t-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="inset-0 flex items-center justify-center">
      <div class="size-full lg:max-w-2xl xl:max-w-4xl">
        <main class="mt-20">
          <div v-if="!loading" class="flex flex-wrap justify-between gap-2 px-4 py-2 lg:px-0">
            <SearchMode @change="onSearchModeChanged" />
            <SearCategory @change="onSearchCategoryChanged" />
          </div>

          <section class="p-4 lg:p-0">
            <div class="mt-0">
              <div class="flex flex-nowrap items-center gap-2 py-4 text-black dark:text-gray-200">
                <RiChat3Line />
                <span class="text-lg font-bold ">{{ t('answer') }}</span>
              </div>
              <ChatAnswer
                :query="query"
                :answer="result?.answer"
                :reasoning="result?.reasoning"
                :contexts="result?.contexts"
                :loading="loading"
                @reload="onReload"
              />

              <div class="mt-4 flex flex-col gap-2">
                <div class="text-sm font-bold text-zinc-600 dark:text-gray-300">{{ t('related') }}:</div>
                <RelatedQuery :related="result?.related" :loading="loading" @select="onSelectQuery" />
              </div>
            </div>

            <div v-if="appStore.engine === 'SEARXNG'" class="mt-4">
              <ChatMedia :loading="loading" :sources="result?.images" />
            </div>

            <div class="mt-4">
              <div class="flex flex-nowrap items-center gap-2 py-4 text-black dark:text-gray-200">
                <RiBook2Line />
                <span class="text-lg font-bold ">{{ t('sources') }}</span>
              </div>
              <ChatSources :loading="loading" :sources="result?.contexts" />
            </div>

            <div class="my-4">
              <div class="flex flex-nowrap items-center gap-2 py-4 text-black dark:text-gray-200">
                <RiChat1Fill />
                <span class="text-lg font-bold ">{{ t('chat') }}</span>
              </div>
              <ContinueChat
                :contexts="result?.contexts"
                :reasoning="result?.reasoning"
                :clear="loading"
                :query="query"
                :answer="result?.answer ?? ''"
                :question="question"
                @message="onAnswering"
                @done="onContinueChatDone"
              />
            </div>

            <div class="pb-20 pt-10">
              <PageFooter />
            </div>
          </section>
        </main>

        <div class="fixed inset-x-0 bottom-0 z-50 w-full bg-gradient-to-t from-white to-transparent py-4 dark:from-black">
          <div class="flex w-full items-center justify-center">
            <div class="w-full drop-shadow-2xl lg:max-w-2xl xl:max-w-4xl">
              <ChatInput :loading="loading" @ask="onContinueChat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '../../router';
import { search } from '../../api';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../../store';
import ContinueChat from './components/chat.vue'; // 假设路径正确
import ChatInput from './components/input.vue'; // 假设路径正确
import ChatAnswer from import ChatAnswer from './answer.tsx';; // 使用 .tsx 扩展名
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { PageFooter, ChatMedia, RelatedQuery, ChatSources, SearchInputBar, SearchMode, SearCategory } from '../../components'; // 假设路径正确
import { RiChat3Line, RiBook2Line, RiChat1Fill, RiArrowGoBackLine } from '@remixicon/vue';
import { IQueryResult, TSearCategory, TSearchMode } from '../../interface'; // 假设路径正确

const appStore = useAppStore();
const { t } = useI18n();

const keyword = computed(() => router.currentRoute.value.query.q ?? '');
const query = ref<string>('');
const question = ref<string>('');
const loading = ref(false);

let abortCtrl: AbortController | null = null;

const result = ref<IQueryResult>({
  related: '',
  reasoning: '',
  answer: '',
  contexts: [],
  images: []
});

const onBackHome = () => {
  router.push({ name: 'Home' });
};

const onSearchModeChanged = (mode: TSearchMode) => {
  if (!query.value) return;
  if (mode === 'research') {
    router.push({ name: 'DeepResearch', params: { query: query.value } });
  } else {
    querySearch(query.value, false);
  }
};

const onSearchCategoryChanged = (category: TSearCategory) => {
  console.log(category);
  querySearch(query.value, false);
};

const onSelectQuery = (val: string) => {
  query.value = val;
  querySearch(val);
  scrollToTop();
};

const onSearch = (val: string) => {
  if (!val) return;
  if (appStore.mode === 'research') {
    router.push({ name: 'DeepResearch', params: { query: val } });
  } else {
    query.value = val;
    router.currentRoute.value.query.q ??= val;
    querySearch(val);
  }
};

const onContinueChat = (val: string) => {
  question.value = val.trim();
  scrollToBottom();
};

const onContinueChatDone = () => {
  question.value = '';
  scrollToBottom();
};

const onAnswering = () => {
  scrollToBottom();
};

const onReload = () => {
  querySearch(query.value, true);
};

onMounted(() => {
  if (!keyword.value) {
    router.push({ name: 'Home' });
    return;
  }
  query.value = keyword.value as string;
  querySearch(query.value);
});

onUnmounted(() => {
  abortCtrl?.abort();
});

async function querySearch(val: string | null, reload?: boolean) {
  if (!val) return;
  clear();
  replaceQueryParam('q', val);
  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
  }

  const language = appStore.language === 'en' ? 'all' : 'zh';
  const ctrl = new AbortController();
  abortCtrl = ctrl;
  try {
    loading.value = true;
    const { model, engine, mode, category } = appStore;
    const provider = model?.split('::')[0];
    const modelName = model?.split('::')[1];
    await search(val, {
      model: modelName,
      provider,
      engine,
      mode,
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
  question.value = '';
}

function scrollToBottom() {
  document.body.scrollTop = document.body.scrollHeight;
}

function scrollToTop() {
  document.body.scrollTop = 0;
}

function replaceQueryParam(name: string, val: string) {
  const url = new URL(location.href);
  url.searchParams.set(name, val);
  history.replaceState({}, '', url.toString());
}
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
};
</script>
