<template>
  <component v-if="path" :is="itemComponent" :title="title" :refreshRate="refreshRate"></component>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
export default defineComponent({
  name: 'ChildItem',
  props: {
    path: {
      type: String,
      default: '',
    },
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
    const itemComponent = defineAsyncComponent(
      () => import(/* @vite-ignore */ `../items/${props.path}.vue`),
    );
    return { itemComponent };
  },
});
</script>

<style lang="less" scoped>
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .title-prefix {
    display: block;
    width: 5px;
    height: 25px;
    margin-right: 8px;
    background-color: @primary-color;
    border-radius: 2px;
  }
  .title {
    color: @primary-color;
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
