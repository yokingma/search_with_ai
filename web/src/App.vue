<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { RiSettingsLine, RiSunLine, RiMoonLine } from '@remixicon/vue';
import { ModelSelect, SearchEngineSelect } from './components/index';
import { useAppStore } from './store';
import { type SwitchValue } from 'tdesign-vue-next';

const appStore = useAppStore();

const showSettings = ref(false);

const onChangeTheme = (val: SwitchValue) => {
  if (val) appStore.updateTheme('dark');
  else appStore.updateTheme('light');
};

onMounted(() => {
  if (appStore.theme) appStore.updateTheme(appStore.theme);
  else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('theme-mode', 'dark');
      appStore.updateTheme('dark');
    } else {
      document.documentElement.removeAttribute('theme-mode');
      appStore.updateTheme('light');
    }
  }
});
</script>

<template>
  <div class="size-full sm:w-full md:w-full lg:max-w-4xl dark:bg-black">
    <div class="fixed bottom-1/3 right-4 z-50 flex flex-col items-center justify-center">
      <div class="flex w-9 justify-center gap-2 rounded-xl bg-gray-200 p-1 shadow-lg">
        <t-button shape="circle" theme="default" @click="showSettings = true">
          <template #icon> <RiSettingsLine /></template>
        </t-button>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <t-drawer v-model:visible="showSettings" :footer="false" header="设置">
      <div class="flex h-full flex-col justify-between gap-4">
        <div class="w-full">
          <div class="flex w-full flex-col gap-2">
            <div class="">选择大模型</div>
            <ModelSelect />
          </div>
          <div class="flex w-full flex-col gap-2">
            <div class="">选择搜索引擎</div>
            <SearchEngineSelect />
          </div>
        </div>
        <div class="flex flex-row gap-2">
          <span>主题: </span>
          <t-switch class="w-12" size="large" :default-value="appStore.theme === 'dark'" @change="onChangeTheme">
            <template #label="slotProps">
              <template v-if="slotProps.value">
                <RiMoonLine size="14" />
              </template>
              <template v-else>
                <RiSunLine size="14" />
              </template>
            </template>
          </t-switch>
        </div>
      </div>
    </t-drawer>
    <router-view />
  </div>
</template>
