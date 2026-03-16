<template>
  <upload-button
    v-if="type == 'button'"
    :size="size"
    :value="value"
    :accept="accept"
    :disabled="disabled"
    :multiple="multiple"
    :un-accept="unAccept"
    :max-upload="maxUpload"
    :max-file-size="maxFileSize"
    :mini-select-btn="miniSelectBtn"
    :preview="preview"
    @deleteValue="$emit('update:value', null)"
    @change="(v, l) => $emit('change', v, l)"
    @query-complete="(v, l) => $emit('queryComplete', v, l)"
    @changeValue="
      (v, l) => {
        $emit('update:value', v, l);
        $emit('success', v, l);
      }
    "
  ></upload-button>
  <upload-input
    v-else-if="type == 'input'"
    :size="size"
    :value="value"
    :accept="accept"
    :disabled="disabled"
    :multiple="multiple"
    :un-accept="unAccept"
    :max-upload="maxUpload"
    :placeholder="placeholder"
    :max-file-size="maxFileSize"
    :mini-select-btn="miniSelectBtn"
    @deleteValue="$emit('update:value', null)"
    @change="(v, l) => $emit('change', v, l)"
    @query-complete="(v, l) => $emit('queryComplete', v, l)"
    @changeValue="
      (v, l) => {
        $emit('update:value', v, l);
        $emit('success', v, l);
      }
    "
  ></upload-input>
  <upload-dialog
    v-else-if="type == 'dialog'"
    :size="size"
    :value="value"
    :accept="accept"
    :disabled="disabled"
    :multiple="multiple"
    :un-accept="unAccept"
    :drag-modal="dragModal"
    :max-upload="maxUpload"
    :buttonType="buttonType"
    :buttonText="buttonText"
    :max-file-size="maxFileSize"
    :mini-select-btn="miniSelectBtn"
    :preview="preview"
    @deleteValue="$emit('update:value', null)"
    @change="(v, l) => $emit('change', v, l)"
    @query-complete="(v, l) => $emit('queryComplete', v, l)"
    @changeValue="
      (v, l) => {
        $emit('update:value', v, l);
        $emit('success', v, l);
      }
    "
  ></upload-dialog>
</template>
<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import UploadButton from './components/upload-button.vue';
import UploadInput from './components/upload-input.vue';
import UploadDialog from './components/upload-dialog.vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import type { ButtonType } from 'ant-design-vue/es/button';
export default defineComponent({
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
    // 控件类型
    type: {
      type: String as PropType<'input' | 'button' | 'dialog'>,
      default: 'button',
    },
    // 单个文件大小限制-kb
    maxFileSize: {
      type: Number,
      default: 1024 * 150,
    },
    // 最多上传数量
    maxUpload: {
      type: Number,
      default: 0,
    },
    // 是否隐藏按钮文字
    miniSelectBtn: Boolean,
    // 控件尺寸
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
    // input类型提示文字
    placeholder: {
      type: String,
      default: '请选择文件',
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
  emits: ['update:value', 'success', 'queryComplete', 'change'],
  components: { UploadButton, UploadInput, UploadDialog },
});
</script>
