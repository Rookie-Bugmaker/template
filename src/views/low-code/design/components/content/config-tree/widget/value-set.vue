<template>
  <select-value-set
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :code="''"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectValueSet from '@/components/select-value-set/index.vue';

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
    SelectValueSet,
  },
});
</script>

<style lang="less" scoped></style>
