<script setup lang="tsx">
import { IChatMessage } from '@/types';
import { RiCheckboxCircleLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ChatMessage',
});

interface IProps {
  message: IChatMessage
  typing: boolean
  size?: 'large' | 'small'
  avatar?: boolean
  enableReload?: boolean
  theme?: 'dark' | 'light'
}

interface IEmits {
  (e: 'reload'): void
  (e: 'dislike'): void
  (e: 'like'): void
}

const { t } = useI18n();

 withDefaults(defineProps<IProps>(), {
  size: 'large',
  theme: 'light'
});

const emits = defineEmits<IEmits>();

const renderReasoningHeader = (loading: boolean, item: IChatMessage) => {
  if (loading) {
    return <t-chat-loading text={t('thinking')} />;
  }
  const endText = item.source?.reasoning_duration ? `已深度思考(用时${item.source.reasoning_duration}秒)` : '已深度思考';
  return (
    <div style="display:flex;align-items:center">
      <RiCheckboxCircleLine class="mr-1 size-4 text-green-500" />
      <span>{endText}</span>
    </div>
  );
};
const renderReasoningContent = (reasoningContent: string) => <t-chat-content content={reasoningContent} role="assistant" />;

const handleOperation = (type: string, options: { e: MouseEvent }) => {
  console.log(type, options);
  if (type === 'reload') {
    emits('reload');
  } else if (type === 'like') {
    emits('like');
  } else if (type === 'dislike') {
    emits('dislike');
  }
};
</script>

<template>
  <div class="mt-2 flex flex-col gap-2">
    <div class="mt-2 flex w-full" :class="{ 'justify-end': message.role === 'user' }">
      <template v-if="message.role === 'user'">
        <t-chat-item
          role="user"
          :datetime="message.source?.datetime"
          :content="message.content"
          variant="base"
        ></t-chat-item>
      </template>
      <template v-else>
        <t-chat-item
          role="assistant"
          :datetime="message.source?.datetime"
          :content="message.content"
          :text-loading="typing"
          variant="outline"
        >
          <template #content>
            <t-chat-reasoning
              v-if="message.reasoning_content?.length"
              expand-icon-placement="right"
              :collapse-panel-props="{
                header: renderReasoningHeader(typing, message),
                content: renderReasoningContent(message.reasoning_content),
              }"
            >
            </t-chat-reasoning>
            <t-chat-content v-if="message.content.length > 0" :content="message.content" />
          </template>
          <template #actions>
            <t-chat-action
              :is-good="false"
              :is-bad="false"
              :content="message.content"
              @operation="(type: string, context: { e: MouseEvent }) => handleOperation(type, context)"
            />
          </template>
        </t-chat-item>
      </template>
    </div>
  </div>
</template>