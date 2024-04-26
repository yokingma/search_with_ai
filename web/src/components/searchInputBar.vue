<script setup lang="ts">
import { RiArrowRightLine } from '@remixicon/vue';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
type Emits = {
  (e: 'search', val: string): void,
}

type Props = {
  loading: boolean
  autofocus: boolean
}
const { t } = useI18n();

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const query = defineModel<string>();

const onSearch = () => {
  if (!query.value?.trim()) return;  
  emits('search', query.value);
};

watch(() => query.value, (val) => {
  console.log('query', val);
});
</script>

<template>
  <div id="searchbar" class="flex flex-row rounded-3xl bg-zinc-100 p-2 transition-all dark:bg-zinc-800">
    <div class="grow overflow-hidden rounded-3xl border border-zinc-100 dark:border-zinc-300 dark:bg-zinc-600">
      <t-input v-model="query" :disabled="props.loading" clearable :autofocus="autofocus" :maxlength="100" size="large" :placeholder="t('tips.search')" @enter="onSearch">
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
