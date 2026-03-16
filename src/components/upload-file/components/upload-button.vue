<template>
  <a-upload
    :accept="accept"
    :multiple="multiple"
    :disabled="disabled"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :custom-request="customRequest"
  >
    <a-button type="primary" :loading="uploadState.loading" :size="size" :disabled="disabled">
      <CloudUploadOutlined />
      <span v-if="!miniSelectBtn">上传文件</span>
    </a-button>
  </a-upload>
  <a-row v-for="item in fileList" :key="item.fileId" class="file-row" type="flex">
    <a-col flex="1">{{ item.oldFileName }}</a-col>
    <a-col class="file-operation">
      <a-space>
        <eye-outlined
          v-if="preview"
          style="cursor: pointer"
          :disabled="loadingView"
          @click="openAsync({ fileId: item.fileId })"
        />
        <cloud-download-outlined style="cursor: pointer" @click="downloadFile(item.fileId)" />
        <a-popconfirm
          v-if="!disabled"
          :disabled="disabled"
          title="确定删除?"
          @confirm="deleteFile(item.fileId)"
        >
          <DeleteOutlined style="cursor: pointer; color: #ff0000" />
        </a-popconfirm>
      </a-space>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';
import { useUploadFile } from '@/utils/hooks/useFileUpload';
import { useFileView } from '@/utils/hooks/useFileView';

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
    // 是否可以预览文件
    preview: {
      type: Boolean,
      default: false,
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

    const { loading: loadingView, openAsync } = useFileView({});

    return {
      fileList,
      uploadState,
      deleteFile,
      beforeUpload,
      downloadFile,
      customRequest,
      loadingView,
      openAsync,
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
