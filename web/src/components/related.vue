<script lang="ts">
export default {
  name: 'RelatedQuery'
}
</script>

<script setup lang="ts">
type Emits = {
  (e: 'select', query: string): void
}
defineProps<{ related?: string[] }>()
const emits = defineEmits<Emits>()
const onSelect = (query: string) => {
  emits('select', query)
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!related"></t-skeleton>
    <div
      v-for="(item, index) in related"
      :key="index"
      class="rounded-md bg-gray-100 p-2 text-sm cursor-pointer hover:bg-gray-200 transition-all"
      @click="onSelect(item)"
    >
      {{ item }}
    </div>
  </div>
</template>