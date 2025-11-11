<script setup lang="ts">
import router from '../../router';
import { search } from '../../api';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../../store';
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChatMessage, ChatSenderBox  } from '@/components';
import { getChat, updateChat, IChatRecord } from '@/storage/chat';
import { IChatInputParams, IChatMessage } from '@/types';
import { ROUTE_NAME } from '@/constants';
import { useScrollToBottom } from '@/utils/useScroll';
import { scrollWrapperKey } from '@/types';

interface IProps {
  // chat uuid
  uuid: string
}

const props = defineProps<IProps>();
const appStore = useAppStore();

const { t } = useI18n();

const injectScrollWrapper = inject(scrollWrapperKey);
const scrollWrapper = injectScrollWrapper?.scrollWrapper;

const query = ref<string>();
const loading = ref(false);
const autoScroll = ref(true);

let abortCtrl: AbortController | null = null;

const messages = ref<IChatMessage[]>([]);

const onChat = (params: IChatInputParams) => {
  const { value } = params;
  if (!value.trim()) return MessagePlugin.warning('请输入对话问题');
  sendMessage({
    role: 'user',
    content: value,
  });
};

const onReload = (index: number) => {
  // user message before index
  const prevMessage = messages.value[index - 1];
  if (prevMessage) {
    // slice messages after index
    messages.value = messages.value.slice(0, index - 1);
    sendMessage(prevMessage);
  }
};

const onStop = () => {
  if (abortCtrl) {
    abortCtrl.abort();
    abortCtrl = null;
    loading.value = false;
    MessagePlugin.info(t('message.queryStopped'));
  }
};

watch(() => props.uuid, async (val) => {
  if (!val) return;
  const res = await getChat(val as string);
  messages.value = [...(res?.messages ?? [])];
  // first message
  if (messages.value.length === 1 && loading.value === false) {
    const message = messages.value[0];
    messages.value = [];
    await sendMessage(message);
    clearUserQuery();
  }
  nextTick(() => {
    useScrollToBottom({ target: scrollWrapper?.value });
  });
});

onMounted(async () => {
  if (!props.uuid) {
    router.push({ name: ROUTE_NAME.HOME });
    return;
  }
  await initChat();
  // Listen for manual scroll control
  scrollWrapper?.value?.addEventListener('scroll', () => {
    if (!scrollWrapper.value) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollWrapper.value;
    if (scrollHeight - scrollTop - clientHeight > 100) {
      autoScroll.value = false;
    } else {
      autoScroll.value = true;
    }
  });
});

onUnmounted(() => {
  abortCtrl?.abort();
  abortCtrl = null;
  loading.value = false;
});

async function sendMessage(message: IChatMessage) {
  if (loading.value) return MessagePlugin.info('正在回答中，请稍后...');
  if (!appStore.model) return MessagePlugin.info('请先选择AI模型~');
  
  abortCtrl = new AbortController();
  loading.value = true;

  const language = appStore.language === 'en' ? 'all' : 'zh';

  // push user message
  messages.value.push(message);

  const queryMessages = messages.value.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  // push empty assistant message
  messages.value.push({
    role: 'assistant',
    content: '',
    reasoning_content: '',
    source: {
      images: [],
      contexts: []
    }
  });
  const curMessage: IChatMessage = messages.value[messages.value.length - 1];

  // scroll to bottom
  nextTick(() => {
    autoScroll.value && useScrollToBottom({ target: scrollWrapper?.value });
  });
  try {
    loading.value = true;
    const { model, engine, category } = appStore;
    const provider = model?.provider;
    const modelName = model?.name;
    await search(queryMessages, {
      model: modelName,
      provider,
      engine,
      language,
      categories: [category],
      ctrl: abortCtrl,
      onMessage: (data: any) => {
        if (data?.context) {
          curMessage.source?.contexts?.push(data.context);
        }
        if (data?.image) {
          curMessage.source?.images?.push(data.image);
        }
        if (data?.content) {
          curMessage.content += data.content;
        }
        if (data?.reasoningContent) {
          curMessage.reasoning_content += data.reasoningContent;
        }
        nextTick(() => {
          autoScroll.value && useScrollToBottom({ target: scrollWrapper?.value, ms: 2000 });
        });
      },
      onError: (errMsg: any) => {
        const msg = errMsg?.toString() || 'Error';
        curMessage.content += `${msg}`;
      }
    });
    loading.value = false;
    await updateChat(props.uuid, {
      messages: messages.value,
    } as IChatRecord);
    abortCtrl = null;
  } catch(err) {
    abortCtrl?.abort();
    abortCtrl = null;
    loading.value = false;
    MessagePlugin.error(t('message.queryError'));
  }
}

async function initChat () {
  if (loading.value) return;
  if (!props.uuid) return;
  const res = await getChat(props.uuid);
  if (!res?.messages?.length) {
    return router.push({ name: ROUTE_NAME.HOME });
  }
  // first message
  if (res.messages.length === 1) {
    await sendMessage(res.messages[0]);
    clearUserQuery();
  } else {
    // load history messages
    messages.value.push(...res.messages);
  }
  nextTick(() => {
    useScrollToBottom({ target: scrollWrapper?.value });
  });
}

function clearUserQuery () {
  if (query.value) query.value = undefined;
}
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
};
</script>

<template>
  <div class="relative flex size-full flex-col items-center justify-center">
    <div class="box-border w-full grow p-2 lg:p-0">
      <t-chat :clear-history="false" layout="both" :reverse="false">
        <template v-for="(msg, index) in messages" :key="index">
          <ChatMessage
            :avatar="false"
            :typing="loading && messages.length === index + 1"
            :message="msg"
            @reload="onReload(index)"
          />
        </template>
      </t-chat>
    </div>
    <div class="sticky bottom-0 box-border w-full shrink-0 grow-0 pb-2 pl-2 lg:pl-0">
      <ChatSenderBox
        :loading="loading"
        :autofocus="false"
        @send="onChat"
        @stop="onStop"
      />
    </div>
  </div>
</template>
