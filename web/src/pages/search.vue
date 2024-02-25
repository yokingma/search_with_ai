<template>
  <div id="search" class="relative size-full overflow-hidden">
    <div class="absolute inset-x-0 inset-y-4 rounded-2xl bg-gray-100 p-2">
      <div class="h-full rounded-2xl bg-white overflow-y-auto">
        <div class="p-4">
          <div class="border-0 border-b border-solid border-gray-100 py-4 text-lg font-bold leading-6">
            {{ keyword }}
          </div>
          <template v-if="result">
            <div class="mt-4">
              <div class="flex flex-nowrap items-center gap-2 py-4 text-blue-600">
                <RiQuestionAnswerLine />
                <span class="text-lg font-bold ">AI回答</span>
              </div>
              <div class="text-sm leading-6 text-gray-600">{{ result.answer }}</div>
            </div>
            <div class="mt-4">
              <div class="flex flex-nowrap items-center gap-2 py-4 text-blue-600">
                <RiBook2Line />
                <span class="text-lg font-bold ">参考资料</span>
              </div>
              <div class="grid grid-cols-4 gap-2 text-xs text-gray-500">
                <div 
                  v-for="(item, index) in result.contexts" 
                  :key="index" 
                  class="overflow-hidden rounded-md bg-gray-100 p-2 leading-5 xl:p-3"
                >
                  <div class="truncate break-words text-black">{{ item.name }}</div>
                  <div class="mt-1 flex items-center gap-1">
                    <t-tag size="small">{{ index + 1 }}</t-tag>
                    <div class="truncate break-words">{{ item.url }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex flex-nowrap items-center gap-2 py-4 text-blue-600">
                <RiChatQuoteLine />
                <span class="text-lg font-bold ">相关问题</span>
              </div>
              <div class="flex flex-col gap-4">
                <div v-for="(item, index) in result.related" :key="index" class="rounded-md bg-gray-100 p-2 text-sm">
                  {{ item }}
                </div>
              </div>
            </div>
          </template>
          <div class="mt-4">
            <PageFooter />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import { RiQuestionAnswerLine, RiBook2Line, RiChatQuoteLine } from '@remixicon/vue'
import router from '../router'
import { search } from '../api'
import PageFooter from '../components/footer.vue'

const keyword = computed(() => router.currentRoute.value.query.q)

const result = ref<Record<string, any> | null>(null)

async function querySearch() {
  if (!keyword.value) return
  try {
    const res = await search(keyword.value as string)
    result.value = res
  } catch(err) {
    console.log(err)
    Toast('搜索查询失败了')
  }
}

onMounted(() => {
  querySearch()
})
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
}
</script>
