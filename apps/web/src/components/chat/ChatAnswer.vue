<script setup lang="tsx">
import { watch, ref, render, computed, onMounted } from 'vue';
import { MessagePlugin, Popup } from 'tdesign-vue-next';
import { citationMarkdownParse, clipboardCopy } from '../../utils';
import { RiRestartLine, RiClipboardLine, RiSearch2Line } from '@remixicon/vue';
import ChatReason from './ChatReason.vue';
import ChatSources from './ChatSource.vue';
import marked from './marked';
import { useI18n } from 'vue-i18n';

interface IProps {
  reasoning?: string
  content?: string
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
  content: '',
  contexts: () =>[],
  duration: 0,
  reasoningDuration: 10,
  loading: false
});
const emits = defineEmits<IEmits>();
const answerRef = ref<HTMLDivElement | null>(null);

const reasoningHtml = computed(() => {
  const reasoning = props.reasoning;
  if (!reasoning) return '';
  const md = citationMarkdownParse(reasoning || '');
  const html = marked(md);
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
    if (!props.content) return;
    clipboardCopy(props.content);
    MessagePlugin.success(t('message.copied'));
  }
};

watch(() => props.content, () => {
  const parent = processAnswer(props.content);
  if (!answerRef.value) return;
  answerRef.value.innerHTML = '';
  answerRef.value.append(parent);
});

onMounted(() => {
  const parent = processAnswer(props.content);
  if (answerRef.value) {
    answerRef.value.innerHTML = '';
    answerRef.value.append(parent);
  }
});

function processAnswer (answer?: string) {
  if (!answer) return '';
  const citation = citationMarkdownParse(answer || '');
  const html = marked(citation);
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
  <t-chat-item role="assistant">
    <template #content>
      <div v-if="!content && !reasoning" class="mt-4 rounded-md border border-solid border-gray-100 dark:border-gray-700">
        <t-skeleton theme="paragraph" animation="flashed"></t-skeleton>
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
      <div
        ref="answerRef"
        class="markdown-body box-border h-auto w-full dark:bg-zinc-800"
      />
      <div v-if="contexts?.length && !loading" class="flex flex-col gap-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
        <div class="flex flex-nowrap items-center gap-2 border-b border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-900">
          <RiSearch2Line size="14px" class="text-green-600" />
          <span class="font-extrabold">{{ t('search') }}</span>
        </div>
        <div class="p-4">
          <ChatSources :sources="contexts" />
        </div>
      </div>
      <div v-if="!loading" class="mt-4 flex w-full flex-row gap-2">
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
        <div class="">
          <t-tag v-if="duration" variant="outline" theme="default">
            {{ duration }}s
          </t-tag>
        </div>
      </div>
    </template>
  </t-chat-item>
</template>

<style lang="less" scoped>
:deep(.t-chat__detail) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style>
