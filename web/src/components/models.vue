<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getModels } from '../api'


const model = ref('aliyun:qwen-max')
const models = ref<string[]>([])
const loading = ref(false)

const onModelSelect = (val: any) => {
  localStorage?.setItem('model', val)
}

onMounted(async () => {
  await listModels()
  const cachedVal = localStorage?.getItem('model')
  if (cachedVal) {
    model.value = cachedVal
  }
})

async function listModels () {
  loading.value = true
  const res = await getModels()
  const keys = Object.keys(res)
  const values: string[] = []
  keys.forEach((key) => {
    const vals = res[key] as string[]
    values.push(...vals.map(i => `${key}:${i}`))
  })

  models.value = values
  loading.value = false
}
</script>

<script lang="ts">
export default {
  name: 'ModelSelect'
}
</script>

<template>
  <t-select v-model="model" :loading="loading" label="模型：" placeholder="请选择大语言模型" @change="onModelSelect">
    <t-option v-for="(item, index) in models" :key="index" :value="item" :label="item"></t-option>
  </t-select>
</template>
