<template>
  <!--
    CkSteps - CRRC UI 步骤条组件
    基于 ant-design-vue Steps 封装，统一 CRRC 流程步骤配色。

    @example
      <CkSteps :current="1">
        <CkStep title="步骤一" description="描述" />
        <CkStep title="步骤二" description="描述" />
        <CkStep title="步骤三" description="描述" />
      </CkSteps>
  -->
  <a-steps
    v-bind="$attrs"
    :class="['ck-steps']"
    :current="current"
    :direction="direction"
    :size="size"
    :status="status"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </a-steps>
</template>

<script setup lang="ts">
/**
 * CkSteps
 *
 * 对 ant-design-vue Steps 的二次封装，统一 CRRC 步骤配色方案：
 * - 进行中：主色
 * - 已完成：success 色（绿色）
 * - 等待：灰色
 *
 * 支持的 props：
 * - current: number（当前步骤索引，从 0 开始）
 * - direction: 'horizontal' | 'vertical'
 * - size: 'default' | 'small'
 * - status: 'wait' | 'process' | 'finish' | 'error'
 */
import { computed } from 'vue';

defineOptions({ name: 'CkSteps' });

const props = withDefaults(
  defineProps<{
    current?: number;
    direction?: 'horizontal' | 'vertical';
    size?: 'default' | 'small';
    status?: 'wait' | 'process' | 'finish' | 'error';
  }>(),
  {
    direction: 'horizontal',
    size: 'default',
  }
);
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkSteps 样式
 *  遵循 ui-design.md 3.19 步骤条设计规范
 * ============================================================ */

.ck-steps {
  /* 进行中步骤：主色圆 + 主色文字 */
  :deep(.ant-steps-item-process .ant-steps-item-icon) {
    background-color: var(--ck-primary) !important;
    border-color: var(--ck-primary) !important;
  }

  :deep(.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: var(--ck-primary) !important;
    font-weight: 600;
  }

  /* 已完成步骤：success 绿色 */
  :deep(.ant-steps-item-finish .ant-steps-item-icon) {
    border-color: var(--ck-success) !important;
    background-color: transparent !important;
  }

  :deep(.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon) {
    color: var(--ck-success) !important;
  }

  :deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: var(--ck-text-primary);
  }

  /* 已完成步骤的连接线 */
  :deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after) {
    background-color: var(--ck-success) !important;
  }

  /* 等待步骤：灰色 */
  :deep(.ant-steps-item-wait .ant-steps-item-icon) {
    background-color: #f3f4f6 !important;
    border-color: var(--ck-border-strong) !important;
  }

  :deep(.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title) {
    color: var(--ck-text-tertiary);
  }

  /* 错误步骤：红色 */
  :deep(.ant-steps-item-error .ant-steps-item-icon) {
    border-color: var(--ck-error) !important;
  }

  :deep(.ant-steps-item-error .ant-steps-item-icon > .ant-steps-icon) {
    color: var(--ck-error) !important;
  }

  /* 步骤指示圆直径：32px */
  :deep(.ant-steps-item-icon) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 15px;
    font-weight: 600;
  }

  /* 连接线高度 2px */
  :deep(.ant-steps-item-tail::after) {
    height: 2px;
  }
}
</style>
