<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
type Emits = {
  (e: 'ask', val: string): void
}

type Props = {
  loading: boolean
}
const { t } = useI18n();
const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const query = ref('');

const onAsk = () => {
  emits('ask', query.value);
  query.value = '';
};
</script>
<script lang="ts">
export default {
  name: 'ChatInput'
};
</script>

<template>
  <div id="ask" class="flex items-center justify-center">
    <div class="w-10/12 overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-300">
      <t-input v-model="query" :disabled="props.loading" clearable :autofocus="true" :maxlength="100" size="large" :placeholder="t('tips.continue')" @enter="onAsk" />
    </div>
  </div>
</template>


<style scoped>
#ask {
  --td-radius-default: 24px;
}
</style>
