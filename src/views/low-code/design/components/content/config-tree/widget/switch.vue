<template>
  <a-switch
    :disabled="config.options.disabled"
    :size="config.options.size"
    :checked-value="config.options.checkedValue"
    :un-checked-value="config.options.unCheckedValue"
    :checked-children="config.options.checkedChildren"
    :un-checked-children="config.options.unCheckedChildren"
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
