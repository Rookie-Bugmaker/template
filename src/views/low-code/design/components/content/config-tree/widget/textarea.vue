<template>
  <a-textarea
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :allow-clear="config.options.allowClear"
    :show-count="config.options.showCount"
    :auto-size="config.options.autosize"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
