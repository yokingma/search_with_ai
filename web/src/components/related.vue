<script lang="ts">
export default {
  name: 'RelatedQuery'
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

type Emits = {
  (e: 'select', query: string): void
}
const props = defineProps<{ related?: string }>();
const emits = defineEmits<Emits>();
const onSelect = (query: string) => {
  emits('select', query.replace(/^[0-9]\./, '').trim());
};
const relatedArr = computed(() => {
  return props.related?.split('\n');
});
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!props.related"></t-skeleton>
    <template v-if="relatedArr?.length">
      <div
        v-for="(item, index) in relatedArr"
        :key="index"
        class="cursor-pointer rounded-md bg-gray-100 p-2 text-sm transition-all hover:opacity-80 dark:bg-zinc-900 dark:text-zinc-400"
        @click="onSelect(item)"
      >
        {{ item }}
      </div>
    </template>
  </div>
</template>