<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getModels } from '../api';
import { useAppStore } from '../store';

const appStore = useAppStore();
const model = ref(appStore.model);
const models = ref<string[]>([]);
const loading = ref(false);

const onModelSelect = (val: any) => {
  appStore.updateModel(val);
};

onMounted(async () => {
  await listModels();
  if (appStore.model) {
    model.value = appStore.model;
  }
});

async function listModels () {
  loading.value = true;
  const res = await getModels();
  const keys = Object.keys(res);
  const values: string[] = [];
  keys.forEach((key) => {
    const vals = res[key] as string[];
    values.push(...vals.map(i => `${key}:${i}`));
  });

  models.value = values;
  loading.value = false;
}
</script>

<script lang="ts">
export default {
  name: 'ModelSelect'
};
</script>

<template>
  <t-select v-model="model" :loading="loading" label="模型：" placeholder="请选择大语言模型" @change="onModelSelect">
    <t-option v-for="(item, index) in models" :key="index" :value="item" :label="item"></t-option>
  </t-select>
</template>
