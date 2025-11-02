<script setup lang="ts">
import { provide, ref } from 'vue';
import { PageHeader } from './components';
import { scrollWrapperKey } from '@/types';

defineOptions({
  name: 'PageLayout',
});

const scrollWrapper = ref<HTMLElement | null>(null);

provide(scrollWrapperKey, {
  scrollWrapper
});
</script>

<template>
  <div class="flex size-full flex-col">
    <div ref="scrollWrapper" class="flex grow flex-col overflow-y-auto overflow-x-hidden" style="scrollbar-gutter: stable">
      <div class="sticky top-0 z-10 shrink-0">
        <PageHeader />
      </div>
      <div class="box-border flex w-full grow items-start justify-center">
        <div class="size-full lg:max-w-2xl xl:max-w-4xl">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
