import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './style.css';
import 'tdesign-vue-next/es/style/index.css';
import 'github-markdown-css/github-markdown-light.css';
import App from './App.vue';
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.mount('#app');
