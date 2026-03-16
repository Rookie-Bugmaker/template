<template>
  <yl-modal
    :title="
      t('view.system.org.modal.modalTitle') +
      t(`global.operation.${modelRef.orgId ? 'edit' : 'add'}`)
    "
    :open="open"
    :width="660"
    :confirmLoading="loading"
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
      <a-form :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
        <a-row>
          <a-col :span="18">
            <a-form-item
              :label="t('view.system.org.modal.form.orgCode.label')"
              v-bind="validateInfos.orgCode"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                v-model:value="modelRef.orgCode"
                :placeholder="t('view.system.org.modal.form.orgCode.placeholder')"
                :disabled="!!modelRef.orgId"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label="t('view.system.org.modal.form.status.label')"
              v-bind="validateInfos.orgStatus"
              :label-col="{ span: 12 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-switch
                v-model:checked="modelRef.orgStatus"
                :checked-children="$t('view.system.org.orgStatusMap.valid.content')"
                :un-checked-children="$t('view.system.org.orgStatusMap.invalid.content')"
                checkedValue="Y"
                unCheckedValue="N"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          :label="t('view.system.org.modal.form.orgName.label')"
          v-bind="validateInfos.orgName"
        >
          <a-input
            v-model:value="modelRef.orgName"
            :placeholder="t('view.system.org.modal.form.orgName.placeholder')"
          />
        </a-form-item>
        <a-form-item
          :label="t('view.system.org.modal.form.orgLocation.label')"
          v-bind="validateInfos.orgLocation"
        >
          <a-input
            v-model:value="modelRef.orgLocation"
            :placeholder="t('view.system.org.modal.form.orgLocation.placeholder')"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts">
import { Form, message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRaw, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { addOrg, updateOrg } from '@/api/system/org/index';
import type { OrgItem, OrgOperationParams } from '@/api/system/org/index';
import { useI18n } from 'vue-i18n';
import { useI18nFormLayout } from '@/utils/hooks/useI18nFormLayout';

export default defineComponent({
  name: 'EditModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object as PropType<OrgItem | null>,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const [formLayout] = useI18nFormLayout(['view.system.org.modal.form.formLayout']);
    const loading = ref(false);
    const initValues = (): OrgOperationParams => ({
      orgId: null,
      orgCode: '',
      orgName: '',
      orgLocation: '',
      orgStatus: 'Y',
    });
    const modelRef = reactive<OrgOperationParams>(initValues());

    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      orgCode: [
        { required: true, message: () => t('view.system.org.modal.form.rule.orgCode.message') },
      ],
      orgName: [
        { required: true, message: () => t('view.system.org.modal.form.rule.orgName.message') },
      ],
    });

    watchEffect(() => {
      if (props.model) {
        const raw = toRaw(props.model);
        Object.assign(modelRef, raw);
      } else if (props.model === null) {
        Object.assign(modelRef, initValues());
      }
    });

    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          const data = toRaw(modelRef);
          delete data['language'];
          if (!data.orgId) {
            addOrg(data)
              .then(res => {
                if (res.success) {
                  message.success(t('view.system.org.modal.message.success.one'));
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
            updateOrg(data)
              .then(res => {
                if (res.success) {
                  message.success(t('view.system.org.modal.message.success.two'));
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
          message.warning(t('view.system.org.modal.message.warning.one'));
          loading.value = false;
        });
    };

    return {
      t,
      formLayout,
      initValues,
      modelRef,
      loading,
      handleSubmit,
      resetFields,
      validateInfos,
    };
  },
  components: {},
});
</script>
