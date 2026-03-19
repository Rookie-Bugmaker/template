<template>
  <popup-edit
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :multiple="config.options.multiple"
  ></popup-edit>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupEdit from '@/components/popup-edit/index.vue';

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
    PopupEdit,
  },
});
</script>

<style lang="less" scoped></style>
