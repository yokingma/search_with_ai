<script lang="ts" setup>
import { ref } from 'vue'
import { RiSettingsLine } from '@remixicon/vue'
import { ModelSelect } from './components/index'
const showSettings = ref(false)
</script>

<template>
  <div class="size-full sm:w-full md:w-full lg:max-w-3xl">
    <div class="fixed right-4 top-4 flex flex-col items-center justify-center">
      <t-button shape="circle" theme="default" @click="showSettings = true">
        <template #icon> <RiSettingsLine /></template>
      </t-button>
    </div>
    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <t-drawer v-model:visible="showSettings" header="设置" :close-btn="true" @confirm="showSettings = false">
      <div class="flex w-full flex-col gap-2">
        <div class="">选择大模型</div>
        <ModelSelect />
      </div>
    </t-drawer>
    <router-view />
  </div>
</template>
