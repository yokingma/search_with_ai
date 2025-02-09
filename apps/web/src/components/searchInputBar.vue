<script setup lang="ts">
import { RiArrowRightLine } from '@remixicon/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
type Emits = {
  (e: 'search', val: string): void,
}

type Props = {
  loading: boolean
  autofocus: boolean
  limit?: number
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  limit: 520
});

const isComposing = ref(false);

const onCompositionStart = () => {
  isComposing.value = true;
};

const onCompositionEnd = () => {
  isComposing.value = false;
};

const emits = defineEmits<Emits>();

const query = defineModel<string>();

const onSearch = () => {
  if (!query.value?.trim()) return;  
  if (isComposing.value) return;
  emits('search', query.value.trim());
};
</script>

<template>
  <div id="searchbar" class="flex flex-row rounded-3xl bg-zinc-100 p-2 transition-all dark:bg-zinc-800">
    <div class="grow overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-300 dark:bg-zinc-600">
      <t-input
        v-model="query"
        :disabled="props.loading"
        :autofocus="autofocus"
        :maxlength="limit"
        :placeholder="t('tips.search')"
        size="large"
        clearable
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        @enter="onSearch"
      >
        <template #suffix>
          <t-button :disabled="loading" shape="round" variant="base" @click="onSearch">
            <template #icon><RiArrowRightLine /></template>
          </t-button>
        </template>
      </t-input>
    </div>
    <div class="grow-0">
      <slot />
    </div>
  </div>
</template>


<style scoped>
#searchbar {
  --td-radius-default: 24px;
}
</style>
