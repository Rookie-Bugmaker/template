<template>
  <yl-modal
    :title="`${modelRef.applicationId ? '编辑' : '新增'}业务能力中心`"
    :open="open"
    :width="700"
    :confirmLoading="loading"
    :destroy-on-close="true"
    centered
    @ok="handleSubmit"
    @cancel="
      () => {
        resetFields();
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form layout="horizontal" :label-col="{ style: { width: '120px' } }">
        <a-form-item label="能力中心" v-bind="validateInfos.applicationName">
          <a-input
            allow-clear
            v-model:value="modelRef.applicationName"
            placeholder="请输入能力中心"
          />
        </a-form-item>
        <a-form-item label="能力中心图标" v-bind="validateInfos.applicationIcon">
          <icon-select
            :input-readonly="true"
            v-model:value="modelRef.applicationIcon"
            placeholder="请选择能力中心图标"
          />
        </a-form-item>
        <a-form-item label="英文名称" v-bind="validateInfos.applicationNameEn">
          <a-input
            allow-clear
            v-model:value="modelRef.applicationNameEn"
            placeholder="请输入英文名称"
          />
        </a-form-item>
        <a-form-item label="简写代码" v-bind="validateInfos.applicationCode">
          <a-input
            allow-clear
            v-model:value="modelRef.applicationCode"
            placeholder="请输入简写代码"
          />
        </a-form-item>
        <a-form-item label="数据源" v-bind="validateInfos.dataSourceId">
          <data-source-selector v-model:value="modelRef.dataSourceId" />
        </a-form-item>
        <a-form-item label="所属项目" v-bind="validateInfos.projectId">
          <select-project
            v-model:value="modelRef.projectId"
            placeholder="请选择所属项目"
            allow-clear
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="能力中心说明" v-bind="validateInfos.appDesc">
          <a-textarea allow-clear v-model:value="modelRef.applicationDesc" :maxlength="100" />
        </a-form-item>
        <a-form-item label="图片上传" v-bind="validateInfos.fileHeaderId">
          <upload-image
            v-model:value="modelRef.fileHeaderId"
            type="preview"
            :maxUpload="1"
            :height="100"
            :width="100"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts">
import { Form, message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRaw, watch } from 'vue';
import type { PropType } from 'vue';
import { insertApp, updateApp } from '@/api/low-code/application';
import type { ApplicationItem } from '@/api/low-code/application';
import { useI18n } from 'vue-i18n';
import IconSelect from '@/components/icon-select/index.vue';
import DataSourceSelector from './components/data-source-selector.vue';
import UploadImage from '@/components/upload-image/index.vue';
import SelectProject from '@/components/select-project/index.vue';

export default defineComponent({
  name: 'EditModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object as PropType<ApplicationItem | null>,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const loading = ref(false);
    const initValues = (): ApplicationItem => ({
      applicationId: null,
      applicationCode: '',
      applicationName: '',
      applicationNameEn: '',
      applicationDesc: '',
      applicationIcon: '',
      dataSourceId: '',
      fileHeaderId: '',
      projectId: null,
    });
    const modelRef = reactive<ApplicationItem>(initValues());

    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      applicationName: [{ required: true, message: '请输入能力中心' }],
      applicationIcon: [{ required: true, message: '请选择能力中心图标' }],
      applicationCode: [{ required: true, message: '请输入简写代码' }],
      dataSourceId: [{ required: true, message: '请选择数据源' }],
      projectId: [{ required: true, message: '请选择所属项目' }],
    });

    watch(
      () => props.model,
      () => {
        if (props.model) {
          const raw = toRaw(props.model);
          Object.assign(modelRef, raw);
        } else if (props.model === null) {
          Object.assign(modelRef, initValues());
        }
      },
    );

    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          const data = toRaw(modelRef);
          if (!data.applicationId) {
            insertApp(data)
              .then(res => {
                if (res.success) {
                  message.success('新增能力中心成功');
                  resetFields();
                  emit('ok', res);
                } else {
                  message.warning(res.message);
                }
              })
              .catch(err => {
                message.error(err.response.data.message);
              })
              .finally(() => {
                loading.value = false;
              });
          } else {
            delete data.language;
            updateApp(data)
              .then(res => {
                if (res.success) {
                  message.success('修改能力中心成功');
                  resetFields();
                  emit('ok', res);
                } else {
                  message.warning(res.message);
                }
              })
              .catch(err => {
                message.error(err.response.data.message);
              })
              .finally(() => {
                loading.value = false;
              });
          }
        })
        .catch(() => {
          message.warning('校验失败');
          loading.value = false;
        });
    };

    return {
      modelRef,
      loading,
      validateInfos,
      t,
      initValues,
      resetFields,
      handleSubmit,
    };
  },
  components: {
    IconSelect,
    DataSourceSelector,
    UploadImage,
    SelectProject,
  },
});
</script>
