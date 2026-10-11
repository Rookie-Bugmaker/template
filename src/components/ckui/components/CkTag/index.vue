<template>
  <!--
    CkTag - CRRC UI 标签组件
    基于 ant-design-vue Tag 封装，支持预设颜色 / 可关闭 / 可选中。

    @example
      <CkTag color="primary">主要</CkTag>
      <CkTag color="success">成功</CkTag>
      <CkTag closable @close="handleClose">可关闭</CkTag>
  -->
  <a-tag
    v-bind="$attrs"
    :class="['ck-tag', tagClass]"
    :color="tagColor"
    :closable="closable"
    @close="handleClose"
  >
    <slot />
  </a-tag>
</template>

<script setup lang="ts">
/**
 * CkTag
 *
 * 对 ant-design-vue Tag 的二次封装，新增 CRRC 预设颜色映射。
 *
 * 支持的 props：
 * - color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray' | string
 * - closable: boolean（是否可关闭）
 *
 * 当 color 传入 CRRC 预设关键词时自动映射为 CSS 变量色值；
 * 传入任意 hex / rgb 色值时透传给 ant-design-vue。
 */
import { computed } from 'vue';

defineOptions({ name: 'CkTag' });

const props = defineProps<{
  /** 标签颜色（支持 CRRC 预设词或任意色值） */
  color?: string;
  /** 是否可关闭 */
  closable?: boolean;
}>();

const emit = defineEmits<{
  close: [e: MouseEvent];
}>();

/** CRRC 预设颜色映射表 */
const colorMap: Record<string, string> = {
  primary: 'var(--ck-primary)',
  success: 'var(--ck-success)',
  warning: 'var(--ck-warning)',
  error: 'var(--ck-error)',
  info: 'var(--ck-info)',
  gray: '#f3f4f6',
};

/** 计算实际颜色值 */
const tagColor = computed(() => colorMap[props.color || ''] || props.color);

/** 自定义类名（灰色标签需要额外样式） */
const tagClass = computed(() => (props.color === 'gray' ? 'ck-tag--gray' : ''));

function handleClose(e: MouseEvent) {
  emit('close', e);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkTag 样式
 *  遵循 ui-design.md 3.13 标签设计规范
 * ============================================================ */

.ck-tag {
  /* 基础样式：圆角 + 间距 */
  border-radius: var(--ck-radius-sm);
  font-size: 13px;
  line-height: 1.5;
  padding: 2px 10px;
  margin-right: var(--ck-space-2);

  /* 关闭图标悬停加深 */
  :deep(.ant-tag-close-icon:hover) {
    color: var(--ck-text-primary);
  }
}

/* 灰色标签 */
.ck-tag--gray {
  color: var(--ck-text-secondary) !important;
  border-color: var(--ck-border-default) !important;
  background-color: #f3f4f6 !important;
}
</style>
