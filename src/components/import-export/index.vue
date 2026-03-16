<template>
  <yl-button act-type="export" v-if="onlyExport" :disabled="disabled" @click="exportFile">
    {{ onlyExportText }}
  </yl-button>
  <a-popover
    v-else
    trigger="click"
    placement="right"
    @click="visibleChange"
    v-model:open="state.popoverVisible"
  >
    <template #content>
      <a-space>
        <yl-button v-if="!hideDownloadTemplete" act-type="download" @click="downloadTemplete">
          模版下载
        </yl-button>
        <yl-button
          act-type="import"
          @click="
            () => {
              state.open = true;
              state.popoverVisible = false;
            }
          "
        ></yl-button>
        <yl-button v-if="!onlyImport" act-type="export" @click="exportFile"></yl-button>
      </a-space>
    </template>
    <a-button :disabled="disabled">
      <template #icon><DoubleRightOutlined /></template>
      {{ onlyImport ? '导入' : '导入导出' }}
    </a-button>
  </a-popover>
  <yl-modal
    title="导入"
    :open="state.open"
    width="50%"
    centered
    :destroy-on-close="true"
    @cancel="
      () => {
        if (state.currentStatus == 2) {
          $emit('success');
          complete();
        }
        cancel();
      }
    "
    :bodyStyle="{ padding: '20px 40px', height: '120px' }"
  >
    <a-spin :spinning="state.loading">
      <a-row :gutter="16">
        <a-steps :current="state.currentStatus" :status="state.stepStatus">
          <a-step class="my-steps" title="上传" />
          <a-step title="数据验证" />
          <a-step title="导入" />
        </a-steps>
      </a-row>
      <upload-file
        v-if="state.currentStatus == 0"
        :checkFileUrl="checkFileUrl"
        :importParams="importParams"
        v-model:loading="state.loading"
        @status="getStatus"
        style="margin-top: 40px"
      ></upload-file>
      <span
        v-else
        :style="{ marginTop: '10px', color: state.stepStatus == 'finish' ? '#81fb6f' : '#e8483f' }"
      >
        {{ state.statusValue }}
      </span>
    </a-spin>
    <template #footer>
      <yl-button
        act-type="download"
        v-if="state.currentStatus == 1"
        :disabled="!state.redisKey"
        @click="downloadResult"
      >
        结果下载
      </yl-button>
      <yl-button v-if="state.currentStatus != 2" act-type="cancel" @click="cancel"></yl-button>
      <yl-button
        v-if="state.currentStatus == 1"
        :disabled="state.stepStatus == 'error'"
        act-type="import"
        @click="handleUpload"
      ></yl-button>
      <a-button
        type="primary"
        v-if="state.currentStatus == 2"
        @click="
          () => {
            $emit('success');
            complete();
          }
        "
      >
        <template #icon>
          <icon-save />
        </template>
        完成
      </a-button>
    </template>
  </yl-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import uploadFile from './upload.vue';
import { IconSave } from '@/components/yl/icon/index';
import { useUpload } from './hooks';

export default defineComponent({
  name: 'import-export',
  props: {
    // 禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 导出参数
    exportParams: Object,
    // 导入参数
    importParams: Object,
    // 只存在导出
    onlyExport: {
      type: Boolean,
      default: false,
    },
    // 只存在导入
    onlyImport: {
      type: Boolean,
      default: false,
    },
    // 隐藏模板下载
    hideDownloadTemplete: {
      type: Boolean,
      default: false,
    },
    // 下载模版的文件名
    downloadTempleteName: {
      type: String,
      default: '',
    },
    // 下载验证结果的文件名
    downloadResName: {
      type: String,
      default: '',
    },
    // 导出文件名
    exportFileName: {
      type: String,
      default: '',
    },
    //导入地址
    importUrl: {
      type: String,
      default: '',
    },
    // 导入请求方式
    importMethod: {
      type: String,
      default: 'get',
    },
    //文件校验地址
    checkFileUrl: {
      type: String,
      default: '',
    },
    //导出地址
    exportUrl: {
      type: String,
      default: '',
    },
    //模版下载地址
    downloadTempleteUrl: {
      type: String,
      default: '',
    },
    //验证结果下载地址
    downloadResUrl: {
      type: String,
      default: '',
    },
    //低代码标识（低代码的导出接口类型有区别）
    isLowCode: {
      type: Boolean,
      default: false,
    },
    //表单校验
    validate: {
      type: Function,
      // default:() => Promise,
    },
    // 请求方式
    exportRequestMethod: {
      type: String,
      default: 'get',
      validator(value: string) {
        return ['post', 'get'].includes(value);
      },
    },
    onlyExportText: {
      type: String,
      default: '导出',
    },
  },
  emits: ['success'],
  setup(props) {
    const {
      state,
      downloadTemplete,
      exportFile,
      cancel,
      getStatus,
      downloadResult,
      handleUpload,
      complete,
      visibleChange,
    } = useUpload(props);

    return {
      state,
      downloadTemplete,
      exportFile,
      cancel,
      getStatus,
      downloadResult,
      handleUpload,
      complete,
      visibleChange,
    };
  },
  components: {
    uploadFile,
    IconSave,
  },
});
</script>
<style lang="less" scoped>
:deep(.ant-steps) {
  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: rgb(0, 255, 60);
  }
  .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: rgb(0, 255, 60);
  }
}
</style>
