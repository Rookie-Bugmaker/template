<template>
  <!--
    CkButton - CRRC UI 按钮组件
    基于 ant-design-vue Button 封装，支持 CRRC 品牌样式。

    @example
      <CkButton type="primary">主按钮</CkButton>
      <CkButton type="danger" size="large">危险按钮</CkButton>
      <CkButton type="dashed" :loading="true">加载中</CkButton>
  -->
  <a-button
    v-bind="$attrs"
    :class="buttonClass"
    :type="mappedType"
    :danger="isDanger"
  >
    <slot />
  </a-button>
</template>

<script setup lang="ts">
/**
 * CkButton
 *
 * 对 ant-design-vue Button 的二次封装，新增：
 * - danger 类型映射（type="danger" → ant-design danger 属性）
 * - CRRC 品牌样式类名绑定
 *
 * 支持的 props（继承 a-button 全部属性）：
 * - type: 'primary' | 'secondary' | 'text' | 'dashed' | 'danger' | 'link'
 * - size: 'large' | 'middle' | 'small'
 * - loading: boolean
 * - disabled: boolean
 * - block: boolean
 */
import { computed } from 'vue';

defineOptions({ name: 'CkButton' });

const props = defineProps<{
  /** 按钮类型 */
  type?: 'primary' | 'secondary' | 'text' | 'dashed' | 'danger' | 'link';
  /** 按钮尺寸 */
  size?: 'large' | 'middle' | 'small';
  /** 是否加载中 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否块级按钮（宽度 100%） */
  block?: boolean;
}>();

/** 是否为危险按钮（type="danger" 映射为 ant-design danger 属性） */
const isDanger = computed(() => props.type === 'danger');

/** 将 danger 类型映射为 primary（ant-design-vue 无 danger type，需通过 danger 属性控制） */
const mappedType = computed(() => {
  if (props.type === 'danger') return 'primary';
  if (props.type === 'secondary') return 'default';
  return props.type as any;
});

/** CRRC 样式类名 */
const buttonClass = computed(() => [
  'ck-btn',
  `ck-btn--${props.type || 'default'}`,
  props.block ? 'ck-btn--block' : '',
]);
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkButton 样式
 *  遵循 ui-design.md 3.1 按钮设计规范
 * ============================================================ */

/* 基础样式覆盖（使用 deep 穿透 ant-design-vue 内部类） */
:deep(.ant-btn) {
  border-radius: var(--ck-radius-md);
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  box-shadow: none;

  /* 悬停态：背景色加深 */
  &:hover {
    transition: all 0.2s ease;
  }

  /* 点击态：轻微缩放 */
  &:active {
    transform: scale(0.97);
    transition: all 0.1s ease;
  }

  /* 禁用态：降低透明度，禁止交互 */
  &:disabled,
  &.ant-btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

/* 次按钮：灰色边框，白底 */
:deep(.ant-btn-default).ck-btn--secondary {
  border: 1px solid var(--ck-border-default);
  color: var(--ck-text-primary);
  background: var(--ck-bg-card);

  &:hover {
    border-color: var(--ck-primary);
    color: var(--ck-primary);
  }
}

/* 链接按钮：无背景无边框 */
:deep(.ant-btn-link) {
  color: var(--ck-primary);
  box-shadow: none;

  &:hover {
    color: var(--ck-primary-hover);
  }
}

/* 块级按钮 */
.ck-btn--block {
  :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
