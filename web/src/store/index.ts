import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const engine = ref('');
  const model = ref('');

  const updateModel = (val: string) => {
    model.value = val;
  };

  const updateEngine = (val: string) => {
    engine.value = val;
  };

  return {
    engine,
    model,
    updateModel,
    updateEngine
  };
}, {
  persist: true
});
