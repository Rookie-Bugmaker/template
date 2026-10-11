<template>
  <!--
    CkBadge - CRRC UI 徽标组件
    基于 ant-design-vue Badge 封装，支持数字徽标 / 小圆点 / 状态徽标。

    @example
      <CkBadge :count="5">
        <BellOutlined />
      </CkBadge>
      <CkBadge dot>
        <BellOutlined />
      </CkBadge>
      <CkBadge status="success" text="运行中" />
  -->
  <a-badge
    v-bind="$attrs"
    :class="['ck-badge']"
    :count="count"
    :dot="dot"
    :status="status"
    :text="text"
    :overflow-count="overflowCount"
    :show-zero="showZero"
  >
    <slot />
  </a-badge>
</template>

<script setup lang="ts">
/**
 * CkBadge
 *
 * 对 ant-design-vue Badge 的二次封装，统一 CRRC 配色。
 *
 * 支持的 props：
 * - count: number（数字徽标）
 * - dot: boolean（小圆点模式）
 * - status: 'success' | 'error' | 'warning' | 'processing' | 'default'
 * - text: string（状态徽标文字）
 * - overflowCount: number（默认 99，超出显示 "99+"）
 * - showZero: boolean（count=0 时是否显示）
 */
defineOptions({ name: 'CkBadge' });

const props = withDefaults(
  defineProps<{
    count?: number;
    dot?: boolean;
    status?: 'success' | 'error' | 'warning' | 'processing' | 'default';
    text?: string;
    overflowCount?: number;
    showZero?: boolean;
  }>(),
  {
    overflowCount: 99,
    showZero: false,
  }
);
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkBadge 样式
 *  遵循 ui-design.md 3.14 徽标设计规范
 * ============================================================ */

.ck-badge {
  /* 数字徽标样式：圆角胶囊、白色文字 */
  :deep(.ant-badge-count) {
    background-color: var(--ck-error);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    border-radius: var(--ck-radius-full);
    box-shadow: none;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
  }

  /* 小圆点：8px 直径 */
  :deep(.ant-badge-dot) {
    width: 8px;
    height: 8px;
    background-color: var(--ck-error);
  }

  /* processing 状态点使用主色 */
  :deep(.ant-badge-status-processing) {
    background-color: var(--ck-primary);
  }
}
</style>
