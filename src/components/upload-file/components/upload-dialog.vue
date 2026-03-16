<template>
  <a-button
    :type="disabled ? 'link' : buttonType"
    :size="size"
    @click="state.open = true"
    v-bind="$attrs"
  >
    <CloudUploadOutlined />
    <span v-if="!miniSelectBtn">
      {{ disabled ? buttonText.view : buttonText.upload }}({{ dialogRef?.fileList.length || 0 }})
    </span>
  </a-button>
  <upload-dialog-modal
    :open="state.open"
    :size="size"
    :value="value"
    :accept="accept"
    :disabled="disabled"
    :multiple="multiple"
    :un-accept="unAccept"
    :drag-modal="dragModal"
    :max-upload="maxUpload"
    :max-file-size="maxFileSize"
    :mini-select-btn="miniSelectBtn"
    :preview="preview"
    ref="dialogRef"
    @query-complete="(v, l) => $emit('queryComplete', v, l)"
    @change="(v, l) => $emit('change', v, l)"
    @cancel="state.open = false"
    @deleteValue="$emit('deleteValue')"
    @changeValue="(v, l) => $emit('changeValue', v, l)"
  ></upload-dialog-modal>
</template>
<script lang="ts">
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import type { PropType } from 'vue';
import type { ButtonType } from 'ant-design-vue/es/button';
import { defineComponent, reactive, ref } from 'vue';
import UploadDialogModal from './upload-dialog-modal.vue';
export default defineComponent({
  name: 'UploadFile',
  props: {
    // 文件组ID
    value: String,
    // 是否禁用
    disabled: Boolean,
    // 是否可以拖拽上传
    dragModal: Boolean,
    // 是否多选上传
    multiple: Boolean,
    // 允许上传的文件类型
    accept: {
      type: String,
      default: '*',
    },
    // 单个文件大小限制-kb
    maxFileSize: {
      type: Number,
      default: 1024 * 150,
    },
    // 最多上传数量
    maxUpload: {
      type: Number,
      default: 1,
    },
    // 是否隐藏按钮文字
    miniSelectBtn: Boolean,
    // 控件尺寸
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
    // 是否可以预览文件
    preview: {
      type: Boolean,
      default: false,
    },
    // 不接受文件类型
    unAccept: String,
    // dialog按钮类型
    buttonType: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
    // dialog按钮文本
    buttonText: {
      type: Object as PropType<{ upload: string; view: string }>,
      default: () => ({ upload: '上传文件', view: '查看文件' }),
    },
  },
  emits: ['changeValue', 'deleteValue', 'queryComplete', 'change'],
  setup() {
    const state = reactive({
      open: false,
    });
    const dialogRef = ref();
    return {
      state,
      dialogRef,
    };
  },
  components: { UploadDialogModal },
});
</script>
