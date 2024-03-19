<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from '../store';

const appStore = useAppStore();

const model = ref('');
onMounted(() => {
  const cached = appStore.model;
  model.value = cached || '';
});
</script>

<script lang="ts">
export default {
  name: 'PageFooter',
};
</script>

<template>
  <div class="flex w-full flex-col items-center gap-2">
    <div class="text-center text-xs text-gray-400">
      搜索生成的内容由AI大模型和搜索引擎生成，内容不代表我们的态度或观点，仅供研究学习用途。
    </div>
    <div class="mt-2 flex items-center gap-2 text-xs text-black">
      <div>当前LLM: <t-tag size="small">{{ appStore.model || '暂未选择' }}</t-tag></div>
      <div>当前搜索: <t-tag size="small">{{ appStore.engine || '暂未选择' }}</t-tag></div>
    </div>
  </div>
</template>
