<script setup lang="ts">
import { ref } from 'vue';
import { RiArrowRightLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
type Emits = {
  (e: 'search', val: string): void,
}

type Props = {
  loading: boolean,
}
const { t } = useI18n();
const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const query = ref('');

const onSearch = () => {
  emits('search', query.value);
};
</script>
<script lang="ts">
export default {
  name: 'SearchInputBar'
};
</script>

<template>
  <div id="searchbar" class="rounded-3xl bg-gray-100 p-2 transition-all dark:bg-zinc-800">
    <div class="w-full overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-300">
      <t-input v-model="query" :disabled="props.loading" clearable :autofocus="true" :maxlength="100" size="large" :placeholder="t('tips.search')" @enter="onSearch">
        <template #suffix>
          <t-button :disabled="loading" shape="round" variant="base" @click="onSearch">
            <template #icon><RiArrowRightLine /></template>
          </t-button>
        </template>
      </t-input>
    </div>
  </div>
</template>


<style scoped>
#searchbar {
  --td-radius-default: 24px;
}
</style>
