<template>
  <a-button
    v-bind="props"
    :type="disabled ? 'link' : 'primary'"
    :size="size"
    @click="(state.renderModal = true), (state.open = true)"
  >
    <slot>
      <CloudUploadOutlined />
      <span v-if="!miniSelectBtn">{{ disabled ? buttonText.view : buttonText.upload }}</span>
    </slot>
  </a-button>
  <upload-dialog-modal
    v-if="state.renderModal"
    v-bind="props"
    :open="state.open"
    @cancel="state.open = false"
    @change="(v, l) => emit('change', v, l)"
    @query-complete="(v, l) => emit('queryComplete', v, l)"
    @delete-value="emit('deleteValue')"
    @change-value="(v, l) => emit('changeValue', v, l)"
  ></upload-dialog-modal>
</template>
<script lang="ts" setup>
import type { Props } from '@/components/upload-image/props';
import { reactive } from 'vue';
import UploadDialogModal from './upload-dialog-modal.vue';
const props = defineProps<Props>();
const emit = defineEmits(['changeValue', 'deleteValue', 'queryComplete', 'change']);
const state = reactive({
  open: false,
  renderModal: false,
});
</script>
