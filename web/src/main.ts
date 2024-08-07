import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia';
import * as VueI18n from 'vue-i18n';
import zh from './i18n/zh';
import en from './i18n/en';
import ptBR from './i18n/ptBR';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './style.css';
import 'tdesign-vue-next/es/style/index.css';
import 'github-markdown-css/github-markdown-light.css';
import App from './App.vue';
const app = createApp(App);
const pinia = createPinia();
const i18n = VueI18n.createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    en,
    zh,
    ptBR
  },
});

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');
