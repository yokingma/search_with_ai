<template>
  <div id="search" class="relative size-full">
    <div class="absolute inset-x-0 inset-y-4 overflow-hidden rounded-2xl bg-gray-100 p-2">
      <div ref="wrapperRef" class="h-full overflow-y-auto rounded-2xl bg-white">
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
          <div class="mt-4 pb-20">
            <PageFooter />
          </div>
        </div>
      </div>
      <div class="absolute inset-x-6 bottom-6 flex items-center justify-center">
        <div class="w-full  rounded-3xl shadow-xl">
          <SearchInputBar :loading="loading" @search="onSearch" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next'
import { RiQuestionAnswerLine, RiBook2Line, RiChatQuoteLine } from '@remixicon/vue'
import router from '../router'
import { search } from '../api'
import { PageFooter, ChatAnswer, RelatedQuery, ChatSources, SearchInputBar } from '../components'
import { IQueryResult } from 'src/interface'

const wrapperRef = ref<HTMLDivElement | null>(null)

const keyword = computed(() => router.currentRoute.value.query.q ?? '')
const query = ref<string>('')
const loading = ref(false)

const result = ref<IQueryResult>({
  related: '',
  answer: '',
  contexts: []
})

const onSelectQuery = (val: string) => {
  const q = val.split('.')[1]
  query.value = q
  querySearch(q)
}

const onSearch = (val: string) => {
  query.value = val
  querySearch(val)
} 

onMounted(() => {
  querySearch(keyword.value as string)
})

async function querySearch(val: string | null) {
  if (!val) return
  clear()
  replaceQueryParam('q', val)
  try {
    loading.value = true
    await search(val, {
      onMessage: (data) => {
        if (wrapperRef.value) wrapperRef.value.scrollTop = wrapperRef.value.scrollHeight
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
        loading.value = false
      },
      onError: (err) => {
        console.log('error', err)
        loading.value = false
      }
    })
  } catch(err) {
    console.log(err)
    loading.value = false
    MessagePlugin.error('搜索查询失败了')
  }
}

function clear () {
  query.value = ''
  result.value = {
    related: '',
    answer: '',
    contexts: []
  }
}

function replaceQueryParam(name: string, val: string) {
  const url = new URL(location.href);
  url.searchParams.set(name, val);
  history.replaceState({}, '', url.toString());
}
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
}
</script>
