<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ISelectOptions } from '../types';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';
import { RiFlashlightLine } from '@remixicon/vue';
import { getEngines } from '@/api';

const loading = ref(false);
const appStore = useAppStore();

const engines = ref<ISelectOptions[]>([]);
const engine = ref(appStore.engine);
const { t } = useI18n();
const onSelect = (val: any) => {
  appStore.updateEngine(val);
};

async function loadEngines() {
  try {
    loading.value = true;
    // Fetch engine list from API
    const res = await getEngines();
    engines.value = res.list?.map((item: Record<string, any>) => ({
      value: item.code,
      name: item.name,
    }));
  } catch (error) {
    console.error('Failed to load engines:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadEngines();
});
</script>

<script lang="ts">
export default {
  name: 'SearchEngineSelect'
};
</script>

<template>
  <t-select
    v-model="engine"
    :borderless="true"
    :auto-width="true"
    ::loading="loading"
    :placeholder="t('selectEngine')"
    @change="onSelect"
  >
    <template #prefixIcon>
      <RiFlashlightLine size="16px" />
    </template>
    <t-option v-for="item in engines" :key="item.value" :value="item.value" :label="item.name"></t-option>
  </t-select>
</template>
