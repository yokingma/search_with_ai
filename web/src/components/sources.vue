<script lang="ts">
export default {
  name: 'ChatSources'
};
</script>

<script setup lang="ts">
interface IProps {
  sources?: Record<string, any>[]
}
defineProps<IProps>();
const rowCol = [
  [
    { width: '32%', height: '42px', borderRadius: '6px' },
    { width: '32%', height: '42px', borderRadius: '6px' },
    { width: '32%', height: '42px', borderRadius: '6px' },
  ],
  [
    { width: '32%', height: '42px', borderRadius: '6px' },
    { width: '32%', height: '42px', borderRadius: '6px' },
    { width: '32%', height: '42px', borderRadius: '6px' },
  ],
  [
    { width: '32%', height: '42px', borderRadius: '6px' },
    { width: '32%', height: '42px', borderRadius: '6px' },
    { width: '32%', height: '42px', borderRadius: '6px' },
  ]
];
</script>

<template>
  <div class="w-full">
    <t-skeleton :row-col="rowCol" animation="flashed" :loading="!sources?.length"></t-skeleton>
    <div class="mt-4 grid grid-cols-1 gap-2 text-xs text-gray-500 md:grid-cols-3 lg:grid-cols-3">
      <div 
        v-for="(item, index) in sources" 
        :key="index" 
        class="relative overflow-hidden rounded-md bg-gray-100 p-2 leading-5 transition-all hover:bg-gray-200 xl:p-3"
      >
        <a :href="item.url" :title="item.name" target="_blank" class="absolute block size-full"></a>
        <div class="truncate break-words text-black">{{ item.name }}</div>
        <div class="mt-1 flex items-center gap-1">
          <t-tag size="small">{{ index + 1 }}</t-tag>
          <div class="truncate break-words">{{ item.url }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
