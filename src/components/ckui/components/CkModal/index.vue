<template>
  <!--
    CkModal - CRRC UI 模态框组件
    基于 ant-design-vue Modal 封装，统一 CRRC 品牌弹窗样式。

    @example
      <CkModal v-model:open="visible" title="确认操作" @ok="handleOk">
        确认要执行此操作吗？
      </CkModal>
  -->
  <a-modal
    v-bind="$attrs"
    :class="['ck-modal']"
    :open="open"
    :title="title"
    :width="width"
    :confirm-loading="confirmLoading"
    :ok-text="okText"
    :cancel-text="cancelText"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
/**
 * CkModal
 *
 * 对 ant-design-vue Modal 的二次封装，新增：
 * - 统一 CRRC 圆角（12px）/ 阴影 / 标题样式
 * - 确认按钮使用主色
 *
 * 支持的 props：
 * - open (v-model:open)
 * - title: string
 * - width: number | string（默认 520）
 * - confirmLoading: boolean
 * - okText / cancelText: string
 */
defineOptions({ name: 'CkModal' });

const props = withDefaults(
  defineProps<{
    /** 是否显示弹窗 */
    open?: boolean;
    /** 弹窗标题 */
    title?: string;
    /** 弹窗宽度 */
    width?: number | string;
    /** 确认按钮加载态 */
    confirmLoading?: boolean;
    /** 确认按钮文字 */
    okText?: string;
    /** 取消按钮文字 */
    cancelText?: string;
  }>(),
  {
    width: 520,
    okText: '确认',
    cancelText: '取消',
  }
);

const emit = defineEmits<{
  ok: [e: MouseEvent];
  cancel: [e: MouseEvent];
  'update:open': [value: boolean];
}>();

function handleOk(e: MouseEvent) {
  emit('ok', e);
}

function handleCancel(e: MouseEvent) {
  emit('cancel', e);
  emit('update:open', false);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkModal 样式
 *  遵循 ui-design.md 3.23 模态框设计规范
 * ============================================================ */

:global(.ck-modal) {
  /* 弹窗圆角 */
  .ant-modal-content {
    border-radius: var(--ck-radius-lg, 12px);
    box-shadow: var(--ck-shadow-modal, 0 8px 24px rgba(0, 0, 0, 0.12));
    overflow: hidden;
  }

  /* 标题样式：H3 22px SemiBold */
  .ant-modal-title {
    font-size: 22px;
    font-weight: 600;
    color: var(--ck-text-primary);
  }

  /* 标题栏高度 56px */
  .ant-modal-header {
    padding: var(--ck-space-4) var(--ck-space-6);
    min-height: 56px;
  }

  /* 内容区内边距 24px */
  .ant-modal-body {
    padding: var(--ck-space-6);
    font-size: 15px;
  }

  /* 底部操作栏高度 64px */
  .ant-modal-footer {
    padding: var(--ck-space-4) var(--ck-space-6);
    min-height: 64px;
  }

  /* 确认按钮使用主色 */
  .ant-btn-primary {
    background-color: var(--ck-primary) !important;
    border-color: var(--ck-primary) !important;

    &:hover {
      background-color: var(--ck-primary-hover) !important;
      border-color: var(--ck-primary-hover) !important;
    }
  }

  /* 取消按钮使用默认样式 */
  .ant-btn-default {
    border-color: var(--ck-border-default);
    color: var(--ck-text-primary);

    &:hover {
      border-color: var(--ck-primary);
      color: var(--ck-primary);
    }
  }
}
</style>
