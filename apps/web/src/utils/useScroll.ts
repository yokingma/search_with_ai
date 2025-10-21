import { useThrottleFn } from '@vueuse/core';
import { ComponentPublicInstance } from 'vue';

/**
 * @description 全局ScrollBar滚动, 全局内容滚动 layouts/main.vue定义ref=mainContentWrap
 */

export interface IUseScrollOptions {
  target?: ComponentPublicInstance | HTMLElement | null
  ms?: number
  offsetTop?: number
}

// scroll to bottom
export async function useScrollToBottom (options: IUseScrollOptions): Promise<void> {
  const { target, ms = 1000, offsetTop = 0 } = options;

  if (target === null || target === undefined) return;

  const scrollWrapper = target instanceof HTMLElement ? target : (target.$el as HTMLElement);

  await useThrottleFn(() => {
    scrollWrapper.scrollTo({
      top: scrollWrapper.scrollHeight - offsetTop
    });
  }, ms)();
}

// scroll to top
export function useScrollToTop (options: IUseScrollOptions): void {
  const { target } = options;
  if (target === null || target === undefined) return;

  const scrollWrapper = target instanceof HTMLElement ? target : (target.$el as HTMLElement);

  scrollWrapper.scrollTo({
    top: 0
  });
}
