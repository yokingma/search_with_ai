<script setup lang="ts">
import { ISearchProgress } from '@/types';
import SearchProgress from './search.vue';
import { RiSearchLine, RiTimer2Line } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ResearchProgress',
});

interface IProps {
  sources?: string[];
  time?: number;
  progress?: string;
  searchProgress?: ISearchProgress | null;
  loading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  sources: () => [],
  time: 0,
  progress: '',
  loading: false,
  searchProgress: null
});

const { t } = useI18n();
</script>

<template>
  <div class="box-border flex size-full flex-col gap-2 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800 dark:text-zinc-100">
    <div class="box-border flex flex-row justify-between gap-2">
      <div class="flex flex-row items-center gap-2">
        <t-loading v-if="loading" size="small" />
        <div class="flex items-center gap-2">
          <RiSearchLine size="12px" />
          <span class="text-base font-bold">{{ t('deepResearch') }}</span>
        </div>
        <div v-if="sources.length > 0" class="text-xs text-zinc-500">{{ sources.length }} {{ t('sources') }}</div>
        <div v-if="time > 0" class="flex items-center gap-1 text-sm text-zinc-500">
          <t-tag theme="default" size="small" shape="round">
            <template #icon>
              <RiTimer2Line size="12px" />
            </template>
            <span class="ml-1">{{ time }}s</span>
          </t-tag>
        </div>
      </div>
      <div class="flex flex-row items-center gap-2">
        <span v-if="progress" class="text-sm text-zinc-500">{{ t(`progress.${progress}`) }}</span>
      </div>
    </div>
    <div v-if="searchProgress" class="mt-2 flex flex-col gap-4">
      <SearchProgress :loading="loading" :search-progress="searchProgress" />
    </div>
  </div>
</template>
