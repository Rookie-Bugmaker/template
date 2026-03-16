<template>
  <div class="yl-loading" :class="{ 'translate-x-[-35%]': showPercentage && state.percentage }">
    <loading-icon class="icon" />
    <span v-if="showPercentage && !!label?.trim?.()" class="yl-loaing-text">
      {{ label }}
      <span v-if="showPercentage && state.percentage">({{ state.percentage }}%)</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';

import type { ParamsType } from '@/components/yl/loading/index';

import LoadingIcon from './icon.vue';

const props = withDefaults(defineProps<ParamsType>(), {
  label: '加载中',
  showPercentage: true,
});

const state = reactive({
  step: 1,
  timer: null,
  percentage: 0,
});
//按超时时间10s为基准计算
const simulateProgress = () => {
  state.step++;
  const step = 7 - 0.1 * state.step;
  const percentage = state.percentage + (step > 0 ? step : 0.01);
  state.percentage = Math.floor(percentage >= 99 ? 99 : percentage);
};

onMounted(() => {
  if (props.showPercentage) {
    state.timer = setInterval(() => {
      simulateProgress();
    }, 300);
  }
});
onUnmounted(() => {
  state.timer && clearInterval(state.timer);
});
</script>

<style lang="less" scoped>
.yl-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  .icon {
    font-size: 19px;
  }
  .yl-loaing-text {
    width: 130px;
    margin-left: 10px;
    color: #111827;
    font-weight: 500;
    font-size: 16px;
    text-align: left;
    opacity: 0.85;
  }
}
</style>
