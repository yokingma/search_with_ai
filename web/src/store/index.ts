import { defineStore } from 'pinia';
import { TSearCategory, TSearchEngine, TSearchMode } from 'src/interface';
import { ref } from 'vue';

type Theme = 'dark' | 'light'
type Lan = 'zh' | 'en'
export const useAppStore = defineStore('app', () => {
  const engine = ref<TSearchEngine>('SEARXNG');
  const model = ref('');
  const localModel = ref('');
  const enableLocal = ref(false);
  const theme = ref<Theme>();
  const language = ref<Lan>();
  // searxng categories
  const category = ref<TSearCategory>('general');
  // search mode
  const mode = ref<TSearchMode>('simple');

  const updateModel = (val: string) => {
    model.value = val;
  };

  const updateLocalModel = (val: string) => {
    localModel.value = val;
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

  const switchLocalModel = (val: boolean) => {
    enableLocal.value = val;
  };

  const updateCategory = (val: TSearCategory) => {
    category.value = val;
  }

  const updateMode = (val: TSearchMode) => {
    mode.value = val;
  }

  return {
    engine,
    model,
    localModel,
    enableLocal,
    theme,
    language,
    category,
    mode,
    updateModel,
    updateLocalModel,
    switchLocalModel,
    updateEngine,
    updateTheme,
    updateLanguage,
    updateCategory,
    updateMode
  };
}, {
  persist: true
});
