<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from './store';
import { useI18n } from 'vue-i18n';
import { AppSettings, ToolBar } from './components';

const { locale } = useI18n();
const appStore = useAppStore();

const showSettings = ref(false);

/**
 * 根据系统语言设置应用的初始语言。
 * 如果 appStore 中已经存在语言设置，则使用该设置。
 * 否则，根据浏览器的语言偏好设置默认语言 (ja, zh-TW, zh, ptBR, en)。
 */
function followSystemLanguage(): void {
  const browserLanguage = window.navigator.language;
  if (!appStore.language) {
    if (browserLanguage.includes('ja')) {
      appStore.updateLanguage('ja');
      // console.log('设置默认语言为日语'); // 开发环境调试
    } else if (browserLanguage.includes('zh-TW')) {
      appStore.updateLanguage('zh-TW');
      // console.log('设置默认语言为台湾中文'); // 开发环境调试
    } else if (browserLanguage.includes('zh')) {
      appStore.updateLanguage('zh'); // 简体中文作为备选
      // console.log('设置默认语言为简体中文'); // 开发环境调试
    } else if (browserLanguage.includes('ptBR')) {
      appStore.updateLanguage('ptBR');
      // console.log('设置默认语言为葡萄牙语 (巴西)'); // 开发环境调试
    } else {
      appStore.updateLanguage('en');
      // console.log('设置默认语言为英文'); // 开发环境调试
    }
  }
  locale.value = appStore.language ?? 'en';
}

/**
 * 根据 appStore 中的主题设置或系统偏好设置应用的主题。
 */
function initializeTheme(): void {
  if (appStore.theme) {
    appStore.updateTheme(appStore.theme);
    document.documentElement.setAttribute('theme-mode', appStore.theme);
  } else {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.documentElement.setAttribute('theme-mode', 'dark');
      appStore.updateTheme('dark');
    } else {
      document.documentElement.removeAttribute('theme-mode');
      appStore.updateTheme('light');
    }
  }
}

onMounted(() => {
  followSystemLanguage();
  initializeTheme();
});
</script>

<template>
  <div class="size-full w-full dark:bg-black">
    <ToolBar @show="showSettings = true" />
    <AppSettings v-model="showSettings" />
    <router-view />
  </div>
</template>
