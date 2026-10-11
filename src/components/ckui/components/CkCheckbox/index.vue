<template>
  <!--
    CkCheckbox - CRRC UI 多选框组件
    基于 ant-design-vue Checkbox 封装，支持单个多选框和多选框组。

    @example
      <CkCheckbox v-model:checked="checked">同意协议</CkCheckbox>
      <CkCheckboxGroup v-model:value="values" :options="options" />
  -->
  <a-checkbox
    v-bind="$attrs"
    :class="['ck-checkbox']"
    :checked="checked"
    @update:checked="handleUpdate"
  >
    <slot />
  </a-checkbox>
</template>

<script setup lang="ts">
/**
 * CkCheckbox
 *
 * 对 ant-design-vue Checkbox 的二次封装，统一 CRRC 品牌配色。
 *
 * 支持的 props：
 * - checked (v-model:checked)
 * - disabled: boolean
 * - indeterminate: boolean（半选态）
 */
import { computed } from 'vue';

defineOptions({ name: 'CkCheckbox' });

const props = defineProps<{
  /** 是否选中 */
  checked?: boolean;
}>();

const emit = defineEmits<{
  'update:checked': [value: boolean];
}>();

function handleUpdate(val: boolean) {
  emit('update:checked', val);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkCheckbox 样式
 *  遵循 ui-design.md 3.5 多选框设计规范
 * ============================================================ */

.ck-checkbox {
  /* 选中态：主色背景 */
  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: var(--ck-primary) !important;
    border-color: var(--ck-primary) !important;
  }

  /* 悬停态：边框加深 */
  :deep(.ant-checkbox:hover .ant-checkbox-inner),
  :deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner) {
    border-color: var(--ck-primary-hover);
  }

  /* 半选态：主色背景 + 白色横线 */
  :deep(.ant-checkbox-indeterminate .ant-checkbox-inner) {
    background-color: var(--ck-primary) !important;
    border-color: var(--ck-primary) !important;
  }

  /* 禁用态：降低透明度 */
  :deep(.ant-checkbox-disabled) {
    opacity: 0.5;
  }

  /* 聚焦态：外发光环 */
  :deep(.ant-checkbox-input:focus + .ant-checkbox-inner) {
    box-shadow: 0 0 0 3px var(--ck-focus-ring);
  }

  /* 选框尺寸：18px × 18px */
  :deep(.ant-checkbox-inner) {
    width: 18px;
    height: 18px;
    border-radius: var(--ck-radius-sm);
  }
}
</style>
