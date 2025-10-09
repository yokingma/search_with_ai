<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RiArrowGoBackLine } from '@remixicon/vue';
import ResearchReport from './components/report.vue';
import ResearchProgress from './components/progress.vue';
import { deepResearch } from '@/api';
import { useAppStore } from '@/store';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import ResearchSource from './components/source.vue';
import { IResearchProgress, EDeepResearchProgress } from '@/types';
import { ROUTE_NAME } from '@/constants';

interface IProps {
  query: string;
}

defineOptions({
  name: ROUTE_NAME.DEEP_RESEARCH
});

const props = defineProps<IProps>();

const router = useRouter();

const { t } = useI18n();

const appStore = useAppStore();

// const query = ref(props.query);
const loading = ref(false);

// research report
const report = ref<IResearchProgress>({
  time: 0,
  sources: [],
  report: '',
});

let abortCtrl: AbortController | null = null;

// const onSearch = () => {
//   query.value = query.value.trim();
//   if (query.value !== props.query) {
//     router.replace({ 
//       name: router.currentRoute.value.name, 
//       params: { ...router.currentRoute.value.params, query: query.value } 
//     });
//   }
//   // clear previous report
//   report.value = {
//     time: 0,
//     progress: EDeepResearchProgress.Start,
//     sources: [],
//     report: '',
//   };
//   querySearch(query.value);
// };

const onBackHome = () => {
  router.push({ name: 'Home' });
};

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
    if (!model) {
      MessagePlugin.warning(t('message.selectModelFirst'));
      return;
    }
    const provider = model.provider;
    const modelName = model.name;
    await deepResearch({
      query: val,
      provider,
      model: modelName,
      searchEngine: engine,
      depth: 2,
      breadth: 2,
      // reportModel: 'deepseek-r1-distill-qwen-32b',
      ctrl,
      onProgress: (data) => {
        if (data?.report) {
          report.value.report += data.report;
        }
        if (data?.progress !== EDeepResearchProgress.Heartbeat) {
          report.value.progress = data.progress;
        }
        if (data?.researchProgress) {
          if (data.researchProgress.searchProgress) {
            report.value.progress = EDeepResearchProgress.Searching;
            report.value.searchProgress = data.researchProgress.searchProgress;
          }
        }
        if (data?.sources) {
          report.value.sources = data.sources;
        }
        if (data?.time) {
          report.value.time = Math.ceil(data.time / 1000);
        }
      }
    });
  } catch(err) {
    ctrl.abort();
    console.error('[DeepResearch Error]', err);
    MessagePlugin.error(t('message.queryError'));
  } finally {
    abortCtrl = null;
    loading.value = false;
  }
}

onMounted(() => {
  if (props.query) {
    querySearch(props.query);
  }
});

onUnmounted(() => {
  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
  }
});
</script>

<template>
  <div class="flex size-full flex-col justify-between">
    <div class="flex w-full shrink-0 grow-0 items-center justify-center border-0 border-b border-solid border-zinc-100 py-2 dark:border-zinc-800">
      <div class="flex w-full flex-row flex-nowrap items-center gap-4 lg:max-w-2xl lg:p-0 xl:max-w-4xl">
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
            <ResearchProgress
              :sources="report.sources"
              :loading="loading"
              :time="report.time"
              :progress="report.progress"
              :search-progress="report.searchProgress"
            />
          </div>
          <div class="mt-4 flex flex-col gap-4">
            <ResearchReport v-if="report.report" :report="report.report" />
          </div>
          <div class="mt-4 flex flex-col gap-4">
            <ResearchSource v-if="report.sources?.length" :sources="report.sources" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>