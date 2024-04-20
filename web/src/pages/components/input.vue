<script setup lang="ts">
import { ref } from 'vue';
import { RiArrowRightLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
type Emits = {
  (e: 'ask', val: string): void,
  (e: 'new'): void
}

type Props = {
  loading: boolean
}
const { t } = useI18n();
const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const query = ref('');

const onNewChat = () => {
  emits('new');
};

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
  <div id="ask" class="flex flex-row items-center gap-2 rounded-3xl bg-gray-100 p-2 transition-all dark:bg-zinc-800">
    <div class="grow overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-300">
      <t-input v-model="query" :disabled="props.loading" clearable :autofocus="true" :maxlength="100" size="large" :placeholder="t('chat')" @enter="onAsk">
        <template #suffix>
          <t-button :disabled="loading" shape="round" variant="base" @click="onAsk">
            <template #icon><RiArrowRightLine /></template>
          </t-button>
        </template>
      </t-input>
    </div>
    <div class="grow-0">
      <t-button theme="primary" size="large" @click="onNewChat">
        {{ t('newChat') }}
      </t-button>
    </div>
  </div>
</template>


<style scoped>
#ask {
  --td-radius-default: 24px;
}
</style>
