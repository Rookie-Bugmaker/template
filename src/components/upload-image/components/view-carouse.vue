<template>
  <div>
    <div :style="{ width: width + 'px', height: height + 'px' }" class="upload-operation">
      <a-carousel ref="carouselRef" :afterChange="carouselChange" :dots="false" class="upload-img">
        <div v-for="item in fileList" :key="item.fileId">
          <img
            :style="{ width: width + 'px', height: height + 'px' }"
            style="object-fit: cover"
            :src="previewPathPrefix + item.fileId"
            :alt="item.oldFileName"
          />
        </div>
      </a-carousel>
      <div class="upload-mask">
        <LeftCircleOutlined
          v-if="multiple && fileList.length > 1"
          @click="carouselRef.prev()"
          class="operation-icon upload-left"
        />
        <RightCircleOutlined
          v-if="multiple && fileList.length > 1"
          @click="carouselRef.next()"
          class="operation-icon upload-right"
        />
        <EyeOutlined class="operation-icon upload-preview" @click="setVisible(true)" />
        <a-space class="operation-other">
          <a-upload
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            v-if="!disabled"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="customRequest"
          >
            <PlusCircleOutlined v-if="multiple" class="operation-icon" />
            <FormOutlined v-else class="operation-icon" />
          </a-upload>
          <CloudDownloadOutlined
            @click="emit('download', fileList[currentIndex].fileId)"
            class="operation-icon"
          />
          <DeleteOutlined
            v-if="!disabled"
            @click="emit('delete', fileList[currentIndex].fileId)"
            class="operation-icon"
          />
        </a-space>
      </div>
    </div>
    <!-- 图片预览 -->
    <div style="display: none">
      <a-image-preview-group
        :preview="{ visible, current: currentIndex, onVisibleChange: v => (visible = v) }"
      >
        <a-image
          v-for="item in fileList"
          :key="item.fileId"
          :src="previewPathPrefix + item.fileId"
        />
      </a-image-preview-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { FileItem } from '@/api/file';
import type { UploadProps } from 'ant-design-vue';
import type { Props as UploadImageProps } from '@/components/upload-image/props';
interface Props extends UploadImageProps {
  /**文件列表 */
  fileList: FileItem[];
  /**上传之前 */
  beforeUpload: UploadProps['beforeUpload'];
  /**自定义上传 */
  customRequest: UploadProps['customRequest'];
  /**预览图片前缀 */
  previewPathPrefix: string;
}
defineProps<Props>();
// 图片预览
const visible = ref<boolean>(false);
// 走马灯
const carouselRef = ref();
const currentIndex = ref(0);
const carouselChange = (current: number) => {
  currentIndex.value = current;
};
const setVisible = v => (visible.value = v);

const emit = defineEmits(['download', 'delete']);
</script>
<style lang="less" scoped>
.upload-operation {
  position: relative;
  user-select: none;
  .upload-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
  }
  &:hover .upload-mask {
    opacity: 1;
  }
  .upload-mask {
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 18px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    opacity: 0;
    transition: all 0.3s;
    .operation-icon {
      color: #ffffff;
      font-size: 18px;
      cursor: pointer;
      &:hover {
        color: @primary-color;
      }
    }
    .upload-preview {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .operation-other {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .upload-left {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
    }
    .upload-right {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
}
</style>
