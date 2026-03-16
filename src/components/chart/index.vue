<template>
  <div ref="chartDom" :style="{ height: chartHeight }" />
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref, watch, computed } from 'vue';
import type { ECharts } from 'echarts';
// import * as echarts from 'echarts';
import { registerTheme, init } from 'echarts';
import { debounce, isNumber } from 'lodash-es';
import { addListener, removeListener } from 'resize-detector';
import dark from './dark';

registerTheme('dark-pro', dark);

export default defineComponent({
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    reset: Boolean,
    height: {
      type: [String, Number],
      default: 300,
    },
  },
  emits: ['click'],
  setup(props, { expose, emit }) {
    const chartDom = ref<HTMLDivElement>();
    let chart: ECharts | null = null;
    const isRealDark = inject('isRealDark', ref(false));
    const resizeChart = () => {
      chart?.resize();
    };

    const chartHeight = computed(() => {
      return isNumber(props.height) ? `${props.height}px` : props.height;
    });

    const resize = debounce(resizeChart, 300);

    const disposeChart = () => {
      if (chartDom.value) {
        removeListener(chartDom.value, resize);
      }
      chart?.dispose();
      chart = null;
    };
    const initChart = () => {
      disposeChart();
      if (chartDom.value) {
        // init echarts
        chart = init(chartDom.value, isRealDark.value ? 'dark-pro' : undefined);
        chart.setOption(props.option, props.reset);
        addListener(chartDom.value, resize);
      }
    };

    watch(
      isRealDark,
      () => {
        initChart();
      },
      { flush: 'post' },
    );
    onMounted(() => {
      watch(
        () => props.option,
        () => {
          chart?.off('click');
          chart?.setOption(props.option, props.reset);
          chart?.on('click', p => emit('click', p));
        },
        { deep: true, flush: 'post' },
      );
      initChart();
      chart?.on('click', p => emit('click', p));
      expose({
        chart,
      });
    });

    onUnmounted(() => {
      disposeChart();
    });
    const getChart = () => {
      return chart;
    };
    return {
      chart,
      getChart,
      chartDom,
      chartHeight,
    };
  },
});
</script>
