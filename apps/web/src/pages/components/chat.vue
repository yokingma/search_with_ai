<script setup lang="ts">
import { IMessage } from '../../interface';
import { computed, ref, watch } from 'vue';
import ChatMessage from './message.vue';
import { useAppStore } from '../../store';
import { chat } from '../../api';
import { SystemPrompts, UserPrompts } from '../../constants';
import { useI18n } from 'vue-i18n';

interface IProps {
  question: string
  contexts?: Record<string, any>[]
  query: string
  answer: string
  reasoning?: string
  // watch this value to clear messages
  clear?: boolean
}

interface IEmit {
  (e: 'message', val: string): void
  (e: 'done'): void
}

const { t } = useI18n();

const appStore = useAppStore();
const loading = ref(false);
const props = defineProps<IProps>();
const emits = defineEmits<IEmit>();

const messages = ref<IMessage[]>([]);

let abortCtrl: AbortController | null = null;

const queryMessages = computed(() => {
  const contexts = props.contexts || [];
  const contextTexts = contexts.map((context) => {
    return `[${context.id}]: ${context.snippet}`;
  });
  const ctx = UserPrompts.replace('%s', contextTexts.join('\n'));

  const firstMessage: IMessage = {
    role: 'user',
    content: `${ctx}\n${props.query}`
  };

  const secondMessage: IMessage = {
    role: 'assistant',
    content: props.answer
  };

  const chatMessages = messages.value.filter((message) => {
    return !!message.content;
  });

  return [
    firstMessage,
    secondMessage,
    ...chatMessages
  ];
});

watch(() => props.question, (question) => {
  if (question && !loading.value) {
    messages.value.push({
      role: 'user',
      content: question
    });
    startChat();
  }
});

watch(() => props.clear, (clear) => {
  if (clear) {
    messages.value = [];
    loading.value = false;
  }
});

const enableReload = computed(() => {
  const length = messages.value.length;
  return length > 1 && messages.value[length - 1].role === 'user';
});

const onClearMessage = () => {
  messages.value = [];
};

async function startChat() {
  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
  }
  const ctrl = new AbortController();
  abortCtrl = ctrl;
  loading.value = true;
  const { model } = appStore;
  const provider = model?.split(':')[0];
  const modelName = model?.split(':')[1];
  messages.value.push({
    role: 'assistant',
    content: '',
    reasoning: ''
  });
  const answer = messages.value[messages.value.length - 1];

  await chat(queryMessages.value, {
    ctrl,
    model: modelName,
    provider,
    system: SystemPrompts,
    onMessage: (message) => {
      answer.content += message.content || '';
      answer.reasoning += message.reasoningContent || '';
      emits('message', answer.content);
    }
  });

  emits('done');

  abortCtrl = null;
  loading.value = false;
  if (!answer.content) {
    messages.value.pop();
  }
}
</script>

<script lang="ts">
export default {
  name: 'ContinueChat',
};
</script>

<template>
  <div class="w-full">
    <div v-if="!messages.length" class="w-full text-center text-zinc-500">
      {{ t('tips.continue') }}
    </div>
    <div class="mt-4 w-full">
      <div v-for="(message, index) in messages" :key="index" class="mt-4">
        <t-loading v-if="message.role === 'assistant' && (!message.content || !message.reasoning)" size="small" />
        <ChatMessage v-else :enable-reload="enableReload" :message="message" />
      </div>
    </div>
    <div v-if="messages.length && !loading" class="mt-4 flex items-center justify-center">
      <t-button
        shape="round"
        :disabled="loading"
        :loading="loading"
        @click="onClearMessage"
      >
        {{ t('btn.clear') }}
      </t-button>
    </div>
  </div>
</template>