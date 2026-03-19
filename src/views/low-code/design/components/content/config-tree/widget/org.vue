<template>
  <select-org
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectOrg from '@/components/select-org/index.vue';

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
    SelectOrg,
  },
});
</script>

<style lang="less" scoped></style>
