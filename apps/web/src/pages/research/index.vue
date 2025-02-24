<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RiArrowGoBackLine } from '@remixicon/vue';
import ResearchReport from './components/report.vue';
import SearchInputBar from '@/components/searchInputBar.vue';
import ResearchProgress from './components/progress.vue';
import { deepResearch } from '@/api';
import { useAppStore } from '@/store';
import { MessagePlugin } from 'tdesign-vue-next';

defineOptions({
  name: 'DeepResearch'
});

const { t } = useI18n();

const appStore = useAppStore();

const query = ref('');
const loading = ref(false);

let abortCtrl: AbortController | null = null;

const onSearch = () => {
  querySearch(query.value);
};

const onBackHome = () => {
  console.log('back home');
};

// research report
const report = ref('');
const sources = ref<string[]>([]);
const time = ref(0);

async function querySearch(val: string | null) {
  if (!val) return;

  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
  }

  const ctrl = new AbortController();
  abortCtrl = ctrl;
  try {
    loading.value = true;
    const { model, engine } = appStore;
    const provider = model?.split('::')[0];
    const modelName = model?.split('::')[1];
    await deepResearch({
      query: val,
      provider,
      model: modelName,
      searchEngine: engine,
      depth: 2,
      breadth: 2,
      reportModel: 'deepseek-r1-distill-qwen-32b',
      ctrl,
      onProgress: (data: Record<string, any>) => {
        if (data?.report) {
          report.value += data.report;
        }
        if (data?.researchProgress) {
          sources.value = data.researchProgress.visitedUrls;
        }
        if (data?.time) {
          time.value = data.time;
        }
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
</script>

<template>
  <div class="flex size-full flex-col justify-between">
    <div class="flex w-full shrink-0 grow-0 items-center justify-center border-0 border-b border-solid border-zinc-100 py-2 dark:border-zinc-800">
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
    <div class="flex size-full items-center justify-center">
      <div class="size-full lg:max-w-2xl xl:max-w-4xl">
        <div class="box-border flex flex-col gap-4 p-4">
          <div class="flex flex-col gap-4">
            <ResearchProgress :sources="sources" :time="time" />
          </div>
          <div class="mt-4 flex flex-col gap-4">
            <ResearchReport :report="report" t />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>