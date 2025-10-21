<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface IProps {
  related?: string
  loading?: boolean
}

type Emits = {
  (e: 'select', query: string): void
}

defineOptions({
  name: 'ChatRelated',
});

const { t } = useI18n();

const props = defineProps<IProps>();
const emits = defineEmits<Emits>();
const onSelect = (query: string) => {
  const pretty = query.trim().replace(/^([0-9]|\*|-)(\.|\s)/, '').trim();
  emits('select', pretty);
};
const relatedArr = computed(() => {
  const list = props.related?.split('\n');
  return list ? list.filter((item) => !!item.trim()) : [];
});
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <t-skeleton animation="flashed" :row-col="[3]" :loading="loading && !relatedArr.length"></t-skeleton>
    <template v-if="relatedArr?.length">
      <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
        <t-tag
          v-for="(item, index) in relatedArr"
          :key="index"
          shape="square"
          theme="default"
          variant="light"
          max-width="full"
          @click="onSelect(item)"
        >
          <template #content>
            <div class="cursor-pointer truncate transition-all hover:opacity-60">{{ item }}</div>
          </template>
        </t-tag>
      </div>
    </template>
    <t-alert v-if="!relatedArr?.length && !loading" theme="info" :message="t('message.noRelated')" />
  </div>
</template>