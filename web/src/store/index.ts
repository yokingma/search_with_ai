import { defineStore } from 'pinia';
import { ref } from 'vue';

type Theme = 'dark' | 'light'
export const useAppStore = defineStore('app', () => {
  const engine = ref('');
  const model = ref('');
  const localModel = ref('');
  const enableLocal = ref(false);
  const theme = ref<Theme>();

  const updateModel = (val: string) => {
    model.value = val;
  };

  const updateLocalModel = (val: string) => {
    localModel.value = val;
  };

  const updateEngine = (val: string) => {
    engine.value = val;
  };

  const updateTheme = (val: Theme) => {
    document.documentElement.setAttribute('theme-mode', val);
    theme.value = val;
  };

  const switchLocalModel = (val: boolean) => {
    enableLocal.value = val;
  };

  return {
    engine,
    model,
    localModel,
    enableLocal,
    theme,
    updateModel,
    updateLocalModel,
    switchLocalModel,
    updateEngine,
    updateTheme
  };
}, {
  persist: true
});
