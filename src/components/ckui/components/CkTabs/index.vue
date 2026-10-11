<template>
  <!--
    CkTabs - CRRC UI 标签页组件
    基于 ant-design-vue Tabs 封装，支持下划线 / 卡片 / 胶囊三种模式。

    @example
      <CkTabs v-model:activeKey="activeKey" type="line">
        <CkTabPane key="1" tab="标签一">内容一</CkTabPane>
        <CkTabPane key="2" tab="标签二">内容二</CkTabPane>
      </CkTabs>
  -->
  <a-tabs
    v-bind="$attrs"
    :class="['ck-tabs', `ck-tabs--${type}`]"
    :active-key="activeKey"
    :type="antType"
    @update:active-key="handleUpdate"
  >
    <!--
      不使用 v-for 通用 slot 转发，Vue 3.3 下会导致 renderSlot null key 报错。
      改为显式转发默认插槽（用于放置 a-tab-pane 子组件）和常用命名插槽。
    -->
    <slot />
    <template v-if="$slots.tabBarExtraContent" #tabBarExtraContent>
      <slot name="tabBarExtraContent" />
    </template>
    <template v-if="$slots.leftExtra" #leftExtra>
      <slot name="leftExtra" />
    </template>
    <template v-if="$slots.rightExtra" #rightExtra>
      <slot name="rightExtra" />
    </template>
  </a-tabs>
</template>

<script setup lang="ts">
/**
 * CkTabs
 *
 * 对 ant-design-vue Tabs 的二次封装，新增：
 * - type="segment" 胶囊模式（ant-design-vue 原生无此模式，通过 class 模拟）
 * - 统一 CRRC 选中色 / 下划线动画
 *
 * 支持的 props：
 * - activeKey (v-model:activeKey)
 * - type: 'line' | 'card' | 'segment'（segment 为 CRRC 新增）
 * - tabPosition: 'top' | 'bottom' | 'left' | 'right'
 */
import { computed } from 'vue';

defineOptions({ name: 'CkTabs' });

const props = withDefaults(
  defineProps<{
    activeKey?: string;
    /** 标签页类型 */
    type?: 'line' | 'card' | 'segment';
  }>(),
  { type: 'line' }
);

const emit = defineEmits<{
  'update:activeKey': [key: string];
}>();

/** segment 模式在 ant-design-vue 中映射为 line，通过 CSS 实现胶囊外观 */
const antType = computed(() => (props.type === 'segment' ? 'line' : props.type));

function handleUpdate(key: string) {
  emit('update:activeKey', key);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkTabs 样式
 *  遵循 ui-design.md 3.20 标签页设计规范
 * ============================================================ */

.ck-tabs {
  /* ---- 选中标签字色 + 下划线颜色 ---- */
  :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: var(--ck-primary) !important;
    font-weight: 600;
  }

  :deep(.ant-tabs-tab:hover .ant-tabs-tab-btn) {
    color: var(--ck-primary-hover) !important;
  }

  /* 下划线（ink-bar）颜色 */
  :deep(.ant-tabs-ink-bar) {
    background-color: var(--ck-primary) !important;
    transition: all 0.3s ease;
  }

  /* 标签项高度 44px */
  :deep(.ant-tabs-tab) {
    height: 44px;
    padding: 0 var(--ck-space-4);
    font-size: 15px;
  }

  /* 禁用标签灰色 */
  :deep(.ant-tabs-tab-disabled) {
    color: var(--ck-text-tertiary) !important;
  }
}

/* 卡片模式：选中项白底，其余灰底 */
.ck-tabs--card {
  :deep(.ant-tabs-tab-active) {
    background-color: var(--ck-bg-card) !important;
    border-bottom-color: var(--ck-bg-card) !important;
  }
}

/* 胶囊模式：选中项主色背景，圆角胶囊 */
.ck-tabs--segment {
  :deep(.ant-tabs-nav::before) {
    display: none; /* 隐藏下划线 */
  }

  :deep(.ant-tabs-nav-list) {
    background-color: #f3f4f6;
    border-radius: var(--ck-radius-full);
    padding: 2px;
  }

  :deep(.ant-tabs-tab) {
    border-radius: var(--ck-radius-full);
    margin: 0 !important;
    padding: 4px 20px;
    transition: all 0.2s ease;
  }

  :deep(.ant-tabs-tab-active) {
    background-color: var(--ck-primary) !important;

    .ant-tabs-tab-btn {
      color: #fff !important;
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }
}
</style>
