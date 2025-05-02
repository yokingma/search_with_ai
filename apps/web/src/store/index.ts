// store.ts 或定义 useAppStore 的文件
import { defineStore } from 'pinia';
import { TSearCategory, TSearchEngine, TSearchMode } from 'src/interface';
import { ref } from 'vue';

type Theme = 'dark' | 'light';
type Lan = 'zh' | 'en' | 'ptBR' | 'ja' | 'zh-TW'; // 添加 'ja' 和 'zh-TW'
export const useAppStore = defineStore('app', () => {
  const engine = ref<TSearchEngine>('SEARXNG');
  const model = ref('');
  const provider = ref<string>('');
  const theme = ref<Theme>();
  const language = ref<Lan>();
  // searxng categories
  const category = ref<TSearCategory>('general');
  // search mode
  const mode = ref<TSearchMode>('simple');

  const updateModel = (val: string) => {
    model.value = val;
  };

  const updateProvider = (val: string) => {
    provider.value = val;
  };

  const updateEngine = (val: TSearchEngine) => {
    engine.value = val;
  };

  const updateTheme = (val: Theme) => {
    document.documentElement.setAttribute('theme-mode', val);
    theme.value = val;
  };

  const updateLanguage = (val: Lan) => {
    language.value = val;
  };

  const updateCategory = (val: TSearCategory) => {
    category.value = val;
  };

  const updateMode = (val: TSearchMode) => {
    mode.value = val;
  };

  return {
    engine,
    model,
    theme,
    language,
    category,
    mode,
    provider,
    updateModel,
    updateEngine,
    updateTheme,
    updateLanguage,
    updateCategory,
    updateMode,
    updateProvider
  };
}, {
  persist: true
});
