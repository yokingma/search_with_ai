<script lang="ts">
export default {
  name: 'RelatedQuery'
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

type Emits = {
  (e: 'select', query: string): void
}
const props = defineProps<{ related?: string }>()
const emits = defineEmits<Emits>()
const onSelect = (query: string) => {
  emits('select', query.replace(/^[0-9]\./, ''))
}
const relatedArr = computed(() => {
  return props.related?.split('\n')
})
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!relatedArr?.length"></t-skeleton>
    <template v-if="relatedArr">
      <div
        v-for="(item, index) in relatedArr"
        :key="index"
        class="cursor-pointer rounded-md bg-gray-100 p-2 text-sm transition-all hover:bg-gray-200"
        @click="onSelect(item)"
      >
        {{ item }}
      </div>
    </template>
  </div>
</template>