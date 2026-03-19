<template>
  <a-switch
    :checked="value"
    @update:checked="v => $emit('update:value', v)"
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
    value: {
      type: [String, Number, Boolean],
    },
  },
  emits: ['update:value'],
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
