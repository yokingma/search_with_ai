<script setup lang="ts">
import { RiSunLine, RiMoonLine } from '@remixicon/vue';
import ModelSelect from './models.vue';
import SearchEngineSelect from './engine.vue';
import LanguageSelect from './language.vue';
import { SwitchValue } from 'tdesign-vue-next';
import { useAppStore } from '../store';



defineOptions({
  name: 'PageHeader',
});

const appStore = useAppStore();



const onChangeTheme = (val: SwitchValue) => {
  if (val) appStore.updateTheme('dark');
  else appStore.updateTheme('light');
};
</script>

<template>
  <div class="flex items-center justify-between bg-white/60 px-4 py-2 backdrop-blur-md dark:bg-black">
    <div class="flex shrink-0 flex-nowrap items-center gap-2">
      <ModelSelect />
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <div class="">
        <SearchEngineSelect />
      </div>
      <div class="">
        <LanguageSelect />
      </div>
      <div class="flex flex-row gap-2">
        <t-switch class="w-12" size="large" :default-value="appStore.theme === 'dark'" @change="onChangeTheme">
          <template #label="slotProps">
            <template v-if="slotProps.value">
              <RiMoonLine size="14" />
            </template>
            <template v-else>
              <RiSunLine size="14" />
            </template>
          </template>
        </t-switch>
      </div>
    </div>
  </div>
</template>