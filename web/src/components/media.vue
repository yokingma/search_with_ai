<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RiArrowRightSLine, RiArrowDownSLine } from '@remixicon/vue';

interface IProps {
  sources?: Record<string, any>[];
  loading: boolean;
}

const { t } = useI18n();

const mediaRef = ref<HTMLDivElement | null>(null);
const unfold = ref(false);

const props = defineProps<IProps>();

const images = computed(() => {
  if (!props.sources) return [];
  if (props.sources.length <= 16) return props.sources;
  return props.sources.slice(0, 16);
});

const onFold = () => {
  unfold.value = !unfold.value;
  if (!mediaRef.value) return;
  if (!unfold.value) {
    mediaRef.value.style.height = '84px';
    mediaRef.value.style.overflow = 'hidden';
  } else {
    mediaRef.value.style.height = 'auto';
    mediaRef.value.style.overflow = 'normal';
  }
};

onMounted(() => {
  if (!mediaRef.value) return;
  mediaRef.value.style.height = '84px';
  mediaRef.value.style.overflow = 'hidden';
});
const rowCol = [
  [
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' },
    { width: '12.5%', height: '64px', borderRadius: '6px' }
  ]
];
</script>

<script lang="ts">
export default {
  name: 'ChatMedia'
};
</script>

<template>
  <div class="w-full">
    <div class="flex flex-nowrap justify-between py-4">
      <div class="text-sm font-bold text-black dark:text-gray-300">
        {{ t('media') }}
      </div>
      <t-button variant="text" shape="square" :disabled="loading" @click="onFold">
        <template #icon>
          <RiArrowRightSLine v-if="unfold" />
          <RiArrowDownSLine v-else />
        </template>
      </t-button>
    </div>
    <t-skeleton :row-col="rowCol" animation="flashed" :loading="!sources?.length && loading"></t-skeleton>
    <div v-if="sources?.length === 0 && !loading">
      <t-alert theme="info" :message="t('message.sourceError')" close>
        <template #operation>
        </template>
      </t-alert>
    </div>
    <div v-if="images.length" id="chat-media" ref="mediaRef" class="grid w-full grid-cols-4 gap-2 transition-all duration-300 md:grid-cols-8">
      <div v-for="item in images" :key="item.id" class="hover:opacity-80">
        <t-popup :content="item.name">
          <div class="flex flex-col gap-1">
            <t-image-viewer :close-on-overlay="true" :images="[item.img]">
              <template #trigger="{ open }">
                <t-image
                  :src="item.thumbnail"
                  :lazy="true"
                  fit="cover"
                  shape="round"
                  class="h-16"
                  @click="open"
                />
              </template>
            </t-image-viewer>
            <a :href="item.url" target="_blank" class="h-6 truncate text-zinc-600 hover:text-zinc-500 dark:text-zinc-400">
              {{ item.name }}
            </a>
          </div>
        </t-popup>
      </div>
    </div>
  </div>
</template>

<style scoped>
#chat-media {
  font-size: 12px;
}
</style>