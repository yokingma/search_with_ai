<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useAppStore } from '../store';
import { useI18n } from 'vue-i18n';
import { Provider } from 'src/interface';

const appStore = useAppStore();
const provider = ref(appStore.localProvider);
const providers = ref<Provider[]>([]);
const loading = ref(false);

const { t } = useI18n();

const onModelSelect = (val: any) => {
  appStore.updateLocalProvider(val);
};

watch(() => appStore.enableLocal, async (val) => {
  if (val) {
    await listProviders();
  }
});

onMounted(async () => {
  if (appStore.enableLocal) await listProviders();
  if (appStore.localProvider) {
    provider.value = appStore.localProvider;
  } else {
    provider.value = providers.value[0];
  }
});

async function listProviders() {
  providers.value = ['ollama', 'lmstudio'];
  loading.value = false;
}
</script>

<script lang="ts">
export default {
  name: 'LocalProviderSelect'
};
</script>

<template>
  <t-select v-model="provider" :disabled="!appStore.enableLocal" :loading="loading" :label="t('PROVIDER')"
    :placeholder="t('selectProvider')" @change="onModelSelect">
    <t-option v-for="(item, index) in providers" :key="index" :value="item" :label="item"></t-option>
  </t-select>
</template>
