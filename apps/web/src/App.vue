<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAppStore } from './store';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const appStore = useAppStore();


function followSystemLanguage() {
  const lan = window.navigator.language;
  if (!appStore.language) {
    if (lan.includes('zh')) appStore.updateLanguage('zh');
    else if (lan.includes('ptBR')) appStore.updateLanguage('ptBR');
    else appStore.updateLanguage('en');
  }
  locale.value = appStore.language ?? 'en';
}

onMounted(() => {
  followSystemLanguage();
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
    <router-view />
  </div>
</template>
