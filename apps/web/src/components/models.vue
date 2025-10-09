<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getModels } from '../api';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';
import { RiAiGenerate2 } from '@remixicon/vue';
import { IModelItem } from '@/types';

defineOptions({
  name: 'ModelSelector'
});

const appStore = useAppStore();
const selectedModel = ref(appStore.model?.name || '');
const models = ref<IModelItem[]>([]);
const loading = ref(false);

const { t } = useI18n();

const onModelSelect = (val: string) => {
  appStore.updateModel(models.value.find(item => item.name === val));
};

onMounted(async () => {
  await listModels();
  if (appStore.model) {
    selectedModel.value = appStore.model.name;
  } else {
    selectedModel.value = models.value[0]?.name || '';
  }
  appStore.updateModel(models.value.find(item => item.name === selectedModel.value));
});

async function listModels () {
  loading.value = true;
  const res = await getModels();
  const list: IModelItem[] = res?.map((item: Record<string, any>) => {
    const { provider, type, models = [] } = item;
    return models.map((model: Record<string, any>) => ({
      name: model.name,
      alias: model.alias,
      provider,
      type
    }));
  }) || []; 

  models.value = list.flat();
  loading.value = false;
}
</script>

<template>
  <div class="model-select">
    <t-select
      v-model="selectedModel"
      :borderless="true"
      :auto-width="true"
      :loading="loading"
      :placeholder="t('selectModel')"
      @change="onModelSelect"
    >
      <template #prefixIcon>
        <RiAiGenerate2 size="16px" />
      </template>
      <t-option v-for="(item, index) in models" :key="index" :value="item.name" :label="item.alias || item.name">
        <div class="flex items-center gap-1">
          <span>{{ item.alias || item.name }}</span>
          <t-tag size="small" shape="mark">{{ item.provider }}</t-tag>
        </div>
      </t-option>
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
