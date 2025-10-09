<script setup lang="ts">
import { ISearchProgress } from '@/types';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface IProps {
  searchProgress?: ISearchProgress;
  loading?: boolean;
}

const researchGoals = ref<string[]>([]);

defineOptions({
  name: 'SearchProgress'
});

const props = defineProps<IProps>();

watch(() => props.searchProgress, (newVal) => {
  if (newVal) {
    const { researchGoal, query } = newVal.target;
    const researchGoalText = `${t('researchGoal')}: ${researchGoal} ${t('webSearch')}: ${query}`;
    researchGoals.value = [...new Set([...researchGoals.value, researchGoalText])];
  }
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <span v-for="(item, index) in researchGoals" :key="index" class="text-xs text-zinc-500">{{ item }}</span>
    </div>
  </div>
</template>