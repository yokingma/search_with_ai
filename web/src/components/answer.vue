<script lang="tsx">
export default {
  name: 'ChatAnswer'
}
</script>

<script setup lang="tsx">
import { watch, ref, render } from 'vue'
import { Popup } from 'tdesign-vue-next'
import { citationMarkdownParse } from '../utils'
import { marked } from 'marked'

interface Iprops {
  answer?: string
  contexts?: Record<string, any>[]
}
const props = defineProps<Iprops>()
const answerRef = ref<HTMLDivElement | null>(null)

// html string
// const answerParse = computed(() => {
//   processAnswer(props.answer)
//   return
// })

watch(() => props.answer, () => {
  const parent = processAnswer(props.answer)
  answerRef.value!.innerHTML = ''
  answerRef.value?.append(parent)
})

function processAnswer (answer?: string) {
  if (!answer) return ''
  const citation = citationMarkdownParse(props?.answer || '')
  const html = marked.parse(citation, {
    async: false
  })
  const parent = document.createElement('div')
  parent.innerHTML = html as string
  const citationTags = parent.querySelectorAll('a')
  citationTags.forEach(tag => {
    const citationNumber = tag.getAttribute('href')
    const text = tag.innerText
    if (text !== 'citation') return
    // popover
    const popover = (
      <span class="inline-block w-4">
        <Popup trigger="click" content={getCitationContent(citationNumber)}>
          <span class="inline-block text-xs text-center text-blue-600 bg-gray-300 hover:bg-gray-400 size-4 rounded-full cursor-pointer align-top">
            {citationNumber || ''}
          </span>
        </Popup>
      </span>
    )
    // wrapper
    const w = document.createElement('span')
    render(popover, w)
    tag.parentNode?.replaceChild(w, tag)
  })
  return parent
}

function getCitationContent (num?: string | null) {
  if (!num) return () => <></>
  const context = props.contexts?.[+num - 1]
  if (!context) return () => <></>
  return () => (
    <div class="w-80 p-2 h-auto flex flex-col">
      <div class="flex flex-nowrap gap-1 items-center font-bold leading-8">
        <t-tag size="small" theme="primary">{num}</t-tag>
        <span class="truncate w-72">{context.name}</span>
      </div>
      <div class="text-gray-500 leading-6 text-xs mt-1">
        {context.snippet}
      </div>
      <div class="leading-6 border-0 border-solid border-t border-gray-100 leading-6 mt-2 pt-2">
        <a href={context.url} target="_blank" class="inline-block max-w-full text-blue-600 truncate">
          {context.url}
        </a>
      </div>
    </div>
  )
}
</script>

<template>
  <div class="w-full h-auto text-base leading-6 text-gray-600">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!answer"></t-skeleton>
    <div class="w-full h-auto" ref="answerRef" />
  </div>
</template>