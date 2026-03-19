<template>
  <a-popover v-model:open="open" trigger="click">
    <template #title>
      <div style="font-size: 14px; margin: 5px 0; font-weight: bold">
        {{ model?.uid ? '编辑' : '新增' }}语言方案
      </div>
    </template>
    <template #content>
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 280px">
        <a-form-item label="中文" v-bind="validateInfos['zh-CN']">
          <a-input v-model:value="modelRef['zh-CN']" />
        </a-form-item>
        <a-form-item label="英文" v-bind="validateInfos['en-US']">
          <a-input v-model:value="modelRef['en-US']" />
        </a-form-item>
        <a-form-item
          label=""
          :wrapper-col="{ span: 24 }"
          style="text-align: right; margin-bottom: 0"
        >
          <a-space>
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleSubmit">确定</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </template>
    <template #default>
      <slot />
    </template>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRaw, watch } from 'vue';
import { Form, message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { generateKey } from '../../../utils/key';

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
export default defineComponent({
  name: 'EditForm',
  props: {
    model: {
      type: Object,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const open = ref(false);

    const initValues = () => ({
      uid: null,
      'zh-CN': '',
      'en-US': '',
    });

    const modelRef = reactive(initValues());

    const rulesRef = reactive({
      'zh-CN': [
        {
          required: true,
          message: '请输入中文',
        },
      ],
      'en-US': [
        {
          required: true,
          message: '请输入英文',
        },
      ],
    });
    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);

    const reset = () => {
      Object.assign(modelRef, initValues());
    };

    watch(
      open,
      (n, o) => {
        if (n && n !== o) {
          if (props.model && props.model.uid) {
            const raw = toRaw(props.model);
            Object.assign(modelRef, raw);
          } else {
            reset();
            Object.assign(modelRef, initValues());
          }
        }
      },
      {
        immediate: true,
      },
    );

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      validate()
        .then(async () => {
          const data = cloneDeep(modelRef);
          if (!data.uid) {
            data.uid = generateKey();
          }
          emit('ok', data);
          reset();
          open.value = false;
        })
        .catch(() => {
          message.warning('校验失败');
        });
    };

    const handleCancel = () => {
      reset();
      emit('cancel');
      open.value = false;
    };

    return {
      ...formLayout,
      open,
      initValues,
      modelRef,
      handleSubmit,
      resetFields,
      validateInfos,
      reset,
      handleCancel,
    };
  },
  components: {},
});
</script>
