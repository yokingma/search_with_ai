<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const visible = defineModel<boolean>({
  default: false,
});
</script>

<script lang="ts">
export default {
  name: 'ChatPage',
};
</script>

<template>
  <!--eslint-disable-next-line vue/no-v-model-argument-->
  <t-drawer v-model:visible="visible" :size-draggable="true" size="50%" placement="left" :footer="false" :header="t('chat')">
    <p>This is a Drawer</p>
  </t-drawer>
</template>