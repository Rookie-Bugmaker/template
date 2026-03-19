<template>
  <yl-modal
    :title="`数据源${modelRef.dataSourceId ? '修改' : '新增'}`"
    :open="open"
    :width="900"
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
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-item label="数据源编码" v-bind="validateInfos.dataSourceCode">
              <a-input
                allow-clear
                v-model:value="modelRef.dataSourceCode"
                placeholder="请输入数据库编码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="用户名" v-bind="validateInfos.username">
              <a-input allow-clear v-model:value="modelRef.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码" v-bind="validateInfos.password">
              <a-input-password
                allow-clear
                v-model:value="modelRef.password"
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              :label-col="itemLabelCol"
              :wrapper-col="itemWrapperCol"
              label="数据库连接"
              v-bind="validateInfos.dbUrl"
            >
              <a-input
                allow-clear
                v-model:value="modelRef.dbUrl"
                placeholder="请输入数据库连接地址"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              :label-col="itemLabelCol"
              :wrapper-col="itemWrapperCol"
              label="驱动"
              v-bind="validateInfos.driverClassName"
            >
              <a-input
                allow-clear
                v-model:value="modelRef.driverClassName"
                placeholder="请输入驱动"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              :label-col="itemLabelCol"
              :wrapper-col="itemWrapperCol"
              label="描述"
              v-bind="validateInfos.dataSourceDesc"
            >
              <a-textarea
                allow-clear
                v-model:value="modelRef.dataSourceDesc"
                placeholder="请输入描述"
                :auto-size="{ minRows: 3, maxRows: 3 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template #leftfooter>
      <a-button @click="$emit('test', modelRef)">测试连接</a-button>
    </template>
  </yl-modal>
</template>

<script lang="ts">
import { Form, Modal, message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRaw, watchEffect } from 'vue';
import type { PropType } from 'vue';
import {
  addDataSource,
  updateDataSource,
  findDataSourceById,
} from '@/api/low-code/data-source/index';
import type { DataSourceItem } from '@/api/low-code/data-source/index';
import type { Rule } from 'ant-design-vue/lib/form';
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
// 用于独占一行的formItem
const formItemLayout = {
  itemLabelCol: {
    sm: { span: 3 },
  },
  itemWrapperCol: {
    sm: { span: 21 },
  },
};
export default defineComponent({
  name: 'EditModal',
  props: {
    // 显示/隐藏弹出框
    open: {
      type: Boolean,
      required: true,
    },
    // 修改的对象（添加时为null）
    model: {
      type: Object as PropType<DataSourceItem | null>,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel', 'test'],
  setup(props, { emit }) {
    const loading = ref(false);
    const initValues = (): DataSourceItem => ({
      dataSourceId: null,
      dataSourceCode: '',
      dbUrl: '',
      username: '',
      password: '',
      driverClassName: '',
      dataSourceDesc: '',
    });
    const modelRef = reactive<DataSourceItem>(initValues());
    const validatePassword = async (_rule: Rule, value: string) => {
      if (!modelRef.dataSourceId) {
        if (value === null || value === '' || value === undefined) {
          return Promise.reject('请输入密码');
        }
      } else {
        return Promise.resolve();
      }
    };
    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      dataSourceCode: [
        {
          max: 30,
          trigger: 'change',
          message: '数据源编码长度最长为30位',
        },
        { required: true, message: () => '请输入数据源编码' },
      ],
      dbUrl: [{ required: true, message: () => '请输入数据库连接地址' }],
      username: [
        {
          max: 20,
          trigger: 'change',
          message: '用户名长度最长为20位',
        },
        { required: true, message: () => '请输入用户名' },
      ],
      password: [
        {
          min: 8,
          max: 20,
          trigger: 'change',
          message: '密码长度为8-20位',
        },
        { required: true, validator: validatePassword, trigger: 'change' },
      ],
    });

    const typeOps = ref([]);

    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);
    watchEffect(() => {
      if (props.model) {
        const raw = toRaw(props.model);
        loading.value = true;
        findDataSourceById(raw.dataSourceId)
          .then(({ success, result }) => {
            if (success && result) {
              Object.assign(modelRef, result);
            } else {
              message.error('获取信息失败');
              emit('cancel');
            }
          })
          .finally(() => {
            loading.value = false;
          });
      } else if (props.model === null) {
        resetFields();
      }
    });

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      try {
        await validate();
      } catch {
        return message.warning('校验失败');
      }
      loading.value = true;
      const data = toRaw(modelRef);
      delete data['language'];
      const { success, message: content } = await (data.dataSourceId
        ? updateDataSource
        : addDataSource)(data);
      loading.value = false;
      if (success) {
        message.success(data.dataSourceId ? '修改成功' : '新增成功');
        resetFields();
        emit('ok');
      } else {
        Modal.error({ title: '错误', content });
      }
    };
    return {
      loading,
      typeOps,
      modelRef,
      resetFields,
      ...formLayout,
      ...formItemLayout,
      validateInfos,
      initValues,
      handleSubmit,
    };
  },
});
</script>
