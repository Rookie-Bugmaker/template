<template>
  <upload-image
    :disabled="config.options.disabled"
    :type="config.options.type"
    :size="config.options.size"
    :multiple="config.options.multiple"
    :maxFileSize="config.options.maxFileSize || 1024 * 1024 * 30"
    :maxCount="config.options.maxCount || 1"
    :accept="config.options.accept || 'image/*'"
    :width="config.options.width"
    :height="config.options.height"
    :miniSelectBtn="config.options.miniSelectBtn"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UploadImage from '@/components/upload-image/index.vue';

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
    UploadImage,
  },
});
</script>

<style lang="less" scoped></style>
