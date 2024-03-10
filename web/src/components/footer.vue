<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const model = ref('')
onMounted(() => {
  const cached = localStorage?.getItem('model')
  model.value = cached || ''
});
</script>

<script lang="ts">
export default {
  name: 'PageFooter',
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-2">
    <div class="text-center text-xs text-gray-400">
      搜索生成的内容由AI大模型和搜索引擎生成，内容不代表我们的态度或观点，仅供研究学习用途。
    </div>
    <div class="text-xs text-gray-400">
      当前选择大模型: {{ model }}
    </div>
  </div>
</template>
