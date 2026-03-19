<template>
  <process-status />
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
