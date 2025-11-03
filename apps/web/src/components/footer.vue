<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

</script>

<script lang="ts">
export default {
  name: 'PageFooter',
};
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="text-center text-xs leading-6 text-gray-400">
      {{ t('warning') }}
    </div>
  </div>
</template>
