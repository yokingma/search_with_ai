import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia';
import i18n from './i18n';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import './style.less';
import 'tdesign-vue-next/es/style/index.css';
import 'github-markdown-css/github-markdown-light.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#app');
