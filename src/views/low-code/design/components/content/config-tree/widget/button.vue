<template>
  <a-button
    :disabled="config.options.disabled"
    :type="config.options.type"
    :size="config.options.size"
    :shape="config.options.shape"
    :danger="config.options.danger"
  >
    {{ config.options.text }}
  </a-button>
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
