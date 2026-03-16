import { reactive, watch, watchEffect, computed, type Ref, type CSSProperties } from 'vue';
import { useDraggable } from '@vueuse/core';

export default function useModalMove(
  modalTitleRef: Ref<HTMLElement>,
  state: { isMaximized: boolean; toMinimize: boolean; updateToMinimize: (val: boolean) => void },
) {
  const { x, y, isDragging } = useDraggable(modalTitleRef);
  const dragState = reactive({
    startX: 0,
    startY: 0,
    startedDrag: false,
    transformX: 0,
    transformY: 0,
    preTransformX: 0,
    preTransformY: 0,
    dragRect: { left: 0, right: 0, top: 0, bottom: 0 },
  });

  watch([x, y], () => {
    if (!state.isMaximized && !dragState.startedDrag) {
      dragState.startX = x.value;
      dragState.startY = y.value;
      const bodyRect = document.body.getBoundingClientRect();
      const titleRect = modalTitleRef.value.getBoundingClientRect();
      dragState.dragRect.right = bodyRect.width - titleRect.width;
      dragState.dragRect.bottom = bodyRect.height - titleRect.height;
      dragState.preTransformX = dragState.transformX;
      dragState.preTransformY = dragState.transformY;
    }
    dragState.startedDrag = true;
    state.updateToMinimize(false);
  });
  watch(isDragging, () => {
    if (!state.isMaximized && !isDragging) {
      dragState.startedDrag = false;
    }
  });
  watchEffect(
    () => {
      if (!state.isMaximized && !state.toMinimize && dragState.startedDrag) {
        dragState.transformX =
          dragState.preTransformX +
          Math.min(Math.max(dragState.dragRect.left, x.value), dragState.dragRect.right) -
          dragState.startX;
        dragState.transformY =
          dragState.preTransformY +
          Math.min(Math.max(dragState.dragRect.top, y.value), dragState.dragRect.bottom) -
          dragState.startY;
      }
    },
    { flush: 'post' },
  );
  const transformStyle = computed<CSSProperties>(() => {
    return state.isMaximized
      ? {}
      : {
          transform: `translate(${dragState.transformX}px, ${dragState.transformY}px)`,
        };
  });

  return {
    transformStyle,
  };
}
