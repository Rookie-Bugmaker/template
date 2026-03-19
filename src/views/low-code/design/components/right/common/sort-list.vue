<template>
  <drag-container
    tag="div"
    class="sort-list"
    drag-handle-selector=".sort-item .drag-icon"
    @drop="({ removedIndex, addedIndex }) => $emit('move', { removedIndex, addedIndex })"
  >
    <slot />
  </drag-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Container as DragContainer } from '@/components/draggable';

export default defineComponent({
  name: '',
  emits: ['move'],
  setup() {
    return {};
  },
  components: {
    DragContainer,
  },
});
</script>

<style lang="less" scoped>
.sort-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
</style>
