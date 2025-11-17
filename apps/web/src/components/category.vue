<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/store';
import { TSearCategory } from '@/types';
import { useI18n } from 'vue-i18n';
import { RiSearchAiLine } from '@remixicon/vue';

defineOptions({
  name: 'SearxngCategorySelect'
});

const { t } = useI18n();

const loading = ref(false);
const appStore = useAppStore();
const category = ref<TSearCategory>(appStore.category);

const options = [
  { value: 'general', name: t('category.general') },
  { value: 'news', name: t('category.news') },
  { value: 'science', name: t('category.science') },
  { value: 'it', name: t('category.it') },
  { value: 'files', name: t('category.files') },
  { value: 'social media', name: t('category.social_media') },
];

const onSelect = (val: any) => {
  appStore.updateCategory(val);
};

</script>

<template>
  <t-select
    v-model="category"
    :borderless="true"
    :auto-width="true"
    ::loading="loading"
    :placeholder="t('selectEngine')"
    @change="onSelect"
  >
    <template #prefixIcon>
      <RiSearchAiLine size="12px" />
    </template>
    <t-option v-for="item in options" :key="item.value" :value="item.value" :label="item.name"></t-option>
  </t-select>
</template>