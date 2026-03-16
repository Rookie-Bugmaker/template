<template>
  <page-component-wrapper :title="title">
    <chart :height="200" :option="option" />
  </page-component-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageComponentWrapper from '@/views/dashboard/components/page-component-wrapper.vue';
import Chart from '@/components/chart/index.vue';

export default defineComponent({
  name: '',
  props: {
    title: {
      type: String,
      default: '',
    },
    //组件刷新频率
    refreshRate: {
      type: Number,
      default: 900,
    },
  },
  setup() {
    const state = reactive({});

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
        },
      ],
    };

    return {
      state,
      option,
    };
  },
  components: {
    PageComponentWrapper,
    Chart,
  },
});
</script>

<style lang="less" scoped></style>
