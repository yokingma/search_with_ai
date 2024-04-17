<script setup lang="ts">
import { IMessage } from 'src/interface';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';

interface Iprops {
  message: IMessage
}

const { t } = useI18n();

defineProps<Iprops>();

</script>

<script lang="ts">
export default {
  name: 'ChatMessage'
};
</script>

<template>
  <div class="h-auto w-full">
    <div class="flex flex-col gap-2" :class="{ 'items-end': message.role === 'user', 'items-start': message.role === 'assistant' }">
      <div class="rounded-xl p-2 font-bold dark:text-zinc-200">{{ message.role === 'assistant' ? t('answer') : t('ask') }}</div>
      <div class="rounded-xl  bg-zinc-100 p-4 leading-6 text-zinc-600 shadow-md shadow-zinc-100 dark:bg-zinc-700 dark:text-zinc-200 dark:shadow-zinc-800">
        <template v-if="message.role === 'user'">{{ message.content }}</template>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-else class="markdown-body" v-html="marked(message.content)"></div>
      </div>
    </div>
  </div>
</template>
