<script setup lang="tsx">
import { RiDeleteBin2Line, RiMoreLine } from '@remixicon/vue';
import type { IChatRecord } from '@/storage/chat';
import { computed } from 'vue';
import { DialogPlugin, DropdownOption, DropdownProps } from 'tdesign-vue-next';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';

type Emits = {
  (e: 'select', uuid: string): void
  (e: 'remove', uuid: string): void
}

interface IProps {
  list: IChatRecord[];
}

const { t } = useI18n();

const appStore = useAppStore();

const lang = computed(() => appStore.language);

// dayjs lang set
dayjs.locale(lang.value);
// extend relativeTime
dayjs.extend(relativeTime);

defineOptions({
  name: 'ChatHistory'
});

const emits = defineEmits<Emits>();
defineProps<IProps>();

const selected = defineModel<string>();

const options: DropdownProps['options'] = [
  {
    content: () => <span class="text-red-600">{ t('delete') }</span>,
    prefixIcon: () => <RiDeleteBin2Line size="16px" class="text-red-600" />,
    value: 'del',
  }
];

const onAction = (data: DropdownOption, item: IChatRecord) => {
  const { value } = data;
  console.log(data);
  switch (value) {
    case 'del': {
      const instance = DialogPlugin.confirm({
        header: t('tips.deleteHistoryHeader'),
        body: t('tips.deleteHistoryBody'),
        confirmBtn: t('delete'),
        cancelBtn: t('cancel'),
        theme: 'danger',
        onConfirm: async () => { 
          await onRemoveItem(item.uuid);
          instance.hide();
        }
      });
      break;
    }
  }
};

const onRemoveItem = async (uuid: string) => {
  emits('remove', uuid);
};

const onClickHistory = (uuid: string) => {
  selected.value = uuid;
  emits('select', uuid);
};
</script>

<template>
  <div class="relative flex size-full flex-col justify-between">
    <div class="flex grow">
      <div class="size-full max-h-full overflow-y-auto pb-4">
        <div v-if="!list.length" class="flex size-full items-center justify-center">
          <span class="text-zinc-400"></span>
        </div>
        <div v-else class="box-border h-full">
          <div class="flex flex-col gap-1">
            <div
              v-for="item in list"
              :key="item.uuid"
              class="cursor-pointer rounded-lg py-1 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
              :class="{ 'bg-zinc-200 dark:bg-zinc-800': selected === item.uuid }"
              @click="onClickHistory(item.uuid)"
            >
              <div class="relative flex size-full items-center justify-between">
                <span v-if="selected === item.uuid" class="absolute left-0 z-10 block h-4 w-0.5 rounded-lg bg-black"></span>
                <div class="flex grow flex-nowrap">
                  <span
                    class="w-full max-w-44 truncate px-2 py-1 text-sm text-black transition-all dark:text-white"
                    :class="{ 'font-bold': selected === item.uuid }"
                  >
                    {{ item.title }}
                  </span>
                </div>
                <div class="w-8 shrink-0" @click.stop>
                  <div class="flex size-8 items-center justify-center">
                    <t-dropdown :options="options" trigger="click" @click="(data: DropdownOption) => onAction(data, item)">
                      <t-button theme="default" variant="text" size="small" shape="square">
                        <RiMoreLine size="14" />
                      </t-button>
                    </t-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
