<template>
  <a-input-number
    :disabled="config.options.disabled"
    :size="config.options.size"
    :controls="config.options.controls"
    :max="config.options.max"
    :min="config.options.min"
    :step="config.options.step"
    :precision="config.options.precision"
    :placeholder="config.options.placeholder"
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
