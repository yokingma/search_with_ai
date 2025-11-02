<script setup lang="tsx">
import { RiCheckboxCircleLine } from '@remixicon/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface IProps {
  reasoning: string
  loading: boolean
  defaultCollapsed?: boolean
  duration?: number
}

const { t } = useI18n();

const props = withDefaults(defineProps<IProps>(), {
  defaultCollapsed: true,
  duration: 0
});


const collapsed = ref(props.defaultCollapsed);

const renderReasoningHeader = (loading: boolean, duration?: number) => {
  if (loading) {
    return <t-chat-loading text={t('reasoning')} />;
  }
  const endText = duration ? t('reasoning_duration', { duration }) : t('reasoning_completed');
  return (
    <div class="flex items-center">
      <RiCheckboxCircleLine class="mr-1 size-4 text-green-500" />
      <span>{endText}</span>
    </div>
  );
};
const renderReasoningContent = (reasoningContent: string) => <t-chat-content content={reasoningContent} role="assistant" />;

</script>

<template>
  <t-chat-reasoning
    v-if="reasoning?.length"
    v-model="collapsed"
    expand-icon-placement="right"
    :collapse-panel-props="{
      header: renderReasoningHeader(loading, duration),
      content: renderReasoningContent(reasoning),
    }"
  >
  </t-chat-reasoning>
</template>

<style lang="less" scoped>
:deep(.t-collapse-panel) {
  margin-left: 0px;
}
:deep(.t-chat__text__assistant) {
  p {
    line-height: 22px!important;
    margin-bottom: 6px!important;
    opacity: 0.6;
  }
}
</style>