<template>
  <!-- <a-watermark content="CCCAR" > -->
  <left-menu-layout key="leftmenu-layout" v-if="layout === 'left'">
    <slot />
  </left-menu-layout>
  <basic-layout key="basic-layout" v-else><slot /></basic-layout>
  <!-- </a-watermark> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BasicLayout from './basic-layout.vue';
import LeftMenuLayout from './leftmenu-layout.vue';
import { injectMenuState } from './use-menu-state';
// import { Watermark as AWatermark } from 'ant-design-vue';

export default defineComponent({
  name: 'GlobalLayout',
  setup() {
    return {
      ...injectMenuState(),
    };
  },
  components: {
    BasicLayout,
    LeftMenuLayout,
    //AWatermark,
  },
});
</script>
