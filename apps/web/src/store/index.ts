import { defineStore } from 'pinia';
import { TSearCategory, TSearchEngine } from '@/types';
import { ref } from 'vue';
import { Theme, Lan, IModelItem } from '@/types';

export const useAppStore = defineStore('app', () => {
  const engine = ref<TSearchEngine>('SEARXNG');
  const model = ref<IModelItem>();
  const theme = ref<Theme>();
  const language = ref<Lan>();
  const enabledDeepResearch = ref<boolean>(false);
  // searxng categories
  const category = ref<TSearCategory>('general');
  // llm
  const systemPrompt = ref<string>('You are a helpful assistant that helps the user to search the web effectively.');
  const temperature = ref(0.6);

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

  const updateSystemPrompt = (val: string) => {
    systemPrompt.value = val;
  };

  const updateTemperature = (val: number) => {
    temperature.value = val;
  };

  const updateEnabledDeepResearch = (val: boolean) => {
    enabledDeepResearch.value = val;
  };

  return {
    engine,
    model,
    theme,
    language,
    category,
    systemPrompt,
    temperature,
    enabledDeepResearch,
    updateEnabledDeepResearch,
    updateModel,
    updateEngine,
    updateTheme,
    updateLanguage,
    updateCategory,
    updateSystemPrompt,
    updateTemperature,
  };
}, {
  persist: true
});
