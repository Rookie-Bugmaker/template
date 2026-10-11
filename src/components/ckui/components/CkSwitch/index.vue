<template>
  <!--
    CkSwitch - CRRC UI 开关组件
    基于 ant-design-vue Switch 封装，支持基础开关 / 带文字 / 加载态。

    @example
      <CkSwitch v-model:checked="enabled" />
      <CkSwitch v-model:checked="enabled" checked-children="开" un-checked-children="关" />
      <CkSwitch v-model:checked="enabled" loading />
  -->
  <a-switch
    v-bind="$attrs"
    :class="['ck-switch']"
    :checked="checked"
    @update:checked="handleUpdate"
  />
</template>

<script setup lang="ts">
/**
 * CkSwitch
 *
 * 对 ant-design-vue Switch 的二次封装，统一 CRRC 品牌配色。
 *
 * 支持的 props：
 * - checked (v-model:checked)
 * - disabled: boolean
 * - loading: boolean
 * - checkedChildren / unCheckedChildren: string
 */
defineOptions({ name: 'CkSwitch' });

const props = defineProps<{
  /** 是否开启 */
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
 *  CkSwitch 样式
 *  遵循 ui-design.md 3.7 开关设计规范
 * ============================================================ */

.ck-switch {
  /* 开启态：主色背景 */
  :deep(.ant-switch-checked) {
    background-color: var(--ck-primary) !important;

    &:hover:not(.ant-switch-disabled) {
      background-color: var(--ck-primary-hover) !important;
    }
  }

  /* 滑块阴影 */
  :deep(.ant-switch-handle::before) {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  /* 禁用态：降低透明度 */
  :deep(.ant-switch-disabled) {
    opacity: 0.5;
  }

  /* 尺寸：44px × 24px（默认） */
  :deep(.ant-switch) {
    min-width: 44px;
    height: 24px;
    border-radius: var(--ck-radius-full);
  }
}
</style>
