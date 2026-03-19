<template>
  <div :class="['widget-wrapper', { movable: movable }, { 'is-selected': movable && isSelected }]">
    <div class="widget-mask">
      <close-circle-outlined
        :class="['remove-icon', { 'hide-remove': hideRemove }]"
        @click="e => $emit('remove', e)"
      />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: '',
  props: {
    movable: {
      type: Boolean,
      default: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    hideRemove: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['remove'],
  setup() {
    const designerState = inject(designerStateInjectKey);
    return { designerState };
  },
});
</script>

<style lang="less" scoped>
.widget-wrapper {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(255, 255, 255, 0);
  cursor: pointer;
  &.movable:hover {
    border: 1px dashed #1890ff;
  }
  &.is-selected {
    border: 2px solid #1890ff !important;
  }
  .widget-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
    &:hover {
      .remove-icon {
        display: block;
      }
    }
    .remove-icon {
      position: absolute;
      top: 3px;
      right: 3px;
      display: none;
      color: rgba(24, 144, 255, 0.8);
      font-size: 16px;
      background-color: #fff;
      &.hide-remove {
        display: none !important;
      }
    }
  }
}
</style>
