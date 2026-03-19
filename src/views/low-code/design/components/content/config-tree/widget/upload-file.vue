<template>
  <upload-file
    :disabled="config.options.disabled"
    :multiple="config.options.multiple"
    :type="config.options.type"
    :size="config.options.size"
    :maxFileSize="config.options.maxFileSize"
    :maxCount="config.options.maxCount"
    :accept="config.options.accept"
    :miniSelectBtn="config.options.miniSelectBtn"
  ></upload-file>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import uploadFile from '@/components/upload-file/index.vue';

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
    uploadFile,
  },
});
</script>

<style lang="less" scoped></style>
