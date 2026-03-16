<template>
  <yl-modal
    title="修改密码"
    :open="open"
    destroy-on-close
    :closable="!canNotClose"
    :maximizable="false"
    @cancel="
      () => {
        if (!canNotClose) {
          resetFields();
          $emit('cancel');
        }
      }
    "
    @ok="handleChange"
  >
    <a-alert
      v-if="canNotClose"
      :message="`请修改密码，密码修改后系统方可继续使用`"
      type="warning"
      show-icon
      style="margin-bottom: 18px"
    />
    <a-alert
      v-else-if="passwordExpireDate"
      :message="`您的密码将于${passwordExpireDate}过期，请及时修改密码`"
      type="warning"
      show-icon
      style="margin-bottom: 18px"
    />
    <a-form
      :model="modelRef"
      ref="formRef"
      name="basic"
      :label-col="formLayout.labelCol"
      :wrapper-col="formLayout.wrapperCol"
      autocomplete="off"
    >
      <a-form-item label="原密码" name="rawPwd" v-bind="validateInfos.rawPwd">
        <a-input
          v-model:value="modelRef.rawPwd"
          :type="old ? 'text' : 'password'"
          placeholder="请输入原密码"
        >
          <template #suffix>
            <span class="icon-eye" @click="() => (old = !old)">
              <eye-outlined v-if="old" />
              <eye-invisible-outlined v-else />
            </span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="新密码" name="newPwd" v-bind="validateInfos.newPwd">
        <password-strong-check-input
          v-model:model-value="modelRef.newPwd"
          v-model:password-level="passwordLevel"
          placeholder="请输入新密码"
        ></password-strong-check-input>
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPwd" v-bind="validateInfos.confirmPwd">
        <a-input
          v-model:value="modelRef.confirmPwd"
          :type="confirm ? 'text' : 'password'"
          placeholder="确认新密码"
        >
          <template #suffix>
            <span class="icon-eye" @click="() => (confirm = !confirm)">
              <eye-outlined v-if="confirm" />
              <eye-invisible-outlined v-else />
            </span>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <yl-button
        v-if="!canNotClose"
        act-type="cancel"
        @click="
          () => {
            if (!canNotClose) {
              resetFields();
              $emit('cancel');
            }
          }
        "
      ></yl-button>
      <yl-button act-type="save" @click="handleChange" :loading="loading"></yl-button>
    </template>
  </yl-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, toRefs, computed } from 'vue';
import { Form, message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';

import passwordStrongCheckInput from '@/views/system/user/components/password-strong-check-input.vue';
import { editPwd } from '@/api/system/user/index';

import { useUserStore } from '@/store/user';
import { Alert as AAlert } from 'ant-design-vue';

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
export default defineComponent({
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    canNotClose: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['cancel', 'ok'],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const passwordExpireDate = computed(() => userStore.passwordExpireDate);

    const loading = ref(false);

    // 表格初始数据
    const initValues = () => ({
      rawPwd: '',
      newPwd: '',
      confirmPwd: '',
    });

    // 表单数据
    const modelRef = reactive(initValues());

    // 密码强度
    const passwordLevel = ref(0);
    // 表单校验
    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      rawPwd: [{ required: true, message: '请输入原密码' }],
      newPwd: [
        {
          min: 8,
          trigger: 'change',
          message: '密码长度至少为8位',
        },
        { required: true, message: '请输入新密码' },
      ],
      confirmPwd: [
        {
          validator: async (_rule: Rule, value: string) => {
            if (value && modelRef.newPwd != value) {
              return Promise.reject('两次密码不一致');
            } else {
              Promise.resolve();
            }
          },
        },
        { required: true, message: '请输入确认密码' },
      ],
    });
    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);

    // 确认修改密码
    const handleChange = async () => {
      const valid = await validate();
      if (valid) {
        if (passwordLevel.value < 3) {
          message.warning('新密码强度太低!');
          return;
        }
        loading.value = true;
        const { success, message: msg } = await editPwd(modelRef);
        if (success) {
          message.success('修改成功');
          resetFields();
          emit('ok');
        } else {
          message.warn(msg);
        }
        loading.value = false;
      }
    };
    const initVisibilityToggle = () => ({
      old: false,
      confirm: false,
    });
    const visibilityToggle = reactive(initVisibilityToggle());
    watch(
      () => props.open,
      open => {
        if (open) {
          Object.assign(visibilityToggle, initVisibilityToggle());
        }
      },
    );
    return {
      loading,
      formLayout,
      modelRef,
      passwordLevel,
      handleChange,
      resetFields,
      validateInfos,
      ...toRefs(visibilityToggle),
      passwordExpireDate,
    };
  },
  components: { passwordStrongCheckInput, AAlert },
});
</script>
<style lang="less" scoped>
.icon-eye {
  margin-left: 5px;
  color: #00000073;
  cursor: pointer;
  &:hover {
    color: #000000d9;
  }
}
</style>
