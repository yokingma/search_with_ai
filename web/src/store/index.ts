import { defineStore } from 'pinia';
import { ref } from 'vue';

type Theme = 'dark' | 'light'
export const useAppStore = defineStore('app', () => {
  const engine = ref('');
  const model = ref('');
  const theme = ref<Theme>();

  const updateModel = (val: string) => {
    model.value = val;
  };

  const updateEngine = (val: string) => {
    engine.value = val;
  };

  const updateTheme = (val: Theme) => {
    document.documentElement.setAttribute('theme-mode', val);
    theme.value = val;
  };

  return {
    engine,
    model,
    theme,
    updateModel,
    updateEngine,
    updateTheme
  };
}, {
  persist: true
});
