<template>
  <a-date-picker
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :input-read-only="config.options.inputReadOnly"
    :picker="config.options.picker"
    :format="config.options.format"
    :show-time="config.options.showTime"
    :value-format="config.options.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
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
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
