<script setup lang="ts">
import { IMessage } from 'src/interface';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import { RiRefreshLine } from '@remixicon/vue';

interface Iprops {
  message: IMessage
  enableReload: boolean
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
    <div class="flex flex-col gap-2">
      <div v-if="message.role === 'user'" class="flex items-center gap-2 text-xs text-zinc-400">
        {{ message.content }}
        <t-tooltip :content="t('reload')">
          <t-button v-if="enableReload" theme="default" shape="circle">
          <template #icon>
            <RiRefreshLine />
          </template>
        </t-button>
        </t-tooltip>
      </div>
      <div v-else class="rounded-xl  bg-zinc-50 p-4 leading-6 text-zinc-600 shadow-md shadow-zinc-100 dark:bg-zinc-700 dark:text-zinc-200 dark:shadow-zinc-800">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="markdown-body" v-html="marked(message.content)"></div>
      </div>
    </div>
  </div>
</template>
