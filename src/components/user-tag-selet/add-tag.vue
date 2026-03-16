<template>
  <a-tooltip placement="top" title="选择用户" :get-popup-container="getPopupContainer">
    <div :class="['add-tag', { 'show-required': showRequired }]" @click="$emit('add-user')">
      <plus-outlined class="add-icon" />
    </div>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AddTag',
  props: {
    showRequired: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['add-user'],
  setup() {
    const getPopupContainer = (trigger: HTMLElement) => {
      return trigger.parentElement;
    };
    return { getPopupContainer };
  },
});
</script>

<style lang="less" scoped>
.add-tag {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 2px dashed rgba(50, 150, 250, 0.7);
  // border-radius: 6px;
  border-radius: 50%;
  cursor: pointer;
  .add-icon {
    color: rgba(50, 150, 250, 0.7);
    font-size: 18px;
  }

  &.show-required {
    &::before {
      position: absolute;
      /* top: -2px;
      right: -8px;
      display: flex;
      align-items: center;
      justify-content: center; */
      top: -5px;
      right: -6px;
      z-index: 2;
      width: 16px;
      height: 14px;
      color: red;
      font-size: 28px;
      line-height: 28px;
      background-color: #fff;
      content: '*';
    }
  }
}
</style>
