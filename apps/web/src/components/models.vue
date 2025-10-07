<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getModels } from '../api';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';
import { RiAiGenerate2 } from '@remixicon/vue';

defineOptions({
  name: 'ModelSelect'
});

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

<template>
  <div class="model-select">
    <t-select v-model="model" :borderless="true" :auto-width="true" :loading="loading" :placeholder="t('selectModel')" @change="onModelSelect">
      <template #prefixIcon>
        <RiAiGenerate2 size="16px" />
      </template>
      <t-option v-for="(item, index) in models" :key="index" :value="item" :label="item"></t-option>
    </t-select>
  </div>
</template>

<style lang="less">
.model-select {
  display: flex;
  align-items: center;
  .t-select .t-input {
    border-radius: 32px;
  }
}
</style>
