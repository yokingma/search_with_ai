<script setup lang="tsx">
defineOptions({
  name: 'ChatAnswer',
});

import { computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useI18n } from 'vue-i18n';
import { clipboardCopy } from '../utils';
import { marked } from 'marked';
import {
  RiRestartLine,
  RiClipboardLine,
  RiShareForwardLine,
  RiInfinityLine
} from '@remixicon/vue';
import type { IAnswer } from '../interface';

const props = defineProps<{
  showAccept?: boolean;
  answer?: string | IAnswer;
}>();

const { t } = useI18n();

const answerObj = computed<IAnswer>(() => {
  if (typeof props.answer === 'string') {
    return {
      accepted: true,
      content: props.answer,
    };
  }
  return props.answer ?? { accepted: true, content: '' };
});

const htmlContent = computed(() => {
  return marked(answerObj.value.content || '');
});

const onCopy = async () => {
  await clipboardCopy(answerObj.value.content || '');
  MessagePlugin.success(t('chat.copySuccess'));
};
</script>

<template>
  <div>
    <!-- 是否采纳 -->
    <span v-if="showAccept && answerObj.accepted" class="text-green-500">✓ 采纳</span>

    <!-- 回答内容 -->
    <div class="answer-content" v-html="htmlContent"></div>

    <!-- 引用（如果有） -->
    <ul v-if="answerObj.citations?.length" class="citations">
      <li v-for="(item, index) in answerObj.citations" :key="index">
        {{ item.content }}
      </li>
    </ul>

    <!-- 操作按钮 -->
    <div class="actions">
      <RiClipboardLine class="icon" @click="onCopy" />
      <RiRestartLine class="icon" />
      <RiShareForwardLine class="icon" />
      <RiInfinityLine class="icon" />
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
  background: transparent !important;
}
.icon {
  cursor: pointer;
  margin-right: 8px;
}
.actions {
  margin-top: 1rem;
}
</style>
