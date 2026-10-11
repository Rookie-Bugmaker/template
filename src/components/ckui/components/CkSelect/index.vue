<template>
  <!--
    CkSelect - CRRC UI 选择器组件
    基于 ant-design-vue Select 封装，支持单选 / 多选 / 可搜索 / 分组。

    @example
      <CkSelect v-model:value="val" :options="options" placeholder="请选择" />
      <CkSelect v-model:value="val" mode="multiple" :options="options" />
  -->
  <a-select
    v-bind="$attrs"
    :class="['ck-select', statusClass]"
    :value="modelValue"
    :options="options"
    :status="status"
    @update:value="handleUpdate"
  >
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon" />
    </template>
    <template v-if="$slots.option" #option="optionProps">
      <slot name="option" v-bind="optionProps" />
    </template>
  </a-select>
</template>

<script setup lang="ts">
/**
 * CkSelect
 *
 * 对 ant-design-vue Select 的二次封装，统一 CRRC 聚焦 / 错误 / 成功样式。
 *
 * 支持的 props：
 * - modelValue (v-model:value)
 * - options: SelectProps['options']
 * - mode: 'multiple' | 'tags' | undefined
 * - status: 'error' | 'success' | undefined
 * - showSearch: boolean
 * - allowClear: boolean
 * - placeholder: string
 */
import { computed } from 'vue';
import type { SelectProps } from 'ant-design-vue';

defineOptions({ name: 'CkSelect' });

const props = defineProps<{
  /** 当前选中值（v-model:value） */
  modelValue?: any;
  /** 选项列表 */
  options?: SelectProps['options'];
  /** 校验状态 */
  status?: 'error' | 'success';
}>();

const emit = defineEmits<{
  'update:value': [value: any];
}>();

/** 状态样式类名 */
const statusClass = computed(() => (props.status ? `ck-select--${props.status}` : ''));

function handleUpdate(val: any) {
  emit('update:value', val);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkSelect 样式
 *  遵循 ui-design.md 3.4 选择器设计规范
 * ============================================================ */

.ck-select {
  /* ---- 触发区域圆角 ---- */
  :deep(.ant-select-selector) {
    border-radius: var(--ck-radius-sm) !important;
    font-size: 15px;
  }

  /* ---- 聚焦态：主色边框 + 光环 ---- */
  :deep(.ant-select-focused .ant-select-selector) {
    border-color: var(--ck-primary) !important;
    box-shadow: 0 0 0 3px var(--ck-focus-ring) !important;
  }

  /* ---- 悬停态：边框加深 ---- */
  :deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
    border-color: var(--ck-border-strong);
  }
}

/* 错误状态 */
.ck-select--error {
  :deep(.ant-select-selector) {
    border-color: var(--ck-error) !important;
  }
}

/* 成功状态 */
.ck-select--success {
  :deep(.ant-select-selector) {
    border-color: var(--ck-success) !important;
  }
}

/* ---- 下拉面板样式 ---- */
:deep(.ant-select-dropdown) {
  border-radius: var(--ck-radius-md);
  box-shadow: var(--ck-shadow-hover);

  /* 选中项 */
  .ant-select-item-option-selected {
    background-color: var(--ck-primary-bg) !important;
    color: var(--ck-primary);
    font-weight: 600;
  }

  /* 悬停项 */
  .ant-select-item-option-active {
    background-color: var(--ck-primary-bg) !important;
  }
}
</style>
