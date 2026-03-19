<template>
  <a-input
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :prefix="config.options.prefix"
    :suffix="config.options.suffix"
    :addonBefore="config.options.addonBefore"
    :addonAfter="config.options.addonAfter"
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
