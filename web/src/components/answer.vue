<script lang="tsx">
export default {
  name: 'ChatAnswer'
};
</script>

<script setup lang="tsx">
import { watch, ref, render } from 'vue';
import { MessagePlugin, Popup } from 'tdesign-vue-next';
import { citationMarkdownParse } from '../utils';
import { marked } from 'marked';
import { useI18n } from 'vue-i18n';
import { RiRestartLine, RiClipboardLine, RiShareForwardLine } from '@remixicon/vue';

interface Iprops {
  query?: string
  answer?: string
  contexts?: Record<string, any>[]
  loading?: boolean
}

interface IEmits {
  (e: 'reload'): void
}

const { t } = useI18n();

const props = defineProps<Iprops>();
const emits = defineEmits<IEmits>();
const answerRef = ref<HTMLDivElement | null>(null);

// html string
// const answerParse = computed(() => {
//   processAnswer(props.answer)
//   return
// })

const onReload = () => {
  emits('reload');
};

const onCopy = async () => {
  try {
    const text = answerRef.value?.innerText;
    if (text) {
      await navigator.clipboard.writeText(text);
      MessagePlugin.success(t('message.success'))
    }
  } catch (err) {
    MessagePlugin.error(t('message.copyError'));
  }
};

const onShare = async () => {
  try {
    const url = window.location.href
    const copyMsg = `${props.query}\n${url}`
    await navigator.clipboard.writeText(copyMsg);
    MessagePlugin.success(t('message.shareSuccess'))
  } catch (err) {
    MessagePlugin.error(t('message.copyError'));
  }
};

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
          <span class="inline-block size-4 cursor-pointer rounded-full bg-gray-300 text-center align-top text-xs text-green-600 hover:opacity-80 dark:bg-black">
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
  const context = props.contexts?.find((item) => item.id === +num);
  if (!context) return () => <></>;
  return () => (
    <div class="flex h-auto w-80 flex-col p-2">
      <div class="flex flex-nowrap items-center gap-1 font-bold leading-8">
        <t-tag size="small" theme="primary">{num}</t-tag>
        <span class="w-72 truncate">{context.name}</span>
      </div>
      <div class="mt-1 text-xs leading-6 text-gray-600 dark:text-gray-400">
        {context.snippet}
      </div>
      <div class="mt-2 border-0 border-t border-solid border-gray-100 pt-2 leading-6 dark:border-gray-700">
        <a href={context.url} target="_blank" class="inline-block max-w-full truncate text-blue-600">
          {context.url}
        </a>
      </div>
    </div>
  );
}
</script>

<template>
  <div class="h-auto w-full text-base leading-7 text-zinc-600 dark:text-gray-200">
    <t-skeleton theme="paragraph" animation="flashed" :loading="!answer"></t-skeleton>
    <div ref="answerRef" class="markdown-body h-auto w-full dark:bg-zinc-800" />
    <div v-if="!loading" class="flex w-full flex-row justify-between border-0 border-b border-solid border-zinc-200 py-2 dark:border-zinc-600">
      <div class="flex gap-2">
        <t-tooltip :content="t('share')">
          <t-button :disabled="loading" theme="default" shape="round" variant="dashed" @click="onShare">
            <template #icon><RiShareForwardLine size="18"/></template>
            <span class="ml-2">{{ t('share') }}</span>
          </t-button>
        </t-tooltip>
      </div>
      <div class="flex flex-row gap-2">
        <t-tooltip :content="t('copy')">
          <t-button :disabled="loading" theme="default" shape="circle" variant="dashed" @click="onCopy">
            <template #icon><RiClipboardLine size="16"/></template>
          </t-button>
        </t-tooltip>
        <t-tooltip :content="t('reload')">
          <t-button :disabled="loading" theme="default" shape="circle" variant="dashed" @click="onReload">
            <template #icon><RiRestartLine size="16"/></template>
          </t-button>
        </t-tooltip>        
      </div>
    </div>
  </div>
</template>