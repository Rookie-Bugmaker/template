<template>
  <a-spin :spinning="loading">
    <div class="ant-pro-table">
      <slot />
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
/* import { defineComponent } from 'vue';
export default defineComponent({
  name: '',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
}); */

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
.page-wrapper {
  background-color: #fff;
}
</style>
