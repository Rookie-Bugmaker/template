<template>
  <!--
    CkInput - CRRC UI 输入框组件
    基于 ant-design-vue Input 封装，支持 CRRC 品牌聚焦/错误样式。

    @example
      <CkInput v-model:value="text" placeholder="请输入内容" />
      <CkInput v-model:value="text" status="error" feedback="请输入有效值" />
      <CkInput v-model:value="pwd" type="password" show-password />
  -->
  <div :class="['ck-input-wrapper', statusClass]">
    <a-input
      v-if="type !== 'textarea'"
      v-bind="$attrs"
      :class="['ck-input', sizeClass]"
      :type="inputType"
      :value="modelValue"
      @update:value="handleUpdate"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
      <template v-if="$slots.addonBefore" #addonBefore>
        <slot name="addonBefore" />
      </template>
      <template v-if="$slots.addonAfter" #addonAfter>
        <slot name="addonAfter" />
      </template>
    </a-input>

    <!-- 文本域模式 -->
    <a-textarea
      v-else
      v-bind="$attrs"
      :class="['ck-input', 'ck-input--textarea', sizeClass]"
      :value="modelValue"
      @update:value="handleUpdate"
    />

    <!-- 反馈提示文字（错误 / 成功） -->
    <div
      v-if="feedback"
      :class="['ck-input__feedback', `ck-input__feedback--${status || 'error'}`]"
    >
      {{ feedback }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CkInput
 *
 * 对 ant-design-vue Input / Textarea 的二次封装，新增：
 * - 统一 CRRC 聚焦/错误/成功样式
 * - feedback 属性（输入框下方的提示文字）
 * - status 属性（'error' | 'success'，控制边框颜色和反馈色）
 * - type="textarea" 自动切换为 a-textarea
 *
 * 支持的 props：
 * - modelValue (v-model:value)
 * - type: string（text / password / textarea 等）
 * - status: 'error' | 'success' | undefined
 * - feedback: string
 * - size: 'large' | 'middle' | 'small'
 * - allowClear: boolean
 */
import { computed } from 'vue';

defineOptions({ name: 'CkInput' });

const props = defineProps<{
  /** 输入值（v-model:value） */
  modelValue?: string;
  /** 输入框类型 */
  type?: string;
  /** 校验状态 */
  status?: 'error' | 'success';
  /** 反馈提示文字 */
  feedback?: string;
  /** 尺寸 */
  size?: 'large' | 'middle' | 'small';
}>();

const emit = defineEmits<{
  'update:value': [value: string];
}>();

/** 计算的实际 input type（password 需由 a-input 内部处理） */
const inputType = computed(() => (props.type === 'textarea' ? 'text' : props.type));

/** 状态样式类名 */
const statusClass = computed(() =>
  props.status ? `ck-input-wrapper--${props.status}` : ''
);

/** 尺寸类名 */
const sizeClass = computed(() => (props.size ? `ck-input--${props.size}` : ''));

/** 向父组件触发值更新 */
function handleUpdate(val: string) {
  emit('update:value', val);
}
</script>

<style lang="less" scoped>
/* ============================================================
 *  CkInput 样式
 *  遵循 ui-design.md 3.2 输入框设计规范
 * ============================================================ */

.ck-input-wrapper {
  display: inline-flex;
  flex-direction: column;
  width: 100%;

  /* ---- 聚焦态样式覆盖 ---- */
  :deep(.ant-input:focus),
  :deep(.ant-input-focused),
  :deep(.ant-input-affix-wrapper:focus),
  :deep(.ant-input-affix-wrapper-focused) {
    border-color: var(--ck-primary) !important;
    box-shadow: 0 0 0 3px var(--ck-focus-ring) !important;
  }

  /* ---- 悬停态边框加深 ---- */
  :deep(.ant-input:hover),
  :deep(.ant-input-affix-wrapper:hover) {
    border-color: var(--ck-border-strong);
  }

  /* ---- 圆角统一 ---- */
  :deep(.ant-input),
  :deep(.ant-input-affix-wrapper) {
    border-radius: var(--ck-radius-sm);
    font-size: 15px;
  }
}

/* 错误状态：红色边框 + 红色反馈文字 */
.ck-input-wrapper--error {
  :deep(.ant-input),
  :deep(.ant-input-affix-wrapper) {
    border-color: var(--ck-error) !important;

    &:focus,
    &.ant-input-focused {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
    }
  }
}

/* 成功状态：绿色边框 + 绿色反馈文字 */
.ck-input-wrapper--success {
  :deep(.ant-input),
  :deep(.ant-input-affix-wrapper) {
    border-color: var(--ck-success) !important;

    &:focus,
    &.ant-input-focused {
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15) !important;
    }
  }
}

/* 反馈提示文字 */
.ck-input__feedback {
  margin-top: var(--ck-space-1);
  font-size: 13px;
  line-height: 1.5;

  &--error {
    color: var(--ck-error);
  }

  &--success {
    color: var(--ck-success);
  }
}

/* 尺寸覆盖 */
:deep(.ck-input--large) {
  .ant-input,
  .ant-input-affix-wrapper {
    height: 44px;
    font-size: 16px;
  }
}
:deep(.ck-input--small) {
  .ant-input,
  .ant-input-affix-wrapper {
    height: 28px;
    font-size: 13px;
  }
}
</style>
