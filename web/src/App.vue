<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { RiSettingsLine, RiGithubLine } from '@remixicon/vue';
import { useAppStore } from './store';
import { useI18n } from 'vue-i18n';
import { AppSettings } from './components';

const { t, locale } = useI18n();
const appStore = useAppStore();

const showSettings = ref(false);

function followSystemLanguage() {
  const lan = window.navigator.language;
  if (!appStore.language) {
    if (lan.includes('zh')) appStore.updateLanguage('zh');
    else appStore.updateLanguage('en');
  }
  locale.value = appStore.language ?? 'en';
}

onMounted(() => {
  followSystemLanguage();
  document.title = t('title');
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
  <div class="size-full sm:w-full md:max-w-2xl lg:max-w-3xl dark:bg-black">
    <div class="fixed bottom-1/3 right-4 z-50 flex flex-col items-center justify-center gap-4">
      <div class="flex w-9 justify-center gap-2 rounded-xl bg-gray-200 p-1 shadow-lg dark:bg-gray-600">
        <t-button href="https://github.com/yokingma/search_with_ai" target="_blank" shape="circle" theme="default">
          <template #icon> <RiGithubLine /></template>
        </t-button>
      </div>
      <div class="flex w-9 justify-center gap-2 rounded-xl bg-gray-200 p-1 shadow-lg dark:bg-gray-600">
        <t-button shape="circle" theme="default" @click="showSettings = true">
          <template #icon> <RiSettingsLine /></template>
        </t-button>
      </div>
    </div>
    <AppSettings v-model="showSettings" />
    <router-view />
  </div>
</template>
