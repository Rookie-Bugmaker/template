<template>
  <a-tooltip
    :open="hoverTip && tipType === 'tooltip' ? undefined : false"
    :placement="placement"
    :color="color"
    destroy-tooltip-on-hide
    auto-adjust-overflow
    :mouse-enter-delay="mouseEnterDelay"
    :get-popup-container="getPopupContainer"
  >
    <template #title>
      <slot name="default">{{ content }}</slot>
    </template>
    <div
      :class="{ line: row === 1, lines: row > 1 }"
      :title="hoverTip && tipType === 'title' ? content : null"
      :style="{ '--row': row }"
      v-bind="$attrs"
    >
      <slot name="pre"></slot>
      <slot name="default">{{ content }}</slot>
    </div>
  </a-tooltip>
</template>

<script lang="ts">
//超出指定行数自动隐藏文字
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { TooltipPlacement } from 'ant-design-vue/lib/tooltip';

export default defineComponent({
  name: 'Ellipsis',
  inheritAttrs: false,
  props: {
    // 行数：超长后自动换行，超过行数之后省略
    row: {
      type: Number,
      default: 1,
    },
    //是否开启tip
    hoverTip: {
      type: Boolean,
      default: true,
    },
    //tips展示方式，tooltip ：a-tooltip,title:原生title
    tipType: {
      type: String as PropType<'tooltip' | 'title'>,
      default: 'tooltip',
    },
    //tooltip模式下，气泡框位置
    placement: {
      type: String as PropType<TooltipPlacement>,
      default: 'top',
    },
    mouseEnterDelay: {
      type: Number,
      default: 0.1,
    },
    getPopupContainer: {
      type: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
      default: () => document.body,
    },
    //tooltip模式下，背景颜色
    color: {
      type: String,
      default: '',
    },
    //内容，也可以使用默认插槽
    content: {
      type: String,
      default: '',
    },
  },
  setup() {},
});
</script>

<style lang="less" scoped>
.line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.lines {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-line-clamp: var(--row);
  -webkit-box-orient: vertical;
}
</style>
