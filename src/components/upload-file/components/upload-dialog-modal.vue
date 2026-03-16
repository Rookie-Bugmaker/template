<template>
  <a-modal centered :open="open" :title="disabled ? '文件查看' : '文件上传'" :footer="null">
    <a-space>
      <div v-if="!disabled">
        <a-upload-dragger
          v-if="dragModal"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">单击或拖动文件到此区域以上载</p>
          <p class="ant-upload-hint">支持单次或批量上传。</p>
        </a-upload-dragger>
        <a-upload
          v-else
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
      </div>
      <a-button
        type="primary"
        :disabled="!fileList.length"
        style="margin: 10px"
        :size="size"
        @click="downloadAll"
      >
        <cloud-download-outlined />
        批量下载
      </a-button>
    </a-space>
    <div style="height: 20px"></div>
    <a-row v-for="item in fileList" :key="item.fileId" class="file-row" type="flex">
      <a-col flex="1" style="font-size: 16px">{{ item.oldFileName }}</a-col>
      <a-col>
        <a-space>
          <a-tooltip title="预览">
            <eye-outlined
              v-if="preview"
              class="btn"
              :disabled="loadingView"
              @click="openAsync({ fileId: item.fileId })"
            />
          </a-tooltip>
          <a-tooltip title="下载">
            <cloud-download-outlined class="btn" @click="downloadFile(item.fileId)" />
          </a-tooltip>
          <a-popconfirm
            title="确定删除?"
            v-if="!disabled"
            :disabled="disabled"
            @confirm="deleteFile(item.fileId)"
          >
            <a-tooltip title="删除">
              <DeleteOutlined class="btn" style="color: #ff0000" />
            </a-tooltip>
          </a-popconfirm>
        </a-space>
      </a-col>
    </a-row>
    <a-empty v-if="!fileList.length"></a-empty>
  </a-modal>
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
    // 弹窗
    open: Boolean,
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
  },
  emits: ['changeValue', 'deleteValue', 'queryComplete', 'change'],
  setup(props, { emit, expose }) {
    const { accept, maxFileSize, value, multiple, maxUpload, unAccept } = toRefs(props);
    const {
      fileList,
      uploadState,
      deleteFile,
      downloadFile,
      beforeUpload,
      customRequest,
      downloadAll,
    } = useUploadFile(
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
    expose({ fileList });
    const { loading: loadingView, openAsync } = useFileView({});

    return {
      fileList,
      uploadState,
      deleteFile,
      downloadAll,
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
.file-row {
  padding: 8px 10px;
  border-radius: 5px;
  transition: all 0.3s;
  align-items: center;
  .btn {
    cursor: pointer;
    opacity: 0;
    font-size: 18px;
    transition: all 0.3s;
  }
}
.file-row:hover {
  background-color: #eee;
  transform: scale(1.05);
  .btn {
    opacity: 1;
  }
}
</style>
