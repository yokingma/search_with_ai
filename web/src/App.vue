<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from './store';
import { useI18n } from 'vue-i18n';
import { AppSettings, ToolBar } from './components';

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
  <div class="size-full w-full dark:bg-black">
    <ToolBar @show="showSettings = true" />
    <AppSettings v-model="showSettings" />
    <router-view />
  </div>
</template>
