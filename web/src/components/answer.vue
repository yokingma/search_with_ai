<script lang="tsx">
export default {
  name: 'ChatAnswer'
};
</script>

<script setup lang="tsx">
import { watch, ref, render } from 'vue';
import { Popup } from 'tdesign-vue-next';
import { citationMarkdownParse } from '../utils';
import { marked } from 'marked';

interface Iprops {
  answer?: string
  contexts?: Record<string, any>[]
}
const props = defineProps<Iprops>();
const answerRef = ref<HTMLDivElement | null>(null);

// html string
// const answerParse = computed(() => {
//   processAnswer(props.answer)
//   return
// })

watch(() => props.answer, () => {
  const parent = processAnswer(props.answer);
  answerRef.value!.innerHTML = '';
  answerRef.value?.append(parent);
});

function processAnswer (answer?: string) {
  if (!answer) return '';
  const citation = citationMarkdownParse(props?.answer || '');
  const html = marked.parse(citation, {
    async: false
  });
  const parent = document.createElement('div');
  parent.innerHTML = html as string;
  const citationTags = parent.querySelectorAll('a');
  citationTags.forEach(tag => {
    const citationNumber = tag.getAttribute('href');
    const text = tag.innerText;
    if (text !== 'citation') return;
    // popover
    const popover = (
      <span class="inline-block w-4">
        <Popup trigger="click" content={getCitationContent(citationNumber)}>
          <span class="inline-block size-4 cursor-pointer rounded-full bg-gray-300 text-center align-top text-xs text-blue-600 hover:bg-gray-400">
            {citationNumber || ''}
          </span>
        </Popup>
      </span>
    );
    // wrapper
    const w = document.createElement('span');
    render(popover, w);
    tag.parentNode?.replaceChild(w, tag);
  });
  return parent;
}

function getCitationContent (num?: string | null) {
  if (!num) return () => <></>;
  const context = props.contexts?.[+num - 1];
  if (!context) return () => <></>;
  return () => (
    <div class="flex h-auto w-80 flex-col p-2">
      <div class="flex flex-nowrap items-center gap-1 font-bold leading-8">
        <t-tag size="small" theme="primary">{num}</t-tag>
        <span class="w-72 truncate">{context.name}</span>
      </div>
      <div class="mt-1 text-xs leading-6 text-gray-500">
        {context.snippet}
      </div>
      <div class="mt-2 border-0 border-t border-solid border-gray-100 pt-2 leading-6">
        <a href={context.url} target="_blank" class="inline-block max-w-full truncate text-blue-600">
          {context.url}
        </a>
      </div>
    </div>
  );
}
</script>

<template>
  <div class="h-auto w-full text-base leading-6 text-gray-600 dark:text-gray-200">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!answer"></t-skeleton>
    <div ref="answerRef" class="markdown-body h-auto w-full dark:bg-slate-800" />
  </div>
</template>