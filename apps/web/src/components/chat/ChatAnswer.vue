<script setup lang="tsx">
import { watch, ref, render, computed } from 'vue';
import { MessagePlugin, Popup } from 'tdesign-vue-next';
import { citationMarkdownParse, clipboardCopy } from '../../utils';
import { RiRestartLine, RiClipboardLine, RiSearch2Line } from '@remixicon/vue';
import ChatReason from './ChatReason.vue';
import ChatRelated from './ChatRelated.vue';
import ChatSources from './ChatSource.vue';
import { marked } from 'marked';
import { useI18n } from 'vue-i18n';

interface IProps {
  reasoning?: string
  answer?: string
  related?: string
  duration?: number
  reasoningDuration?: number
  contexts?: Record<string, any>[]
  loading?: boolean
}

interface IEmits {
  (e: 'reload'): void
  (e: 'selectedRelated', val: string): void
}

defineOptions({
  name: 'ChatAnswer',
});

const { t } = useI18n();

const collapsed = ref(true);

const props = withDefaults(defineProps<IProps>(), {
  reasoning: '',
  answer: '',
  related: '',
  contexts: () =>[],
  duration: 0,
  reasoningDuration: 10,
  loading: false
});
const emits = defineEmits<IEmits>();
const answerRef = ref<HTMLDivElement | null>(null);

// html string
// const answerParse = computed(() => {
//   processAnswer(props.answer)
//   return
// })

const reasoningHtml = computed(() => {
  const reasoning = props.reasoning;
  if (!reasoning) return '';
  const md = citationMarkdownParse(reasoning || '');
  const html = marked.parse(md, {
    async: false
  });
  const parent = document.createElement('div');
  parent.innerHTML = html as string;
  const citationTags = parent.querySelectorAll('a');
  citationTags.forEach(tag => {
    const citationNumber = tag.getAttribute('href');
    const text = tag.innerText;
    if (text !== 'citation') return;

    const w = document.createElement('span');
    w.classList.add('text-xs', 'inline-block', 'text-center', 'px-1', 'text-zinc-50', 'bg-zinc-600', 'align-top', 'rounded-md');
    w.innerText = `${citationNumber}`;
    tag.parentNode?.replaceChild(w, tag);
  });
  return parent.innerHTML;
});

const handleOperation = (type: string) => {
  if (type === 'reload') {
    emits('reload');
  }
  if (type === 'copy') {
    if (!props.answer) return;
    clipboardCopy(props.answer);
    MessagePlugin.success(t('message.copied'));
  }
};

const onSelectRelated = (val: string) => {
  emits('selectedRelated', val);
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
        <Popup trigger="hover" content={getCitationContent(citationNumber)}>
          <span class="inline-block h-4 min-w-4 cursor-pointer rounded bg-black text-center align-top text-xs text-white hover:opacity-80 dark:bg-zinc-600">
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
        <div class="flex h-4 min-w-4 items-center justify-center rounded bg-black text-white dark:bg-zinc-600">{ num }</div>
        <span class="w-72 truncate">{context.name}</span>
      </div>
      <div class="mt-1 text-xs leading-6 text-gray-600 dark:text-gray-400">
        {context.snippet}
      </div>
      <div class="mt-2 border-0 border-t border-solid border-gray-100 pt-2 leading-6 dark:border-gray-700">
        <a href={context.url} target="_blank" class="inline-block max-w-full truncate text-black dark:text-white">
          {context.url}
        </a>
      </div>
    </div>
  );
}
</script>

<template>
  <div class="h-auto w-full text-base leading-7 text-zinc-600 dark:text-gray-200">
    <t-chat-item role="assistant">
      <template #content>
        <t-skeleton theme="paragraph" animation="flashed" :loading="!answer && !reasoning"></t-skeleton>
        <div class="flex flex-col gap-2 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800">
          <div class="flex flex-nowrap items-center gap-2">
            <RiSearch2Line size="14px" class="text-green-600" />
            <span class="font-extrabold">{{ t('search') }}</span>
          </div>
          <ChatSources :loading="loading ?? false" :sources="contexts" />
        </div>
        <div class="mb-4">
          <ChatReason
            v-if="reasoning?.length"
            :reasoning="reasoningHtml"
            :loading="loading ?? false"
            :collapsed="collapsed"
            :duration="reasoningDuration"
          />
        </div>
        <div ref="answerRef" class="markdown-body h-auto w-full dark:bg-zinc-800" />
        <div v-if="!loading" class="flex w-full flex-row justify-between gap-2">
          <div class="">
            <t-tag v-if="duration" variant="outline" theme="default">
              {{ duration }}s
            </t-tag>
          </div>
          <div class="flex flex-nowrap gap-2">
            <t-button
              size="small"
              theme="default"
              shape="circle"
              variant="outline"
              @click="handleOperation('reload')"
            >
              <div class="flex flex-nowrap items-center gap-1">
                <RiRestartLine size="14px" />
              </div>
            </t-button>
            <t-button
              size="small"
              theme="default"
              shape="circle"
              variant="outline"
              @click="handleOperation('copy')"
            >
              <div class="flex flex-nowrap items-center gap-1">
                <RiClipboardLine size="14px" />
              </div>
            </t-button>
          </div>
        </div>
        <div class="mt-4">
          <ChatRelated v-if="related?.length" :loading="loading" :related="related" @select="onSelectRelated" />
        </div>
      </template>
    </t-chat-item>
  </div>
</template>
