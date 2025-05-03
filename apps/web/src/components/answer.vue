<script setup lang="tsx">
import { watch, ref, render, computed } from 'vue';
import { MessagePlugin, Popup, Collapse, CollapsePanel, Tag, Tooltip, Button, Skeleton } from 'tdesign-vue-next';
import { citationMarkdownParse, clipboardCopy } from '../utils';
import { marked } from 'marked';
import { useI18n } from 'vue-i18n';
import { RiRestartLine, RiClipboardLine, RiShareForwardLine, RiInfinityLine } from '@remixicon/vue';

interface IProps {
  query?: string
  reasoning?: string | undefined // 修改为 undefined
  answer?: string
  contexts?: Record<string, any>[]
  loading?: boolean
}

interface IEmits {
  (e: 'reload'): void
  // (e: 'reasoning-chunk', chunk: string): void // 可选：用于通知父组件接收到推理片段
}

const { t } = useI18n();

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const answerRef = ref<HTMLDivElement | null>(null);
const showReasoning = ref(true);
const reasoningSteps = computed(() => {
  return props.reasoning?.split('\n').filter(step => step.trim() !== '') || [];
});

const onReload = () => {
  emits('reload');
};

const onCopy = async () => {
  // ... (保持不变)
};

const onShare = async () => {
  // ... (保持不变)
};

watch(() => props.answer, () => {
  const parent = processAnswer(props.answer);
  if (answerRef.value) {
    answerRef.value.innerHTML = '';
    answerRef.value.append(parent);
  }
});

function processAnswer (answer?: string) {
  // ... (保持不变)
}

function handleCitations (parent: HTMLDivElement) {
  // ... (保持不变)
}

function getCitationContent (num?: string | null) {
  // ... (保持不变)
}

// watch(() => props.reasoning, (newReasoning) => {
//   // 可选：在接收到每个推理片段时通知父组件
//   // 如果需要在父组件中做一些处理，例如记录日志或更新状态
//   // if (newReasoning && oldReasoning !== newReasoning) {
//   //   const newChunk = newReasoning.substring(oldReasoning?.length || 0);
//   //   emits('reasoning-chunk', newChunk);
//   // }
// });
</script>

<template>
  <div class="h-auto w-full text-base leading-7 text-zinc-600 dark:text-gray-200">
    <Skeleton theme="paragraph" animation="flashed" :loading="!answer && !reasoning"></Skeleton>
    <div v-if="reasoning" class="relative mb-4 box-border h-auto w-full pl-2">
      <div class="absolute left-0 top-0 h-full border border-solid border-zinc-200 dark:border-zinc-600"></div>
      <Collapse :expand-icon="true" :default-expand-all="true" expand-icon-placement="right" :borderless="true">
        <CollapsePanel :header="t('reasoning')">
          <div class="text-xs text-zinc-500">
            <div v-for="(step, index) in reasoningSteps" :key="index" class="mb-2 pl-4 relative">
              <div class="absolute left-[-10px] top-[2px] size-2 rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
              <span class="font-semibold">{{ t('step') }} {{ index + 1 }}:</span> {{ step }}
              </div>
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
    <div ref="answerRef" class="markdown-body h-auto w-full dark:bg-zinc-800" />
    <div v-if="!loading" class="mt-4 flex w-full flex-row justify-between border-0 border-b border-solid border-zinc-200 py-2 dark:border-zinc-600">
      <div class="flex gap-2">
        <Tooltip :content="t('share')">
          <Button :disabled="loading" theme="default" shape="round" variant="dashed" @click="onShare">
            <template #icon><RiShareForwardLine size="18"/></template>
            <span class="ml-2">{{ t('share') }}</span>
          </Button>
        </Tooltip>
      </div>
      <div class="flex flex-row gap-2">
        <Tooltip :content="t('copy')">
          <Button :disabled="loading" theme="default" shape="circle" variant="dashed" @click="onCopy">
            <template #icon><RiClipboardLine size="16"/></template>
          </Button>
        </Tooltip>
        <Tooltip :content="t('reload')">
          <Button :disabled="loading" theme="default" shape="circle" variant="dashed" @click="onReload">
            <template #icon><RiRestartLine size="16"/></template>
          </Button>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.t-collapse-panel__header) {
  padding: 0;
}
:deep(.t-collapse-panel__content) {
  padding: 0;
}
:deep(.t-collapse), :deep(.t-collapse-panel), :deep(.t-collapse-panel__body) {
  background: transparent!important;
}
</style>
