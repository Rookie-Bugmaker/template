<template>
  <a-time-picker
    :value="value"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :input-read-only="config.options.inputReadOnly"
    :format="config.options.format"
    style="width: 100%"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const value = ref<Dayjs>(dayjs());
    return { value };
  },
});
</script>

<style lang="less" scoped></style>
