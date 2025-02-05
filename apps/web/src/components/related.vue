<script lang="ts">
export default {
  name: 'RelatedQuery'
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface IProps {
  related?: string
  loading?: boolean
}

type Emits = {
  (e: 'select', query: string): void
}

const { t } = useI18n();

const props = defineProps<IProps>();
const emits = defineEmits<Emits>();
const onSelect = (query: string) => {
  const pretty = query.trim().replace(/^([0-9]|\*|-)(\.|\s)/, '').trim();
  emits('select', pretty);
};
const relatedArr = computed(() => {
  const list = props.related?.split('\n');
  return list ? list.filter((item) => !!item.trim()) : [];
});
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <t-skeleton animation="flashed" :row-col="[3]" :loading="loading && !relatedArr.length"></t-skeleton>
    <template v-if="relatedArr?.length">
      <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div
          v-for="(item, index) in relatedArr"
          :key="index"
          class="cursor-pointer rounded-md border border-solid border-gray-200 bg-gray-100 p-2 transition-all hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
          @click="onSelect(item)"
        >
          <span class="text-sm text-zinc-600 dark:text-zinc-400">{{ item }}</span>
        </div>
      </div>
    </template>
    <t-alert v-if="!relatedArr?.length && !loading" theme="info" :message="t('message.noRelated')" />
  </div>
</template>