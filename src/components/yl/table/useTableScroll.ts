import { ref, nextTick } from 'vue';
import { useScroll, until } from '@vueuse/core';
export const useTableScroll = () => {
  const tableRef = ref(null);
  let scrollToBottom = null;
  let scrollToTop = null;
  let scrollTo = null;
  const initial = async () => {
    await until(tableRef).toMatch(v => !v);
    const table = tableRef.value.$el.querySelector('.ant-table-body');
    const { y } = useScroll(table, { behavior: 'smooth' });

    scrollToBottom = async () => {
      await nextTick();
      y.value = table.scrollHeight;
    };
    scrollToTop = async () => {
      await nextTick();
      y.value = 0;
    };
    scrollTo = async y => {
      await nextTick();
      y.value = y;
    };
  };

  initial();

  return {
    tableRef,
    /**滚到地步 */
    scrollToBottom: () => scrollToBottom?.(),
    /**滚到顶部 */
    scrollToTop: () => scrollToTop?.(),
    /**滚到指定位置 */
    scrollTo: y => scrollTo?.(y),
  };
};
