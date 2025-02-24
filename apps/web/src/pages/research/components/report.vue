<script setup lang="ts">
import { marked } from 'marked';
import { ref, computed } from 'vue';

defineOptions({ 
  name: 'ResearchReport',
});

interface IProps {
  report: string;
}

const reportRef = ref<HTMLDivElement>();
const props = defineProps<IProps>();

const reportHtml = computed(() => {
  const html = marked.parse(props.report, {
    async: false
  });
  return html;
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div ref="reportRef" class="markdown-body h-auto w-full dark:bg-zinc-800" v-html="reportHtml" />
  </div>
</template>
