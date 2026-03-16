<template>
  <svg class="iconfont" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './iconfont.js';

export default defineComponent({
  name: 'Iconfont',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped>
.iconfont {
  width: 1em;
  height: 1em;
  overflow: hidden;
  /* vertical-align: -0.15em; */
  fill: currentColor;
}
</style>
