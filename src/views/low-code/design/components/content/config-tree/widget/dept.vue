<template>
  <select-dept
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectDept from '@/components/select-dept/index.vue';

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
    SelectDept,
  },
});
</script>

<style lang="less" scoped></style>
