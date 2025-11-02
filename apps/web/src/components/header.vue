<script setup lang="ts">
import { RiChatHistoryLine, RiSunLine, RiMoonLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
import logoUrl from '@/assets/logo.png';
import ModelSelect from './models.vue';
import SearchEngineSelect from './engine.vue';
import LanguageSelect from './language.vue';
import { SwitchValue } from 'tdesign-vue-next';
import { useAppStore } from '../store';
import { useRouter } from 'vue-router';
import { ROUTE_NAME } from '@/constants';

defineOptions({
  name: 'PageHeader',
});

const appStore = useAppStore();
const { t } = useI18n();
const router = useRouter();

const onChangeTheme = (val: SwitchValue) => {
  if (val) appStore.updateTheme('dark');
  else appStore.updateTheme('light');
};

const backHome = () => {
  router.push({ name: ROUTE_NAME.HOME });
};
</script>

<template>
  <div class="flex items-center justify-between border-b bg-white/60 px-4 py-2 backdrop-blur-md dark:bg-black">
    <div class="flex shrink-0 flex-nowrap items-center gap-2">
      <div class="">
        <img :src="logoUrl" class="w-6 cursor-pointer" @click="backHome" />
      </div>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <ModelSelect />
      <div class="">
        <SearchEngineSelect />
      </div>
      <div class="">
        <LanguageSelect />
      </div>
      <t-button variant="text">
        <template #icon>
          <RiChatHistoryLine size="16px" />
        </template>
        <span class="ml-1 font-bold">{{ t('history') }}</span>
      </t-button>
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