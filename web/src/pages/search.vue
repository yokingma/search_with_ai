<template>
  <div id="search" class="relative size-full overflow-hidden">
    <div class="absolute inset-x-0 inset-y-4 rounded-2xl bg-gray-100 p-2">
      <div class="h-full rounded-2xl bg-white overflow-y-auto">
        <div class="p-4">
          <div class="border-0 border-b border-solid border-gray-100 pb-4 text-xl font-bold leading-8 text-blue-800">
            {{ keyword }}
          </div>
          <div class="mt-4">
            <div class="flex flex-nowrap items-center gap-2 py-4 text-black">
              <RiQuestionAnswerLine />
              <span class="text-lg font-bold ">AI回答</span>
            </div>
            <ChatAnswer :answer="result?.answer" :contexts="result?.contexts" />
          </div>
          <div class="mt-4">
            <div class="flex flex-nowrap items-center gap-2 py-4 text-black">
              <RiBook2Line />
              <span class="text-lg font-bold ">参考资料</span>
            </div>
            <ChatSources :sources="result?.contexts" />
          </div>
          <div class="mt-4">
            <div class="flex flex-nowrap items-center gap-2 py-4 text-black">
              <RiChatQuoteLine />
              <span class="text-lg font-bold ">相关问题</span>
            </div>
            <RelatedQuery :related="result?.related" @select="onSelectQuery" />
          </div>
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
import { MessagePlugin } from 'tdesign-vue-next'
import { RiQuestionAnswerLine, RiBook2Line, RiChatQuoteLine } from '@remixicon/vue'
import router from '../router'
import { search } from '../api'
import { PageFooter, ChatAnswer, RelatedQuery, ChatSources } from '../components'
import { IQueryResult } from 'src/interface'

const keyword = computed(() => router.currentRoute.value.query.q)

const result = ref<IQueryResult>({
  related: '',
  answer: '',
  contexts: []
})

const onSelectQuery = (query: string) => {
  console.log(query)
}

onMounted(() => {
  querySearch()
})

async function querySearch() {
  if (!keyword.value) return
  try {
    await search(keyword.value as string, {
      onMessage: (data) => {
        if (data.contexts) {
          result.value.contexts = data.contexts
        }
        if (data.answer) {
          result.value.answer += data.answer
        }
        if (data.related) {
          result.value.related += data.related
        }
      },
      onClose: () => {
        console.log('closed')
      },
      onError: (err) => {
        console.log('error')
      }
    })
    // result.value = res
  } catch(err) {
    console.log(err)
    MessagePlugin.error('搜索查询失败了')
  }
}

function clear () {
  result.value = {
    related: '',
    answer: '',
    contexts: []
  }
}
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
}
</script>
