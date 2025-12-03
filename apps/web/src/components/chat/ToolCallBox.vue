<script lang="tsx" setup>
import { IToolCall } from '@/types';
import { RiCheckboxCircleLine, RiErrorWarningLine, RiLoaderLine, RiStopCircleLine, RiTerminalLine, RiArrowDownLine, RiArrowUpLine } from '@remixicon/vue';
import { computed, ref } from 'vue';

interface Props {
  toolCall: IToolCall;
}

const props = defineProps<Props>();
const isExpanded = ref(false);
const expandedArgs = ref<Record<string, boolean>>({});

const statusIcon = computed(() => {
  switch (props.toolCall.status) {
    case 'pending':
      return <RiLoaderLine class='size-4 animate-spin' />;
    case 'completed':
      return <RiCheckboxCircleLine class='size-4' />;
    case 'error':
      return <RiErrorWarningLine class='size-4' />;
    case 'interrupted':
      return <RiStopCircleLine class='size-4' />;
    default:
      return <RiTerminalLine class='size-4' />;
  }
});

const hasContent = computed(() => {
  return props.toolCall.result || (props.toolCall.args && Object.keys(props.toolCall.args).length > 0);
});

const toggleExpanded = () => {
  if (hasContent.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const toggleArgExpanded = (argKey: string) => {
  expandedArgs.value = {
    ...expandedArgs.value,
    [argKey]: !expandedArgs.value[argKey]
  };
};

const formatValue = (value: any): string => {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  } catch (error) {
    return '[Circular Reference]';
  }
};
</script>

<template>
  <div 
    class="w-full overflow-hidden rounded-lg border-none shadow-none outline-none transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
    :class="{ 'bg-zinc-100 dark:bg-zinc-700': isExpanded && hasContent }"
  >
    <button
      class="flex w-full items-center justify-between gap-2 border-none p-2 text-left shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-zinc-400"
      :class="{ 'cursor-default': !hasContent, 'cursor-pointer': hasContent }"
      :disabled="!hasContent"
      @click="toggleExpanded"
    >
      <div class="flex w-full items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <component :is="statusIcon" />
          <span class="text-[15px] font-extrabold tracking-[-0.6px]">
            {{ toolCall.name || 'Unknown Tool' }}
          </span>
        </div>
        <component 
          :is="isExpanded ? RiArrowUpLine : RiArrowDownLine" 
          v-if="hasContent"
          class="size-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" 
        />
      </div>
    </button>

    <div v-if="isExpanded && hasContent" class="px-4 pb-4">
      <!-- Arguments Section -->
      <div v-if="toolCall.args && Object.keys(toolCall.args).length > 0" class="mt-4">
        <h4 class="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Arguments
        </h4>
        <div class="space-y-2">
          <div
            v-for="[key, value] in Object.entries(toolCall.args)"
            :key="key"
            class="overflow-hidden rounded-sm border border-zinc-200 dark:border-zinc-600"
          >
            <button
              class="flex w-full items-center justify-between border-none bg-zinc-100 p-2 text-left text-xs font-medium transition-colors hover:bg-zinc-200 dark:bg-black dark:text-zinc-400 dark:hover:bg-zinc-600"
              @click="toggleArgExpanded(key)"
            >
              <span class="font-mono">{{ key }}</span>
              <component 
                :is="expandedArgs[key] ? RiArrowUpLine : RiArrowDownLine" 
                class="size-3 text-zinc-500 dark:text-zinc-400" 
              />
            </button>
            <div v-if="expandedArgs[key]" class="border-t border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-600 dark:bg-zinc-800">
              <pre class="m-0 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs leading-6">{{ formatValue(value) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Section -->
      <div v-if="toolCall.result" class="mt-4">
        <h4 class="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Result
        </h4>
        <pre class="m-0 overflow-x-auto whitespace-pre-wrap break-all rounded-sm border border-zinc-200 bg-zinc-100 p-2 font-mono text-xs leading-7 dark:border-zinc-600 dark:bg-zinc-700">{{ formatValue(toolCall.result) }}</pre>
      </div>
    </div>
  </div>
</template>
  