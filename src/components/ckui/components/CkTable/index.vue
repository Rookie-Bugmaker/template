<template>
  <!--
    CkTable - CRRC UI 表格组件
    基于 ant-design-vue Table 封装，支持排序 / 筛选 / 分页 / 行选择等。

    @example
      <CkTable
        :columns="columns"
        :data-source="data"
        :pagination="{ pageSize: 10 }"
        row-selection
      />
  -->
  <a-table
    v-bind="$attrs"
    :class="['ck-table', tableClass]"
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    :row-selection="rowSelection"
    :size="size"
    :bordered="bordered"
  >
    <!--
      不使用 v-for 通用 slot 转发，Vue 3.3 下会导致 renderSlot null key 报错。
      改为显式转发 a-table 常用的命名插槽，覆盖大多数业务场景。
    -->
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.bodyCell" #bodyCell="cellProps">
      <slot name="bodyCell" v-bind="cellProps" />
    </template>
    <template v-if="$slots.headerCell" #headerCell="cellProps">
      <slot name="headerCell" v-bind="cellProps" />
    </template>
    <template v-if="$slots.customFilterDropdown" #customFilterDropdown="filterProps">
      <slot name="customFilterDropdown" v-bind="filterProps" />
    </template>
    <template v-if="$slots.customFilterIcon" #customFilterIcon="iconProps">
      <slot name="customFilterIcon" v-bind="iconProps" />
    </template>
    <template v-if="$slots.expandedRowRender" #expandedRowRender="rowProps">
      <slot name="expandedRowRender" v-bind="rowProps" />
    </template>
    <template v-if="$slots.summary" #summary="summaryProps">
      <slot name="summary" v-bind="summaryProps" />
    </template>
    <template v-if="$slots.emptyText" #emptyText>
      <slot name="emptyText" />
    </template>
  </a-table>
</template>

<script setup lang="ts">
/**
 * CkTable
 *
 * 对 ant-design-vue Table 的二次封装，统一 CRRC 表头 / 行悬停 / 选中样式。
 *
 * 支持的 props（继承 a-table 全部属性）：
 * - columns: ColumnsType
 * - dataSource: any[]
 * - pagination: object | false
 * - loading: boolean
 * - rowSelection: object（行选择配置）
 * - size: 'large' | 'middle' | 'small'
 * - bordered: boolean（是否带边框）
 * - striped: boolean（是否斑马纹）
 */
import { computed } from 'vue';
import type { TableProps } from 'ant-design-vue';

defineOptions({ name: 'CkTable' });

const props = withDefaults(
  defineProps<{
    columns?: TableProps['columns'];
    dataSource?: TableProps['dataSource'];
    pagination?: TableProps['pagination'];
    loading?: boolean;
    rowSelection?: any;
    size?: 'large' | 'middle' | 'small';
    bordered?: boolean;
    striped?: boolean;
  }>(),
  { size: 'middle' }
);

/** 斑马纹类名 */
const tableClass = computed(() => (props.striped ? 'ck-table--striped' : ''));
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkTable 样式
 *  遵循 ui-design.md 3.17 表格设计规范
 *  参照 CRRC_UI_Library.html 表格样式调整
 * ============================================================ */

.ck-table {
  /* 容器圆角 + 阴影 */
  border-radius: var(--ck-radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  /* ---- 表头样式：灰色背景，大写加粗，参照 HTML 规范 ---- */
  :deep(.ant-table-thead > tr > th) {
    background-color: #f9fafb !important;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--ck-text-tertiary, #9ca3af);
    border-color: var(--ck-border-default);
    padding: 12px 20px;
    height: 48px;
    white-space: nowrap;
  }

  /* ---- 行样式：充裕的行高和内边距 ---- */
  :deep(.ant-table-tbody > tr > td) {
    font-size: 14px;
    color: var(--ck-text-primary);
    border-color: var(--ck-border-default);
    padding: 14px 20px;
    transition: background-color 0.2s ease;
  }

  /* 行悬停：浅主色背景，带过渡动画 */
  :deep(.ant-table-tbody > tr:hover > td) {
    background-color: var(--ck-primary-bg) !important;
  }

  /* 选中行：浅主色背景 */
  :deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
    background-color: var(--ck-primary-bg) !important;
  }

  /* ---- 排序图标高亮（激活态使用主色） ---- */
  :deep(.ant-table-column-sorter-up.active),
  :deep(.ant-table-column-sorter-down.active) {
    color: var(--ck-primary) !important;
  }

  /* ---- 筛选图标：激活时使用主色 ---- */
  :deep(.ant-table-filter-trigger.active) {
    color: var(--ck-primary) !important;
  }

  :deep(.ant-table-filter-trigger:hover) {
    color: var(--ck-primary-hover) !important;
  }

  /* ---- Checkbox 选中色 ---- */
  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: var(--ck-primary) !important;
    border-color: var(--ck-primary) !important;
  }

  /* ---- 分页器样式 ---- */
  :deep(.ant-table-pagination) {
    margin-top: var(--ck-space-4);
    padding: 12px 20px;
    border-top: 1px solid var(--ck-border-default);
    margin-bottom: 0 !important;
  }

  :deep(.ant-pagination-item-active) {
    background-color: var(--ck-primary) !important;
    border-color: var(--ck-primary) !important;

    /* 页码数字颜色：白色，确保红色主题下可读 */
    a {
      color: #fff !important;
    }

    /* hover 态保持白字 */
    &:hover a {
      color: #fff !important;
    }
  }

  /* 分页器总数文字 */
  :deep(.ant-pagination-total-text) {
    color: var(--ck-text-secondary);
    font-size: 13px;
  }

  /* 空数据态 */
  :deep(.ant-empty-description) {
    color: var(--ck-text-tertiary);
    font-size: 13px;
  }
}

/* 斑马纹样式 */
.ck-table--striped {
  :deep(.ant-table-tbody > tr:nth-child(even) > td) {
    background-color: #f9fafb;
  }
}
</style>
