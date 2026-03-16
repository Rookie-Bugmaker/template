<template>
  <a-modal centered :open="open" title="图片上传" :footer="null">
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
      <p class="ant-upload-text">单击或拖动图片到此区域以上载</p>
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
        <span v-if="!miniSelectBtn">上传图片</span>
      </a-button>
    </a-upload>
    <a-button type="primary" :size="size" style="margin: 10px" @click="downloadAll">
      <cloud-download-outlined />
      批量下载
    </a-button>
    <div style="height: 20px"></div>
    <a-space direction="vertical" style="width: 100%; margin-top: 10px">
      <a-row
        v-for="item in fileList"
        :key="item.fileId"
        class="file-row"
        type="flex"
        align="middle"
      >
        <a-col>
          <a-image
            :src="previewPathPrefix + item.fileId"
            :style="{ width: width + 'px', height: height + 'px' }"
          ></a-image>
        </a-col>
        <a-col style="margin-left: 10px" flex="1">{{ item.oldFileName }}</a-col>
        <a-col>
          <a-space>
            <a-tooltip title="下载">
              <CloudDownloadOutlined class="btn" @click="downloadFile(item.fileId)" />
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
    </a-space>
  </a-modal>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import { useUploadFile } from '@/utils/hooks/useFileUpload';
import { useFileAuthPath } from '@/utils/hooks/useFileAuthPath';
import type { Props as UploadImageProps } from '@/components/upload-image/props';
interface Props extends UploadImageProps {
  /**弹窗 */
  open: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['changeValue', 'deleteValue', 'queryComplete', 'change']);
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
    listChange: (value, list) => emit('change', value, list),
  },
);

const { previewPathPrefix } = useFileAuthPath();
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
:deep(.ant-image-img) {
  object-fit: cover;
  border-radius: 8px;
}
</style>
