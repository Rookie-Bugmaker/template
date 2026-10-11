<template>
  <!--
    CkCard - CRRC UI 卡片组件
    基于 ant-design-vue Card 封装，支持标题 / 可悬停 / 可选 / 加载态。

    @example
      <CkCard title="卡片标题">卡片内容</CkCard>
      <CkCard hoverable title="可悬停卡片">悬停时有阴影提升效果</CkCard>
      <CkCard loading>加载中</CkCard>
  -->
  <a-card
    v-bind="$attrs"
    :class="['ck-card', cardClass]"
    :title="title"
    :hoverable="hoverable"
    :loading="loading"
    :bordered="bordered"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
  </a-card>
</template>

<script setup lang="ts">
/**
 * CkCard
 *
 * 对 ant-design-vue Card 的二次封装，统一 CRRC 圆角 / 阴影 / 间距风格。
 *
 * 支持的 props：
 * - title: string
 * - hoverable: boolean（悬停时阴影提升）
 * - loading: boolean（骨架屏）
 * - bordered: boolean（是否带边框）
 * - selectable: boolean（可选卡片，点击切换选中态）
 */
import { computed, ref } from 'vue';

defineOptions({ name: 'CkCard' });

const props = withDefaults(
  defineProps<{
    title?: string;
    hoverable?: boolean;
    loading?: boolean;
    bordered?: boolean;
    selectable?: boolean;
  }>(),
  { bordered: true }
);

const emit = defineEmits<{
  select: [selected: boolean];
}>();

const selected = ref(false);

/** 选中态类名 */
const cardClass = computed(() => {
  if (!props.selectable) return '';
  return selected.value ? 'ck-card--selected' : '';
});

/** 点击切换选中态 */
function handleClick() {
  if (props.selectable) {
    selected.value = !selected.value;
    emit('select', selected.value);
  }
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkCard 样式
 *  遵循 ui-design.md 3.16 卡片设计规范
 * ============================================================ */

.ck-card {
  /* 基础卡片样式 */
  border-radius: var(--ck-radius-md);
  box-shadow: var(--ck-shadow-card);
  border: 1px solid var(--ck-border-default);

  /* 标题样式 */
  :deep(.ant-card-head-title) {
    font-size: 18px;
    font-weight: 600;
    color: var(--ck-text-primary);
  }

  /* 内容区背景 */
  :deep(.ant-card-body) {
    font-size: 15px;
  }

  /* 可悬停卡片：悬停时阴影提升 */
  &:hover:not(.ck-card--selected) {
    box-shadow: var(--ck-shadow-hover);
    transition: box-shadow 0.2s ease;
  }
}

/* 选中态：主色边框 */
.ck-card--selected {
  border-color: var(--ck-primary) !important;
  box-shadow: 0 0 0 1px var(--ck-primary);
}
</style>
