<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getModels } from '../api';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';

const appStore = useAppStore();
const model = ref(appStore.model);
const models = ref<string[]>([]);
const loading = ref(false);

const { t } = useI18n();

const onModelSelect = (val: any) => {
  appStore.updateModel(val);
};

onMounted(async () => {
  await listModels();
  if (appStore.model) {
    model.value = appStore.model;
  } else {
    model.value = models.value[0];
  }
  appStore.updateModel(model.value);
});

async function listModels () {
  loading.value = true;
  const res = await getModels();
  const keys = Object.keys(res);
  const values: string[] = [];
  keys.forEach((key) => {
    const vals = res[key] as string[];
    values.push(...vals.map(i => `${key}::${i}`));
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
  <t-select v-model="model" :loading="loading" :label="t('llm')" :placeholder="t('selectModel')" @change="onModelSelect">
    <t-option v-for="(item, index) in models" :key="index" :value="item" :label="item"></t-option>
  </t-select>
</template>
