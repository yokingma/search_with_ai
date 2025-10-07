<script setup lang="ts">
import { PageFooter, PageHeader } from '.';

defineOptions({
  name: 'PageLayout',
});
</script>

<template>
  <div class="flex size-full flex-col">
    <PageHeader />
    <div class="grow">
      <router-view />
    </div>
    <PageFooter />
  </div>
</template>
