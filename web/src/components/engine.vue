<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ISelectOptions } from '../interface';
import { useAppStore } from '../store';
const appStore = useAppStore();

const engines = ref<ISelectOptions[]>([]);
const engine = ref('SOGOU');

const onSelect = (val: any) => {
  appStore.updateEngine(val);
};

onMounted(() => {
  engines.value = [
    {
      name: '搜狗',
      value: 'SOGOU'
    },
    {
      name: 'Bing',
      value: 'BING'
    }
  ];
});
</script>

<script lang="ts">
export default {
  name: 'SearchEngineSelect'
};
</script>

<template>
  <t-select  v-model="engine" label="搜索:" placeholder="请选择搜索引擎" @change="onSelect">
    <t-option v-for="item in engines" :key="item.value" :value="item.value" :label="item.name"></t-option>
  </t-select>
</template>
