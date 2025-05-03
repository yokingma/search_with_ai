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

const props = defineProps<{
  showAccept: boolean;
  answer: {
    accepted: boolean;
    content: string;
    citations?: { content: string }[];
  };
}>();

const { t } = useI18n();

const htmlContent = computed(() => {
  return marked(props.answer.content || '');
});

const onCopy = async () => {
  await clipboardCopy(props.answer.content || '');
  MessagePlugin.success(t('chat.copySuccess'));
};
</script>

<template>
  <div>
    <!-- 是否采纳 -->
    <span v-if="props.showAccept && props.answer.accepted" class="text-green-500">✓ 采纳</span>

    <!-- 回答内容 -->
    <div class="answer-content" v-html="htmlContent"></div>

    <!-- 引用（如果有） -->
    <ul v-if="props.answer.citations?.length" class="citations">
      <li v-for="(item, index) in props.answer.citations" :key="index">
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
