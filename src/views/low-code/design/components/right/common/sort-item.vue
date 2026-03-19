<template>
  <draggable tag="div" class="sort-item">
    <div class="drag-icon">
      <holder-outlined />
    </div>
    <div class="item-content">
      <slot name="default" />
    </div>
    <div class="item-action">
      <slot name="action" />
    </div>
  </draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Draggable } from '@/components/draggable';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    Draggable,
  },
});
</script>

<style lang="less" scoped>
.sort-item {
  display: flex !important;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 35px;
  margin-bottom: 8px;
  padding: 0 8px 0 4px;
  background-color: #f6f7f8;
  border-radius: 4px;
  .drag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 35px;
    color: #bbc3cd;
    cursor: move;
  }
  .item-content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    padding: 5px 10px 5px 5px;
  }
  .item-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
}
</style>
