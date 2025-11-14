<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface IProps {
  sources?: Record<string, any>[]
}

defineOptions({
  name: 'ChatSources',
});

defineProps<IProps>();
const { t } = useI18n();
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-center">
      <t-alert v-if="sources?.length === 0" theme="info" :message="t('message.sourceError')" />
    </div>
    <div class="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
      <div 
        v-for="item in sources"
        :key="item.id"
        class="relative overflow-hidden rounded-md transition-all hover:opacity-80"
      >
        <t-popup>
          <template #content>
            <div class="flex w-80 flex-col gap-2 p-2">
              <div class="text-lg font-bold leading-7">{{ item.name }}</div>
              <div class="leading-6 text-zinc-400">{{ item.snippet.slice(0, 180) + '...' }}</div>
              <a :href="item.url" target="_blank" class="block size-full truncate text-blue-500 hover:underline">{{ item.url }}</a>
            </div>
          </template>
          <div class="">
            <div class="flex flex-nowrap items-center gap-1">
              <div class="flex h-4 min-w-4 items-center justify-center rounded bg-zinc-200 dark:bg-black">{{ item.id }}</div>
              <a :href="item.url" target="_blank" class="truncate break-words text-xs text-black hover:underline dark:text-gray-400">
                {{ item.name }}
              </a>
            </div>
          </div>
        </t-popup>
      </div>
    </div>
  </div>
</template>
