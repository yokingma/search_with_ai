<script setup lang="ts">
import { EGraphEvent } from '@/types';
import { RiCircleLine } from '@remixicon/vue';
interface IProps {
  event: EGraphEvent
  title: string
  data: string | Record<string, any>
}

defineProps<IProps>();
</script>

<template>
  <div class="flex flex-col gap-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
    <div class="flex flex-nowrap items-center gap-2 border-b border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-900">
      <RiCircleLine size="14px" class="text-green-600" />
      <span class="font-extrabold">{{ title }}</span>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>