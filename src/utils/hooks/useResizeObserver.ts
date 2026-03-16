import { unref, onUnmounted, reactive, type Ref, watch } from 'vue';

interface TGObject {
  [key: string]: any;
}

export function useResizeObserver(target: Ref<Element | null> | Element) {
  const sizeObject = reactive({
    height: 0,
    width: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    x: 0,
    y: 0,
  });
  const initResizeObserver = () => {
    return new ResizeObserver(entries => {
      for (const entry of entries) {
        // 获取参数
        const { height, width, top, right, bottom, left, x, y } = entry.contentRect;
        Object.assign(sizeObject, {
          height,
          width,
          top,
          right,
          bottom,
          left,
          x,
          y,
        });
      }
    });
  };
  let resizeObserver: any = null;
  let tg: Element | TGObject | null = null;
  watch(target, () => {
    tg = unref(target);
    if (tg instanceof Element) {
      resizeObserver = initResizeObserver();
      resizeObserver.observe(tg);
    } else if (tg?.$el instanceof Element) {
      resizeObserver = initResizeObserver();
      resizeObserver.observe(tg?.$el);
    }
  });
  const unResizeObserver = () => {
    if (tg instanceof Element) {
      resizeObserver?.unobserve(tg);
    }
  };
  onUnmounted(() => {
    unResizeObserver();
  });
  return {
    sizeObject,
    unResizeObserver,
  };
}
