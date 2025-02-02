<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';

type Emit = {
  (e: 'click'): void;
};

const appStore = useAppStore();
const { t } = useI18n();
const model = ref('');

const emits = defineEmits<Emit>();

onMounted(() => {
  const cached = appStore.model;
  model.value = cached || '';
});
</script>

<script lang="ts">
export default {
  name: 'PageFooter',
};
</script>

<template>
  <div class="flex w-full flex-col items-center gap-2">
    <div class="text-center text-xs text-gray-400">
      {{ t('warning') }}
    </div>
    <div class="mt-2 flex items-center gap-2 text-xs text-black dark:text-white">
      <div class="cursor-pointer" @click="emits('click')">{{ t('selectModel') }}: 
        <t-tag shape="round" size="small">{{ appStore.model || t('message.noSelect') }}</t-tag>
      </div>
      <div class="cursor-pointer" @click="emits('click')">
        {{ t('search') }}: <t-tag shape="round" size="small">{{ appStore.engine || t('message.noSelect') }}</t-tag>
      </div>
    </div>
  </div>
</template>
