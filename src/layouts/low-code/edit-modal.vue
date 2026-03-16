<template>
  <yl-modal
    :title="`分组${modelRef.groupId ? '编辑' : '新增'}`"
    :open="open"
    :confirmLoading="loading"
    :width="480"
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
        <a-form-item label="分组名称" v-bind="validateInfos.groupName">
          <a-input v-model:value="modelRef.groupName" placeholder="请输入人分组名称" />
        </a-form-item>
        <a-form-item label="状态" v-bind="validateInfos.status">
          <a-radio-group v-model:value="modelRef.status" button-style="solid">
            <a-radio-button value="Y">正常</a-radio-button>
            <a-radio-button value="N">禁用</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts">
import { Form, message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRaw, watch } from 'vue';
import type { PropType } from 'vue';
import { addGroup, updateGroup } from '@/api/low-code/group';
import type { GroupOperation } from '@/api/low-code/group';
import { useRoute } from 'vue-router';
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
export default defineComponent({
  name: 'EditModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object as PropType<GroupOperation | null>,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const route = useRoute();
    const loading = ref(false);
    const initValues = (): GroupOperation => ({
      applicationId: route.params.applicationId as string,
      groupId: null,
      groupName: '',
      status: 'Y',
    });
    const modelRef = reactive<GroupOperation>(initValues());

    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      groupName: [{ required: true, message: () => '请输入分组名称' }],
      status: [{ required: true }],
    });

    watch(
      () => props.model,
      model => {
        if (model) {
          const raw = toRaw(model);
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
          delete data['language'];
          if (!data.groupId) {
            addGroup(data)
              .then(res => {
                if (res.success) {
                  message.success('新增分组成功');
                  resetFields();
                  emit('ok', res);
                } else {
                  message.warning(res.message);
                }
              })
              .finally(() => {
                loading.value = false;
              });
          } else {
            updateGroup(data)
              .then(res => {
                if (res.success) {
                  message.success('修改分组成功');
                  resetFields();
                  emit('ok', res);
                } else {
                  message.warning(res.message);
                }
              })
              .finally(() => {
                loading.value = false;
              });
          }
        })
        .catch(() => {
          message.warning('验证失败');
          loading.value = false;
        });
    };

    return {
      ...formLayout,
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
