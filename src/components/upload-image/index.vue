<template>
  <div>
    <upload-button
      v-if="type == 'button'"
      v-bind="props"
      @deleteValue="emit('update:value', null)"
      @change="(v, l) => emit('change', v, l)"
      @query-complete="(v, l) => emit('queryComplete', v, l)"
      @changeValue="
        (v, l) => {
          emit('update:value', v, l);
          emit('success', v, l);
        }
      "
    ></upload-button>
    <upload-preview
      v-else-if="type == 'preview'"
      :value="value"
      :width="width"
      v-bind="props"
      @deleteValue="emit('update:value', null)"
      @change="(v, l) => emit('change', v, l)"
      @query-complete="(v, l) => emit('queryComplete', v, l)"
      @changeValue="
        (v, l) => {
          emit('update:value', v, l);
          emit('success', v, l);
        }
      "
    ></upload-preview>
    <upload-dialog
      v-else-if="type == 'dialog'"
      v-bind="props"
      @deleteValue="emit('update:value', null)"
      @change="(v, l) => emit('change', v, l)"
      @query-complete="(v, l) => emit('queryComplete', v, l)"
      @changeValue="
        (v, l) => {
          emit('update:value', v, l);
          emit('success', v, l);
        }
      "
    ></upload-dialog>
  </div>
</template>
<script lang="ts" setup>
import { defaultProps } from '@/components/upload-image/props';
import type { Props } from '@/components/upload-image/props';
import UploadButton from './components/upload-button.vue';
import UploadDialog from './components/upload-dialog.vue';
import UploadPreview from './components/upload-preview.vue';

const props = withDefaults(defineProps<Props>(), defaultProps);
const emit = defineEmits(['update:value', 'success', 'queryComplete', 'change']);
</script>
