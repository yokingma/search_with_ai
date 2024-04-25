<script setup lang="ts">
import { RiSettingsLine, RiGithubLine } from '@remixicon/vue';

type Emit = {
  (e: 'show'): void;
}

const emits = defineEmits<Emit>();


</script>

<script lang="ts">
export default {
  name: 'ToolBar'
};
</script>

<template>
  <div class="fixed bottom-1/3 right-4 z-50 flex flex-col items-center justify-center gap-4">
    <div class="flex w-9 justify-center gap-2 rounded-xl bg-gray-200 p-1 shadow-lg dark:bg-gray-600">
      <t-button href="https://github.com/yokingma/search_with_ai" target="_blank" shape="circle" theme="default">
        <template #icon> <RiGithubLine /></template>
      </t-button>
    </div>
    <div class="flex w-9 justify-center gap-2 rounded-xl bg-gray-200 p-1 shadow-lg dark:bg-gray-600">
      <t-button shape="circle" theme="default" @click="emits('show')">
        <template #icon> <RiSettingsLine /></template>
      </t-button>
    </div>
  </div>
</template>
