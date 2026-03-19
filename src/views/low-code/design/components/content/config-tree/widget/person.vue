<template>
  <select-person
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
import SelectPerson from '@/components/select-person/index.vue';

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
    SelectPerson,
  },
});
</script>

<style lang="less" scoped></style>
