<script setup lang="tsx">
import { ref } from 'vue';
import { SystemSumIcon } from 'tdesign-icons-vue-next';
import { RiBookLine, RiSendPlaneFill } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
import { InputParams } from './type';

defineOptions({
  name: 'ChatSender'
});

type Emits = {
  (e: 'send', val: InputParams): void,
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

const enabledThinking = ref(false);
const enabledScience = ref(false);
const checkThinking = () => {
  enabledThinking.value = !enabledThinking.value;
};

const checkScience = () => {
  enabledScience.value = !enabledScience.value;
};

const onSearch = () => {
  if (!inputValue.value?.trim()) return;
  const params: InputParams = {
    value: inputValue.value.trim(),
    enabledThinking: enabledThinking.value,
    enabledScience: enabledScience.value
  };
  emits('send', params);
  console.log('send message', params);
};
</script>

<template>
  <t-chat-sender
    ref="chatSenderRef"
    v-model="inputValue"
    :textarea-props="{
      placeholder:  t('tips.search'),
      maxlength: limit,
      autofocus: autofocus,
    }"
    :loading="loading"
    @send="onSearch"
  >
    <template #suffix>
      <!-- 监听键盘回车发送事件需要在sender组件监听 -->
      <t-button theme="default" shape="circle" variant="text" size="large" @click="onSearch">
        <template #icon>
          <RiSendPlaneFill class="text-2xl" />
        </template>
      </t-button>
    </template>
    <template #prefix>
      <div class="flex flex-nowrap gap-2">
        <t-button
          class="flex-auto shrink-0 rounded-full bg-white text-black hover:bg-white hover:text-black"
          :class="{ 'active': enabledThinking }"
          variant="text"
          @click="checkThinking"
        >
          <div class="flex flex-nowrap items-center gap-1">
            <SystemSumIcon />
            <span>{{ t('deepResearch') }}</span>
          </div>
        </t-button>
        <t-button
          v-if="showScience"
          class="flex-auto shrink-0 rounded-full bg-white text-black hover:bg-white hover:text-black"
          :class="{ 'active': enabledScience }"
          variant="text"
          @click="checkScience"
        >
          <div class="flex flex-nowrap items-center gap-1">
            <RiBookLine size="16px" />
            <span>{{ t('category.science') }}</span>
          </div>
        </t-button>
      </div>
    </template>
  </t-chat-sender>
</template>

<style scoped lang="less">
.active {
  background-color: black;
  color: white;
  &:hover {
    background-color: black;
    color: white;
  }
}
</style>
