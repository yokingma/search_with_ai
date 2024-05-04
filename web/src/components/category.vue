<script setup lang="ts">
import { useAppStore } from '../store';
import { SearXNGCategories } from '../contants';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const categories = SearXNGCategories.map(item => {
  return {
    name: item.displayName,
    value: item.name
  };
});
const appStore = useAppStore();

const value = ref(appStore.category);

const onCategoryChange = (val: any) => {
  appStore.updateCategory(val)
}
</script>

<script lang="ts">
export default {
  name: 'SearchCategory'
}
</script>

<template>
  <div class="sear-category">
    <t-radio-group variant="default-filled" @change="onCategoryChange" :default-value="value">
      <t-radio-button v-for="item in categories" :value="item.value">
        {{ t(item.name) }}
      </t-radio-button>
    </t-radio-group>
  </div>
</template>

<style scoped>
.sear-category {
 --td-radius-default: 20px;
 --td-radius-small: 20px;
}
</style>
