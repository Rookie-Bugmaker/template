<template>
  <select-dict
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :dict-code="config.options.dictCode"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectDict from '@/components/select-dict/index.vue';

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
  components: {
    SelectDict,
  },
});
</script>

<style lang="less" scoped></style>
