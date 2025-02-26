<script setup lang="ts">
import { RiLinksLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface IProps {
  sources: string[];
}

defineOptions({
  name: 'ResearchSource',
});

withDefaults(defineProps<IProps>(), {
  sources: () => [],
});
</script>

<template>
  <div class="box-border flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
    <div class="flex flex-row items-center gap-2 leading-8">
      <span class="shrink-0 grow-0"><RiLinksLine size="12px" /></span>
      <span class="text-base font-bold">{{ t('sources') }}</span>
    </div>
    <div class="flex flex-col gap-0.5">
      <div v-for="(source, index) in sources" :key="index" class="flex flex-row items-center gap-2">
        <span class="shrink-0 grow-0 text-zinc-500"><RiLinksLine size="12px" /></span>
        <a :href="source" target="_blank" class="truncate text-sm text-zinc-400 hover:text-zinc-800">{{ source }}</a>
      </div>
    </div>
  </div>
</template>
