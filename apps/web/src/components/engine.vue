<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ISelectOptions } from '../interface';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';
import { RiFlashlightLine } from '@remixicon/vue';
const appStore = useAppStore();

const engines = ref<ISelectOptions[]>([]);
const engine = ref(appStore.engine);
const { t } = useI18n();
const onSelect = (val: any) => {
  appStore.updateEngine(val);
};

onMounted(() => {
  engines.value = [
    {
      name: t('searxng'),
      value: 'SEARXNG'
    },
    {
      name: 'Tavily',
      value: 'TAVILY'
    },
    {
      name: t('chatglm'),
      value: 'CHATGLM'
    },
    {
      name: t('google'),
      value: 'GOOGLE'
    },
    {
      name: t('bing'),
      value: 'BING'
    },
    {
      name: t('sogou'),
      value: 'SOGOU'
    },
  ];
});
</script>

<script lang="ts">
export default {
  name: 'SearchEngineSelect'
};
</script>

<template>
  <t-select v-model="engine" :borderless="true" :auto-width="true" :placeholder="t('selectEngine')" @change="onSelect">
    <template #prefixIcon>
      <RiFlashlightLine size="16px" />
    </template>
    <t-option v-for="item in engines" :key="item.value" :value="item.value" :label="item.name"></t-option>
  </t-select>
</template>
