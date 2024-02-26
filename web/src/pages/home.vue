<template>
  <div id="home" class="flex size-full items-center justify-center">
    <div class="flex flex-col gap-4 p-4">
      <div class="flex items-center justify-center gap-2">
        <img :src="logoUrl" class="w-10" />
        <span class="text-3xl font-bold">AI Search</span>
        <t-tag variant="light" class="text-xs text-gray-500">beta</t-tag>
      </div>
      <div class="rounded-3xl bg-gray-100 p-2 transition-all">
        <div class="w-full overflow-hidden rounded-3xl border border-gray-100">
          <t-input v-model="query" clearable :autofocus="true" :maxlength="100" size="large" placeholder="请输入想要问AI的问题" @keyup.enter="search" >
            <template #suffix>
              <t-button shape="round" variant="base" @click="search">
                <template #icon><RiArrowRightLine /></template>
              </t-button>
            </template>
          </t-input>
        </div>
      </div>
      <div class="flex justify-center gap-2">
        <t-tag v-for="(item, index) in quickly" :key="index" variant="light" class="cursor-pointer hover:opacity-80" @click="onQuickSearch(item)">
          {{ item }}
        </t-tag>
      </div>
      <div class="mt-4">
        <PageFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import router from '../router'
import { PageFooter, SearchInputBar } from '../components'
import logoUrl from '../assets/logo.png'

const quickly = [
  '如何安装ComfyUI？',
  '如何撰写优质的prompt提示词和AI大模型对话？'
]

const search = (val: string) => {
  if (!val) {
    return
  }
  router.push({
    name: 'SearchPage',
    query: {
      q: val
    }
  })
}

const onQuickSearch = (val: string) => {
  search(val)
}
</script>

<script lang="tsx">
export default {
  name: 'HomePage'
}
</script>

<style scoped>
#home {
  --td-radius-default: 24px;
}
</style>
