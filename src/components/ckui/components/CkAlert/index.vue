<template>
  <!--
    CkAlert - CRRC UI 警告提示组件
    基于 ant-design-vue Alert 封装，支持 info / success / warning / error 四种类型。

    @example
      <CkAlert type="info" message="提示信息" />
      <CkAlert type="error" message="错误标题" description="详细描述内容" closable />
  -->
  <a-alert
    v-bind="$attrs"
    :class="['ck-alert', `ck-alert--${type}`]"
    :type="type"
    :message="message"
    :description="description"
    :closable="closable"
    :show-icon="showIcon"
    @close="handleClose"
  >
    <template v-if="$slots.message" #message>
      <slot name="message" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </a-alert>
</template>

<script setup lang="ts">
/**
 * CkAlert
 *
 * 对 ant-design-vue Alert 的二次封装，统一 CRRC 状态配色方案。
 *
 * 支持的 props：
 * - type: 'info' | 'success' | 'warning' | 'error'
 * - message: string（主提示文字）
 * - description: string（详细描述）
 * - closable: boolean（是否可关闭）
 * - showIcon: boolean（默认 true，显示左侧图标）
 */
import { computed } from 'vue';

defineOptions({ name: 'CkAlert' });

const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'error';
    message?: string;
    description?: string;
    closable?: boolean;
    showIcon?: boolean;
  }>(),
  {
    type: 'info',
    showIcon: true,
  }
);

const emit = defineEmits<{
  close: [e: MouseEvent];
}>();

function handleClose(e: MouseEvent) {
  emit('close', e);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkAlert 样式
 *  遵循 ui-design.md 3.22 警告提示设计规范
 *
 *  各类型配色参照设计文档状态色值对照表：
 *  Info    → 蓝底蓝边
 *  Success → 绿底绿边
 *  Warning → 橙底橙边
 *  Error   → 红底红边
 * ============================================================ */

.ck-alert {
  border-radius: var(--ck-radius-md);
  padding: var(--ck-space-3) var(--ck-space-4);
  font-size: 15px;

  /* Info：蓝色系 */
  &--info {
    background-color: #eff6ff;
    border-color: #93c5fd;

    :deep(.ant-alert-message) {
      color: #1e40af;
    }
    :deep(.ant-alert-icon) {
      color: #3b82f6;
    }
  }

  /* Success：绿色系 */
  &--success {
    background-color: #ecfdf5;
    border-color: #6ee7b7;

    :deep(.ant-alert-message) {
      color: #065f46;
    }
    :deep(.ant-alert-icon) {
      color: #10b981;
    }
  }

  /* Warning：橙色系 */
  &--warning {
    background-color: #fff7ed;
    border-color: #fdba74;

    :deep(.ant-alert-message) {
      color: #9a3412;
    }
    :deep(.ant-alert-icon) {
      color: #f97316;
    }
  }

  /* Error：红色系 */
  &--error {
    background-color: #fef2f2;
    border-color: #fca5a5;

    :deep(.ant-alert-message) {
      color: #991b1b;
    }
    :deep(.ant-alert-icon) {
      color: #ef4444;
    }
  }

  /* 标题字体加粗 */
  :deep(.ant-alert-message) {
    font-weight: 600;
  }

  /* 描述文字 */
  :deep(.ant-alert-description) {
    font-size: 13px;
    margin-top: var(--ck-space-1);
  }
}
</style>
