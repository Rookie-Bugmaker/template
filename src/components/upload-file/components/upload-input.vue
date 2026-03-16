<template>
  <a-row type="flex" :wrap="false">
    <a-col flex="1">
      <a-select
        :open="false"
        :size="size"
        style="width: 100%"
        :options="fileList"
        :disabled="disabled"
        :placeholder="placeholder"
        :show-arrow="false"
        :show-search="false"
        :mode="multiple ? 'multiple' : null"
        @click="handleClick"
        :value="fileList.map(item => item.fileId)"
        :field-names="{ label: 'oldFileName', value: 'fileId' }"
      >
        <template #tagRender="{ value, label }">
          <a-tag
            :closable="!disabled"
            style="cursor: pointer"
            @click="downloadFile(value)"
            @close="deleteFile(value)"
          >
            {{ label }}
          </a-tag>
        </template>
      </a-select>
    </a-col>
    <a-col>
      <a-upload
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :custom-request="customRequest"
      >
        <a-button type="primary" :loading="uploadState.loading" :size="size" :disabled="disabled">
          <CloudUploadOutlined v-show="!uploadState.loading" />
          <span v-if="!miniSelectBtn">上传文件</span>
        </a-button>
      </a-upload>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';
import { useUploadFile } from '@/utils/hooks/useFileUpload';
export default defineComponent({
  name: 'UploadFile',
  props: {
    // 文件组ID
    value: String,
    // 是否禁用
    disabled: Boolean,
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
    // input类型提示文字
    placeholder: {
      type: String,
      default: '请选择文件',
    },
    // 不接受文件类型
    unAccept: String,
  },
  emits: ['changeValue', 'deleteValue', 'queryComplete', 'change'],
  setup(props, { emit }) {
    const { accept, maxFileSize, value, multiple, maxUpload, unAccept } = toRefs(props);
    const { fileList, uploadState, deleteFile, downloadFile, beforeUpload, customRequest } =
      useUploadFile(
        {
          accept,
          maxFileSize,
          value,
          multiple,
          maxUpload,
          unAccept,
        },
        {
          uploadSuccess: (value, list) => emit('changeValue', value, list),
          deleteSuccess: () => emit('deleteValue'),
          querySuccess: (value, list) => emit('queryComplete', value, list),
          listChange: (v, l) => emit('change', v, l),
        },
      );
    /**下载文件 */
    const handleClick = () => {
      if (!fileList.length) {
        return;
      }
      if (!multiple.value) {
        downloadFile(fileList[0]?.fileId);
      }
    };
    return {
      fileList,
      uploadState,
      deleteFile,
      handleClick,
      beforeUpload,
      downloadFile,
      customRequest,
    };
  },
});
</script>
<style lang="less" scoped>
.file-operation {
  display: none;
}
.file-row:hover {
  background-color: #eee;
}
.file-row:hover .file-operation {
  display: block;
}
</style>
