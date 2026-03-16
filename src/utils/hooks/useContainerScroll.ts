import { ref } from 'vue';
import { useScroll } from '@vueuse/core';

export const useContainerScroll = () => {
  const container = ref(null);
  const { y, ...state } = useScroll(container, { behavior: 'smooth' });

  const scrollToBottom = () => {
    if (container.value) {
      y.value = container.value.scrollHeight;
    }
  };

  return {
    state,

    container,
    scrollToBottom,
  };
};
