<template>
  <select-user
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :multiple="config.options.multiple"
    :maxTagCount="config.options.maxTagCount"
    :miniSelectBtn="config.options.miniSelectBtn"
    :value="null"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectUser from '@/components/select-user/index.vue';

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
    SelectUser,
  },
});
</script>

<style lang="less" scoped></style>
