<script lang="ts">
export default {
  name: 'ChatSources'
};
</script>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface IProps {
  sources?: Record<string, any>[]
  loading: boolean
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
const { t } = useI18n();
</script>

<template>
  <div class="w-full">
    <t-skeleton :row-col="rowCol" animation="flashed" :loading="!sources?.length && loading"></t-skeleton>
    <div v-if="sources?.length === 0 && !loading" class="">
      <t-alert theme="info" :message="t('message.sourceError')" close>
        <template #operation>
        </template>
      </t-alert>
    </div>
    <div class="mt-4 grid grid-cols-1 gap-2 text-xs text-gray-500 md:grid-cols-2">
      <div 
        v-for="item in sources"
        :key="item.id"
        class="relative overflow-hidden rounded-md bg-gray-100 p-2 transition-all hover:opacity-80 xl:p-3 dark:bg-zinc-800"
      >
        <t-popup>
          <template #content>
            <div class="flex w-80 flex-col gap-2 p-2">
              <div class="text-lg font-bold leading-7">{{ item.name }}</div>
              <div class="leading-6 text-zinc-400">{{ item.snippet }}</div>
              <a :href="item.url" target="_blank" class="block size-full truncate text-zinc-400">{{ item.url }}</a>
            </div>
          </template>
          <div class="leading-5">
            <a :href="item.url" target="_blank" class="absolute block size-full"></a>
            <div class="truncate break-words text-sm text-black dark:text-gray-400">{{ item.name }}</div>
            <div class="mt-1 flex items-center gap-1">
              <t-tag size="small" theme="default">{{ item.id }}</t-tag>
              <div class="truncate break-words">{{ item.url }}</div>
            </div>
          </div>
        </t-popup>
      </div>
    </div>
  </div>
</template>
