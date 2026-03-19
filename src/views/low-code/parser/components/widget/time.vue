<template>
  <a-time-picker
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :input-read-only="config.options.inputReadOnly"
    :format="config.options.format"
    value-format="HH:mm:ss"
    style="width: 100%"
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
  setup() {},
});
</script>

<style lang="less" scoped></style>
