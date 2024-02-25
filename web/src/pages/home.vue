<template>
  <div id="home" class="w-full h-full flex items-center justify-center">
    <div class="lg:w-1/2 flex flex-col gap-4 p-4">
      <div class="flex items-center justify-center gap-2">
        <img :src="logoUrl" class="w-10" />
        <span class="font-bold text-3xl">AI Search</span>
        <t-tag variant="light" class="text-xs text-gray-500">beta</t-tag>
      </div>
      <div class="p-2 bg-gray-100 rounded-3xl transition-all">
        <div class="w-full border border-gray-10 rounded-3xl overflow-hidden">
          <t-input :autofocus="true" v-model="query" placeholder="请输入想要问AI的问题" >
            <template #suffix>
              <t-button @click="search" :maxlength="100" shape="round" theme="primary" size="extra-small">
                <template #icon><RiArrowRightLine /></template>
              </t-button>
            </template>
          </t-input>
        </div>
      </div>
      <div class="flex justify-center gap-2">
        <t-tag v-for="item in quickly" @click="onQuickSearch(item)" variant="light" class="cursor-pointer hover:opacity-80">
          {{ item }}
        </t-tag>
      </div>
      <div class="mt-4">
        <PageFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '../router'
import { RiArrowRightLine } from '@remixicon/vue'
import PageFooter from '../components/footer.vue'
import logoUrl from '../assets/logo.png'
const query = ref('')

const quickly = [
  '什么是AI大语言模型？',
  '如何使用prompt有效的和AI大模型对话？'
]

const search = () => {
  if (!query.value) {
    return
  }
  router.push({
    name: 'SearchPage',
    query: {
      q: query.value
    }
  })
}

const onQuickSearch = (keywords: string) => {
  query.value = keywords
  search()
}
</script>

<script lang="ts">
export default {
  name: 'HomePage'
}
</script>

<style scoped>
</style>
