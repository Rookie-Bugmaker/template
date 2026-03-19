<template>
  <a-col
    class="designer-grid-col"
    v-bind="$attrs"
    :span="config.options.span"
    :offset="config.options.offset"
    :pull="config.options.pull"
    :push="config.options.push"
  >
    <slot></slot>
  </a-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'DGridCol',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
  },
  setup() {
    return {};
  },
  components: {},
});
</script>

<style lang="less" scoped>
.designer-grid-col {
  height: 100%;
}
</style>
