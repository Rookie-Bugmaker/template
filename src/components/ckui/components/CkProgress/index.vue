<template>
  <!--
    CkProgress - CRRC UI 进度条组件
    基于 ant-design-vue Progress 封装，支持线性 / 环形 / 条纹模式。

    @example
      <CkProgress :percent="60" />
      <CkProgress :percent="75" type="circle" />
      <CkProgress :percent="100" status="success" />
  -->
  <a-progress
    v-bind="$attrs"
    class="ck-progress"
    :percent="percent"
    :type="type"
    :status="status"
    :stroke-color="resolvedStrokeColor"
    :trail-color="trailColor"
    :stroke-width="strokeWidth"
    :show-info="showInfo"
    :format="format"
  />
</template>

<script setup lang="ts">
/**
 * CkProgress
 *
 * 对 ant-design-vue Progress 的二次封装，自动跟随 CRRC 主色。
 *
 * 核心实现：通过 getComputedStyle 读取 CSS 变量 --ck-primary 的实际色值，
 * 传递给 ant-design-vue 的 strokeColor prop（inline style），
 * 因为 ant-design-vue v4 内部通过 JS 设置 inline style，无法解析 CSS 变量字符串。
 *
 * 支持的 props：
 * - percent: number（进度百分比 0-100）
 * - type: 'line' | 'circle' | 'dashboard'
 * - status: 'active' | 'success' | 'exception' | 'normal'
 * - strokeWidth: number（轨道高度，默认 8）
 * - showInfo: boolean（是否显示百分比文字）
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { Progress as AProgress } from 'ant-design-vue';
defineOptions({ name: 'CkProgress' });

const props = withDefaults(
  defineProps<{
    percent?: number;
    type?: 'line' | 'circle' | 'dashboard';
    status?: 'active' | 'success' | 'exception' | 'normal';
    strokeWidth?: number;
    showInfo?: boolean;
    format?: (percent: number) => string;
  }>(),
  {
    type: 'line',
    strokeWidth: 8,
    showInfo: true,
  },
);

/**
 * 从 CSS 变量中解析实际色值
 * ant-design-vue v4 通过 inline style 设置 strokeColor，无法识别 CSS 变量字符串
 * 所以需要通过 getComputedStyle 读取浏览器解析后的实际颜色值
 */
const primaryColor = ref('#3b82f6');
const trailColor = ref('#e5e7eb');
let observer: MutationObserver | null = null;

/** 读取当前主题的 CSS 变量实际色值 */
function readThemeColors() {
  const style = getComputedStyle(document.documentElement);
  primaryColor.value = style.getPropertyValue('--ck-primary').trim() || '#3b82f6';
  trailColor.value = style.getPropertyValue('--ck-border-default').trim() || '#e5e7eb';
}

/**
 * 根据 status 计算实际传给 ant-design-vue 的 strokeColor
 * - normal / active → 使用主色
 * - success → 使用 success 色（绿色），让 ant-design-vue 内置处理
 * - exception → 使用 error 色（红色），让 ant-design-vue 内置处理
 */
const resolvedStrokeColor = ref<string | undefined>(undefined);

function updateStrokeColor() {
  readThemeColors();
  // normal / active 状态使用主色；success / exception 不传，由 ant-design-vue 内置色处理
  if (!props.status || props.status === 'normal' || props.status === 'active') {
    resolvedStrokeColor.value = primaryColor.value;
  } else {
    resolvedStrokeColor.value = undefined;
  }
}

onMounted(() => {
  updateStrokeColor();

  // 监听 data-theme 属性变化（主题切换时自动更新色值）
  observer = new MutationObserver(() => {
    updateStrokeColor();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkProgress 样式
 *  遵循 ui-design.md 3.15 进度条设计规范
 * ============================================================ */

/* 使用 :global 确保选择器不被 scoped 影响，覆盖 ant-design-vue CSS-in-JS 样式 */
:global(.ck-progress) {
  /* ---- 线性轨道圆角 + 底色 ---- */
  .ant-progress-inner {
    border-radius: 999px !important;
  }

  /* ---- 填充条圆角 + 过渡动画 ---- */
  .ant-progress-bg {
    border-radius: 999px !important;
    transition: width 0.3s ease;
  }

  /* ---- 百分比文字样式 ---- */
  .ant-progress-text {
    font-size: 13px;
  }

  /* ---- 环形进度中心文字 ---- */
  &.ant-progress-circle .ant-progress-text {
    font-size: 24px;
    font-weight: 600;
  }

  /* ---- 环形轨迹底色 ---- */
  .ant-progress-circle-trail {
    stroke: #e5e7eb;
  }
}
</style>
