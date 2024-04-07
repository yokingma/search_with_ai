<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getLocalModels } from '../api';
import { useAppStore } from '../store';

const appStore = useAppStore();
const model = ref(appStore.localModel);
const models = ref<string[]>([]);
const loading = ref(false);

const onModelSelect = (val: any) => {
  appStore.updateLocalModel(val);
};

onMounted(async () => {
  await listModels();
  if (appStore.localModel) {
    model.value = appStore.localModel;
  }
});

async function listModels () {
  loading.value = true;
  const res = await getLocalModels();
  const values: string[] = [];
  res.models.forEach((model: any) => {
    // const key = model.details.family; 
    values.push(`${model.name}`);
  });

  models.value = values;
  loading.value = false;
}
</script>

<script lang="ts">
export default {
  name: 'LocalModelSelect'
};
</script>

<template>
  <t-select v-model="model" :disabled="!appStore.enableLocal" :loading="loading" label="模型：" placeholder="请选择大语言模型" @change="onModelSelect">
    <t-option v-for="(item, index) in models" :key="index" :value="item" :label="item"></t-option>
  </t-select>
</template>
