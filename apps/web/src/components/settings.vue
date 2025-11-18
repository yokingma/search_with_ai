<script setup lang="ts">
import { useAppStore } from '@/store';
import { computed } from 'vue';

const appStore = useAppStore();
const systemPrompt = computed({
  get: () => appStore.systemPrompt,
  set: (value: string) => {
    if (value.trim()) appStore.updateSystemPrompt(value);
  }
});

const temperature = computed({
  get: () => appStore.temperature,
  set: (val: number) => {
    appStore.updateTemperature(val);
  }
});

defineOptions({
  name: 'SystemSettings',
});
</script>

<template>
  <div class="flex size-full flex-col">
    <t-form label-align="top">
      <t-form-item :label="$t('systemPrompt')">
        <t-textarea
          v-model="systemPrompt"
          :maxlength="2048"
          placeholder=""
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </t-form-item>
      <t-form-item :label="$t('temperature')">
        <div class="w-full bg-black bg-opacity-5 rounded-md px-2">
          <t-slider
            v-model="temperature"
            :min="0"
            :max="2"
            :marks="[0, 1, 2]"
            :step="0.1"
            :show-step="true"
          />
        </div>
      </t-form-item>
    </t-form>
  </div>
</template>