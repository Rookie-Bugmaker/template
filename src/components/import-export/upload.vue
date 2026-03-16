<template>
  <a-row>
    <a-input
      v-model:value="fileName"
      allow-clear
      style="width: 50%"
      placeholder="请选择文件"
    ></a-input>
    <a-upload :showUploadList="false" :customRequest="customRequest" :beforeUpload="beforeUpload">
      <a-button type="primary" style="margin-left: 10px">
        <upload-outlined />
        上传文件
      </a-button>
    </a-upload>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import request from '@/utils/request';

export default defineComponent({
  components: {
    UploadOutlined,
  },
  props: {
    checkFileUrl: String,
    importParams: Object,
    loading: Boolean,
  },
  emits: ['status', 'update:loading'],
  setup(props, { emit }) {
    const checkUrl = ref(`${process.env.VUE_APP_API_BASE_URL}/${props.checkFileUrl}`);

    const fileName = ref('');
    const beforeUpload = file => {
      fileName.value = file.name;
    };

    // 自定义上传
    const customRequest = async info => {
      // 开始上传
      emit('update:loading', true);
      try {
        const formData = new FormData();
        Object.assign(formData, props.importParams || {});
        const file = info.file;
        formData.append('file', file);
        const {
          result,
          success,
          message: msg,
        } = await request.post<FormData, ResponseBody<any>>(`/${props.checkFileUrl}`, formData, {
          headers: {
            'Content-Type': 'application/form-data',
          },
        });
        emit('update:loading', false);
        if (success) {
          message.success(msg);
          emit('status', file, result?.redisKey, { num: 1, status: 'finish' }, '验证成功!');
        } else if (!success && result?.redisKey) {
          message.warning(msg);
          emit(
            'status',
            file,
            result?.redisKey,
            { num: 1, status: 'error' },
            '验证失败：请下载结果文件查看详情！',
          );
        } else {
          Modal.error({
            title: '验证失败!',
            content: msg,
          });
          emit('status', file, result?.redisKey, { num: 1, status: 'error' }, '验证失败!');
        }
      } catch (error: any) {
        Modal.error({
          title: '上传失败!',
          content: error?.response?.data?.message,
        });
        emit('update:loading', false);
      }
    };
    return {
      checkUrl,
      fileName,
      beforeUpload,
      customRequest,
    };
  },
});
</script>

<style scoped></style>
