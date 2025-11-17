<script setup lang="tsx">
import { ref } from 'vue';
import { SystemSumIcon } from 'tdesign-icons-vue-next';
import { RiToolsFill } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
import { IChatInputParams } from '@/types';

defineOptions({
  name: 'ChatSender'
});

type Emits = {
  (e: 'stop'): void,
  (e: 'send', val: IChatInputParams): void,
}

type Props = {
  loading?: boolean
  autofocus?: boolean
  limit?: number
  showScience?: boolean
}

withDefaults(defineProps<Props>(), {
  limit: 2048,
  loading: false,
  autofocus: false
});

const emits = defineEmits<Emits>();

const { t } = useI18n();

const chatSenderRef = ref(null);
const inputValue = ref('');

const enabledDeepResearch = ref(false);
const checkDeepResearch = () => {
  enabledDeepResearch.value = !enabledDeepResearch.value;
};

const onSearch = () => {
  if (!inputValue.value?.trim()) return;
  const params: IChatInputParams = {
    value: inputValue.value.trim(),
    enabledDeepResearch: enabledDeepResearch.value,
  };
  emits('send', params);
  inputValue.value = '';
};

const onStop = () => {
  emits('stop');
};
</script>

<template>
  <t-chat-sender
    ref="chatSenderRef"
    v-model="inputValue"
    :textarea-props="{
      placeholder:  t('tips.chatPlaceholder'),
      maxlength: limit,
      autofocus: autofocus,
    }"
    :loading="loading"
    @send="onSearch"
    @stop="onStop"
  >
    <template #suffix="{ renderPresets }">
      <component :is="renderPresets([])" />
    </template>
    <template #prefix>
      <div class="flex flex-nowrap gap-2">
        <t-button
          class="flex-auto shrink-0 rounded-full border border-zinc-200 bg-white text-black dark:border-zinc-500 dark:bg-zinc-600 dark:text-white"
          :class="{ 'active': enabledDeepResearch }"
          variant="text"
          @click="checkDeepResearch"
        >
          <div class="flex flex-nowrap items-center gap-1">
            <SystemSumIcon />
            <span>{{ t('deepResearch') }}</span>
          </div>
        </t-button>
        <t-button
          v-if="false"
          class="flex-auto shrink-0 rounded-full border border-zinc-200 bg-white text-black dark:border-zinc-500 dark:bg-zinc-600 dark:text-white"
          variant="text"
        >
          <div class="flex flex-nowrap items-center gap-1">
            <RiToolsFill size="16px" />
            <span>MCP</span>
          </div>
        </t-button>
      </div>
    </template>
  </t-chat-sender>
</template>

<style scoped lang="less">
:deep(.t-chat-sender__textarea) {
  background-color: #f8f8f8;
}
.active {
  background-color: black;
  color: white;
  box-shadow: 0 0 6px rgba(0, 0, 0, .3);
  &:hover {
    background-color: black;
    color: white;
  }
}
:global(:root[theme-mode="dark"] .t-chat-sender__textarea) {
  background-color: #000000;
}
:global(:root[theme-mode="dark"] .active) {
  background-color: white;
  color: black;
  &:hover {
    background-color: #cccccc;
    color: black;
  }
}
</style>
