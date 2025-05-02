<script lang="ts" setup>
import { ref } from 'vue';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';

const appStore = useAppStore();
const language = ref(appStore.language);
const languageList = [
  {
    name: 'English',
    value: 'en'
  },
  {
    name: '简体中文',
    value: 'zh'
  },
  {
    name: '繁體中文',
    value: 'zhTW'
  },
  {
    name: '日本語',
    value: 'ja'
  },
  {
    name: 'Português BR',
    value: 'ptBR'
  }
];

const { t, locale } = useI18n();

const onLanSelect = (val: any) => {
  appStore.updateLanguage(val);
  locale.value = val;
  document.title = t('title');
};
</script>

<script lang="ts">
export default {
  name: 'LanguageSelect'
};
</script>

<template>
  <t-select v-model="language" :label="t('language')" :placeholder="t('selectLanguage')" @change="onLanSelect">
    <t-option v-for="(item) in languageList" :key="item.value" :value="item.value" :label="item.name"></t-option>
  </t-select>
</template>
