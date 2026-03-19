<template>
  <process-status :process-instance-id="value" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProcessStatus from '@/components/workflow/process-status/index.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {};
  },
  components: {
    ProcessStatus,
  },
});
</script>

<style lang="less" scoped></style>
