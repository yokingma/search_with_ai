<script setup lang="ts">
import { ref } from 'vue';
import { RiArrowRightLine } from '@remixicon/vue';

type Emits = {
  (e: 'search', val: string): void,
}

type Props = {
  loading: boolean,
}

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
  <div id="searchbar" class="w-auto rounded-3xl bg-gray-100 p-2 transition-all dark:bg-zinc-900">
    <div class="w-full overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-400">
      <t-input v-model="query" :disabled="props.loading" clearable :autofocus="true" :maxlength="100" size="large" placeholder="请输入想要问AI的问题" @enter="onSearch">
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
