<script setup lang="ts">
import { IMessage } from 'src/interface';
import { computed, ref, watch } from 'vue';
import ChatMessage from './message.vue';
import { useAppStore } from '../../store';
import { chat } from '../../api';
import { SystemPrompts, UserPrompts } from '../../contants';
import { useI18n } from 'vue-i18n';

interface IProps {
  ask?: string
  contexts?: Record<string, any>[]
  clear?: boolean
}

interface IEmit {
  (e: 'message', val: string): void
}

const { t } = useI18n();

const appStore = useAppStore();
const loading = ref(false);
const props = defineProps<IProps>();
const emits = defineEmits<IEmit>();

const messages = ref<IMessage[]>([]);

let abortCtrl: AbortController | null = null;

const userMessage = computed(() => {
  const contexts = props.contexts || [];
  const strs = contexts.map((context) => {
    return `[${context.id}]: ${context.snippet}`;
  });
  const ctx = UserPrompts.replace('%s', strs.join('\n'));
  const user: IMessage = {
    role: 'user',
    content: `${ctx}\n${props.ask}`
  };
  return user;
});

watch(() => props.ask, (ask) => {
  if (ask) {
    messages.value.push({
      role: 'user',
      content: ask
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

async function startChat() {
  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
  }
  const ctrl = new AbortController();
  abortCtrl = ctrl;
  loading.value = true;
  const { model, enableLocal, localModel } = appStore;
  const modelName = enableLocal ? localModel : model?.split(':')[1];
  messages.value.push({
    role: 'assistant',
    content: ''
  });
  const answer = messages.value[messages.value.length - 1];
  const msgs = [
    { ...userMessage.value }
  ];
  await chat(msgs, {
    ctrl,
    model: modelName,
    locally: enableLocal,
    system: SystemPrompts,
    onMessage: (message) => {
      answer.content += message.text || '';
      emits('message', answer.content);
    }
  });

  abortCtrl = null;
  loading.value = false;
  if (!answer.content) {
    messages.value.pop();
  }
}
</script>

<script lang="ts">
export default {
  name: 'ChatPage',
};
</script>

<template>
  <div class="w-full">
    <div v-if="!messages.length" class="w-full text-center text-zinc-500">
      {{ t('tips.continue') }}
    </div>
    <div class="mt-4 w-full">
      <div v-for="(message, index) in messages" :key="index" class="mt-4">
        <ChatMessage :message="message" />
      </div>
    </div>
  </div>
</template>