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
  console.log('watch', parent)
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
    // popover
    const popover = (
      <span class="inline-block w-4">
        <Popup placement="left-bottom" trigger="click" content={getCitationContent}>
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

function getCitationContent () {
  return (
    <div>
      123
    </div>
  )
}
</script>

<template>
  <div class="w-full h-auto text-base leading-8 text-gray-600">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!answer"></t-skeleton>
    <div ref="answerRef" class="markdown-body h-auto w-full" />
  </div>
</template>