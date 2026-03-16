<template>
  <!-- 无图片时 -->
  <a-upload
    :accept="accept"
    :multiple="multiple"
    :disabled="disabled"
    v-if="!fileList.length"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :custom-request="customRequest"
  >
    <div :style="{ width: width + 'px', height: height + 'px' }" class="plus-upload">
      <loading-outlined v-if="uploadState.loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
    </div>
  </a-upload>
  <!-- 有图片，宽高足够时 -->
  <view-carouse
    v-else-if="width >= 80 && height >= 80"
    v-bind="props"
    :file-list="fileList"
    :preview-path-prefix="previewPathPrefix"
    :before-upload="beforeUpload"
    :custom-request="customRequest"
    @delete="v => deleteFile(v)"
    @download="v => downloadFile(v)"
  ></view-carouse>
  <!-- 有图片，宽高不足时，显示其一张图片，tooltip展示所有 -->
  <div v-else>
    <a-popover trigger="hover">
      <template #content>
        <view-carouse
          v-bind="props"
          :file-list="fileList"
          :preview-path-prefix="previewPathPrefix"
          :width="200"
          :height="200"
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          @delete="v => deleteFile(v)"
          @download="v => downloadFile(v)"
        ></view-carouse>
      </template>
      <img
        :style="{ width: width + 'px', height: height + 'px' }"
        style="object-fit: cover; border-radius: 8px"
        :src="previewPathPrefix + fileList[0].fileId"
        :alt="fileList[0].oldFileName"
      />
    </a-popover>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Props } from '@/components/upload-image/props';
import { useUploadFile } from '@/utils/hooks/useFileUpload';
import { useFileAuthPath } from '@/utils/hooks/useFileAuthPath';
import ViewCarouse from './view-carouse.vue';
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
.plus-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: @primary-color;
    border: 2px dashed @primary-color;
  }
}
.slick-slide div {
  height: 100%;
}
:deep(.ant-image-img) {
  margin-right: 10px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
