<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { getLocalModels } from '../api';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';
import { MessagePlugin } from 'tdesign-vue-next';

const appStore = useAppStore();
const model = ref(appStore.localModel);
const models = ref<string[]>([]);
const loading = ref(false);

const { t } = useI18n();

const onModelSelect = (val: any) => {
  appStore.updateLocalModel(val);
};

watch(() => appStore.localProvider, async (val) => {
  if (val) {
    await listModels();
  }
});

onMounted(async () => {
  if (appStore.enableLocal && appStore.localProvider) await listModels();

  if (appStore.localModel) {
    model.value = appStore.localModel;
  } else {
    model.value = models.value[0];
    appStore.updateLocalModel(model.value);
  }
});

async function listModels() {
  try {
    loading.value = true;
    const res = await getLocalModels(appStore.localProvider);
    const values: string[] = [];
    if (!res.models) {
      MessagePlugin.error(JSON.stringify(res.cause));
      return;
    }
    res.models?.forEach((model: any) => {
      values.push(`${model.name}`);
    });
    models.value = values;
  } catch (error: any) {
    MessagePlugin.error('Failed to get local models');
    console.error(error);
  }
  loading.value = false;
}
</script>

<script lang="ts">
export default {
  name: 'LocalModelSelect'
};
</script>

<template>
  <t-select v-model="model" :disabled="!appStore.enableLocal" :loading="loading" :label="t('llm')"
    :placeholder="t('selectModel')" @change="onModelSelect">
    <t-option v-for="(item, index) in models" :key="index" :value="item" :label="item"></t-option>
  </t-select>
</template>
