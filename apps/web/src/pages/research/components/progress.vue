<script setup lang="ts">
import { RiSearchLine, RiTimer2Line } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ResearchProgress',
});

interface IProps {
  sources?: string[];
  time?: number;
}

withDefaults(defineProps<IProps>(), {
  sources: () => [],
  time: 0,
});

const { t } = useI18n();

</script>

<template>
  <div class="flex size-full flex-col">
    <div class="box-border flex flex-row justify-between gap-2 rounded-full bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
      <div class="flex flex-row items-center gap-2">
        <RiSearchLine size="12px" />
        <span class="text-sm font-bold">{{ t('deepResearch') }}</span>
      </div>
      <div class="flex flex-row items-center gap-2">
        <t-tag v-if="sources.length > 0" variant="light">{{ sources.length }} 个来源</t-tag>
        <t-tag v-if="time > 0" variant="light" size="small" shape="round">
          <template #icon>
            <RiTimer2Line size="12px" />
          </template>
          <span class="ml-1 text-zinc-600">{{ time }} s</span>
        </t-tag>
      </div>
    </div>
  </div>
</template>
