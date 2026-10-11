<template>
  <!--
    CkRadio - CRRC UI 单选框组件
    基于 ant-design-vue Radio 封装，支持基础单选和按钮样式。

    @example
      <CkRadioGroup v-model:value="val">
        <CkRadio value="a">选项A</CkRadio>
        <CkRadio value="b">选项B</CkRadio>
      </CkRadioGroup>
  -->
  <a-radio
    v-bind="$attrs"
    :class="['ck-radio']"
    :checked="checked"
    @update:checked="handleUpdate"
  >
    <slot />
  </a-radio>
</template>

<script setup lang="ts">
/**
 * CkRadio
 *
 * 对 ant-design-vue Radio 的二次封装，统一 CRRC 品牌配色。
 *
 * 支持的 props：
 * - checked (v-model:checked)
 * - value: any
 * - disabled: boolean
 */
defineOptions({ name: 'CkRadio' });

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
 *  CkRadio 样式
 *  遵循 ui-design.md 3.6 单选框设计规范
 * ============================================================ */

.ck-radio {
  /* 选中态：主色外圈 + 主色内点 */
  :deep(.ant-radio-checked .ant-radio-inner) {
    border-color: var(--ck-primary) !important;
    background-color: transparent !important;
  }

  :deep(.ant-radio-checked .ant-radio-inner::after) {
    background-color: var(--ck-primary) !important;
    transform: scale(0.45);
  }

  /* 悬停态：边框加深 */
  :deep(.ant-radio:hover .ant-radio-inner) {
    border-color: var(--ck-primary-hover);
  }

  /* 圆形尺寸：18px */
  :deep(.ant-radio-inner) {
    width: 18px;
    height: 18px;
  }

  /* 禁用态 */
  :deep(.ant-radio-disabled) {
    opacity: 0.5;
  }

  /* 聚焦态：外发光环 */
  :deep(.ant-radio-input:focus + .ant-radio-inner) {
    box-shadow: 0 0 0 3px var(--ck-focus-ring);
  }
}
</style>
