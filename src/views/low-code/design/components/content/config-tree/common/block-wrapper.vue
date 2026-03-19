<template>
  <draggable :class="['block-wrapper', { 'is-selected': isSelected }]" v-bind="$attrs">
    <slot />
    <close-circle-outlined class="remove-icon" @click="e => $emit('remove', e)" />
  </draggable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Draggable } from '@/components/draggable';

export default defineComponent({
  name: '',
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove'],
  setup() {
    return {};
  },
  components: {
    Draggable,
  },
});
</script>

<style lang="less" scoped>
.block-wrapper {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 15px 10px;
  border: 1px dashed rgba(255, 255, 255, 0);
  cursor: pointer;
  &:hover {
    border: 1px dashed #1890ff;
    .remove-icon {
      display: block;
    }
  }
  &.is-selected {
    border: 2px solid #1890ff !important;
  }

  .remove-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 999;
    display: none;
    color: rgba(24, 144, 255, 0.8);
    font-size: 16px;
  }
}
</style>
