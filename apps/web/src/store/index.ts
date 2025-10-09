import { defineStore } from 'pinia';
import { TSearCategory, TSearchEngine } from '@/types';
import { ref } from 'vue';
import { Theme, Lan, IModelItem } from '@/types';

export const useAppStore = defineStore('app', () => {
  const engine = ref<TSearchEngine>('SEARXNG');
  const model = ref<IModelItem>();
  const theme = ref<Theme>();
  const language = ref<Lan>();
  // searxng categories
  const category = ref<TSearCategory>('general');

  const updateModel = (item?: IModelItem) => {
    model.value = item;
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


  return {
    engine,
    model,
    theme,
    language,
    category,
    updateModel,
    updateEngine,
    updateTheme,
    updateLanguage,
    updateCategory,
  };
}, {
  persist: true
});
