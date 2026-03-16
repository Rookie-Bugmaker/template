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
      <CloudUploadOutlined v-show="!uploadState.loading" />
      <span v-if="!miniSelectBtn">上传图片</span>
    </a-button>
  </a-upload>
  <a-space direction="vertical" style="width: 100%; margin-top: 10px">
    <a-row v-for="item in fileList" :key="item.fileId" class="file-row" type="flex" align="middle">
      <a-col>
        <a-image
          :src="previewPathPrefix + item.fileId"
          :style="{ width: width + 'px', height: height + 'px' }"
        ></a-image>
      </a-col>
      <a-col style="margin-left: 10px" flex="1">{{ item.oldFileName }}</a-col>
      <a-col class="file-operation">
        <a-space>
          <CloudDownloadOutlined style="cursor: pointer" @click="downloadFile(item.fileId)" />
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
  </a-space>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import { useUploadFile } from '@/utils/hooks/useFileUpload';
import { useFileAuthPath } from '@/utils/hooks/useFileAuthPath';
import type { Props } from '@/components/upload-image/props';
const props = defineProps<Props>();
const emit = defineEmits(['changeValue', 'deleteValue', 'queryComplete', 'change']);
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
      listChange: (value, list) => emit('change', value, list),
    },
  );

const { previewPathPrefix } = useFileAuthPath();
</script>
<style lang="less" scoped>
.file-operation {
  display: none;
}
.file-row {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.file-row:hover {
  background-color: #eee;
}
.file-row:hover .file-operation {
  display: block;
}
:deep(.ant-image-img) {
  object-fit: cover;
  border-radius: 8px;
}
</style>
