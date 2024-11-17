import { defineStore } from 'pinia';
import { Provider, TSearCategory, TSearchEngine, TSearchMode } from 'src/interface';
import { ref } from 'vue';

type Theme = 'dark' | 'light'
type Lan = 'zh' | 'en' | 'ptBR';
export const useAppStore = defineStore('app', () => {
  const engine = ref<TSearchEngine>('SEARXNG');
  const model = ref('');
  const localModel = ref('');
  const localProvider = ref<Provider>('ollama');
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

  const updateLocalProvider = (val: Provider) => {
    localProvider.value = val;
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
    localProvider,
    updateModel,
    updateLocalModel,
    switchLocalModel,
    updateEngine,
    updateTheme,
    updateLanguage,
    updateCategory,
    updateMode,
    updateLocalProvider
  };
}, {
  persist: true
});
