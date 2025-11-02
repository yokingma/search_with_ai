<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { RiGithubFill } from '@remixicon/vue';
const { t } = useI18n();

</script>

<script lang="ts">
export default {
  name: 'PageFooter',
};
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="text-center text-xs leading-8 text-gray-400">
      {{ t('warning') }}
    </div>
    <t-link href="https://github.com/yokingma/search_with_ai" hover="color" target="_blank">
      <template #prefix-icon>
        <RiGithubFill size="16px" />
      </template>
      Github
    </t-link>
  </div>
</template>
