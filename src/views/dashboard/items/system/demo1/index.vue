<template>
  <page-component-wrapper :title="title">
    <div>system</div>
    <div>刷新次数: {{ state.num }}</div>
  </page-component-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageComponentWrapper from '@/views/dashboard/components/page-component-wrapper.vue';

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
  setup(props) {
    const state = reactive({
      num: 0,
    });

    setInterval(() => {
      state.num += 1;
    }, props.refreshRate * 1000);

    return {
      state,
    };
  },
  components: {
    PageComponentWrapper,
  },
});
</script>

<style lang="less" scoped></style>
