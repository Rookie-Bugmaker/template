<template>
  <!--
    CkDrawer - CRRC UI 抽屉组件
    基于 ant-design-vue Drawer 封装，支持右 / 左 / 上 / 下四方向抽屉。

    @example
      <CkDrawer v-model:open="visible" title="详情">
        抽屉内容
      </CkDrawer>
  -->
  <a-drawer
    v-bind="$attrs"
    :class="['ck-drawer']"
    :open="open"
    :title="title"
    :width="width"
    :height="height"
    :placement="placement"
    :closable="closable"
    :mask-closable="maskClosable"
    @close="handleClose"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <slot />
  </a-drawer>
</template>

<script setup lang="ts">
/**
 * CkDrawer
 *
 * 对 ant-design-vue Drawer 的二次封装，统一 CRRC 圆角 / 阴影 / 标题样式。
 *
 * 支持的 props：
 * - open (v-model:open)
 * - title: string
 * - width: number | string（默认 400）
 * - height: number | string（上下抽屉时使用）
 * - placement: 'right' | 'left' | 'top' | 'bottom'
 * - closable: boolean（是否显示关闭按钮）
 * - maskClosable: boolean（点击遮罩是否关闭，默认 true）
 */
defineOptions({ name: 'CkDrawer' });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    title?: string;
    width?: number | string;
    height?: number | string;
    placement?: 'right' | 'left' | 'top' | 'bottom';
    closable?: boolean;
    maskClosable?: boolean;
  }>(),
  {
    width: 400,
    placement: 'right',
    closable: true,
    maskClosable: true,
  }
);

const emit = defineEmits<{
  close: [e: Event];
  'update:open': [value: boolean];
}>();

function handleClose(e: Event) {
  emit('close', e);
  emit('update:open', false);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkDrawer 样式
 *  遵循 ui-design.md 3.24 抽屉设计规范
 * ============================================================ */

:global(.ck-drawer) {
  /* 抽屉面板圆角（右侧/左侧抽屉） */
  .ant-drawer-content-wrapper {
    box-shadow: var(--ck-shadow-modal);
  }

  /* 右侧抽屉：左上右下圆角 */
  .ant-drawer-right .ant-drawer-content-wrapper {
    border-radius: var(--ck-radius-lg) 0 0 var(--ck-radius-lg);
  }

  /* 左侧抽屉：右上左下圆角 */
  .ant-drawer-left .ant-drawer-content-wrapper {
    border-radius: 0 var(--ck-radius-lg) var(--ck-radius-lg) 0;
  }

  /* 标题样式：H3 22px SemiBold */
  .ant-drawer-title {
    font-size: 22px;
    font-weight: 600;
    color: var(--ck-text-primary);
  }

  /* 标题栏高度 56px */
  .ant-drawer-header {
    padding: var(--ck-space-4) var(--ck-space-6);
    min-height: 56px;
    border-bottom: 1px solid var(--ck-border-default);
  }

  /* 内容区内边距 24px */
  .ant-drawer-body {
    padding: var(--ck-space-6);
    font-size: 15px;
  }

  /* 底部操作栏 */
  .ant-drawer-footer {
    padding: var(--ck-space-4) var(--ck-space-6);
    min-height: 64px;
    border-top: 1px solid var(--ck-border-default);
  }

  /* 关闭按钮样式 */
  .ant-drawer-close {
    font-size: 18px;
    color: var(--ck-text-secondary);

    &:hover {
      color: var(--ck-text-primary);
    }
  }
}
</style>
