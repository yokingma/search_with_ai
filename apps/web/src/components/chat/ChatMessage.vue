<script setup lang="tsx">
import { IChatMessage } from '@/types';
import ChatAnswer from './ChatAnswer.vue';

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
}

 withDefaults(defineProps<IProps>(), {
  size: 'large',
  theme: 'light'
});

const emits = defineEmits<IEmits>();

const onReload = () => {
  emits('reload');
};
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div class="flex w-full" :class="{ 'justify-end': message.role === 'user' }">
      <template v-if="message.role === 'user'">
        <t-chat-item
          class="w-full"
          role="user"
          :datetime="message.source?.datetime"
          :content="message.content"
          variant="base"
        />
      </template>
      <template v-else>
        <div class="w-full">
          <ChatAnswer
            :content="message.content"
            :reasoning="message.reasoning_content"
            :contexts="message.source?.contexts"
            :loading="typing"
            @reload="onReload"
          />
        </div>
      </template>
    </div>
  </div>
</template>
