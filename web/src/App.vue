<script lang="ts" setup>
import { ref } from 'vue';
import { RiSettingsLine } from '@remixicon/vue';
import { ModelSelect, SearchEngineSelect } from './components/index';
const showSettings = ref(false);
</script>

<template>
  <div class="size-full bg-white sm:w-full md:w-full lg:max-w-4xl">
    <div class="fixed bottom-1/2 right-4 z-50 flex flex-col items-center justify-center">
      <div class="flex w-9 justify-center gap-2 rounded-xl bg-gray-200 p-1 shadow-lg">
        <t-button shape="circle" theme="default" @click="showSettings = true">
          <template #icon> <RiSettingsLine /></template>
        </t-button>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <t-drawer v-model:visible="showSettings" :footer="false" header="设置">
      <div class="flex flex-col gap-4">
        <div class="flex w-full flex-col gap-2">
          <div class="">选择大模型</div>
          <ModelSelect />
        </div>
        <div class="flex w-full flex-col gap-2">
          <div class="">选择搜索引擎</div>
          <SearchEngineSelect />
        </div>
      </div>
    </t-drawer>
    <router-view />
  </div>
</template>
