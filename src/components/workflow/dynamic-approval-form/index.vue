<template>
  <a-form v-if="formConfig && formConfig.enabled" class="dynamic-form">
    <dynamic-item
      v-for="item in formConfig.items"
      :key="item.uid"
      :config="item"
      v-model:value="state[`widget_${item.uid}`]"
      :disabled="disabled || readonlyAttrs[`widget_${item.uid}`]"
      :hidden="hiddenAttrs[`widget_${item.uid}`]"
      v-bind="validateInfos[`widget_${item.uid}`]"
    />
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRaw, watch } from 'vue';
import { Form } from 'ant-design-vue';
import type { DynamicApprovalForm, DynamicApprovalFormItem } from '@/api/workflow/template/typing';
import DynamicItem from './dynamic-item.vue';

export default defineComponent({
  name: 'DynamicApprovalForm',
  props: {
    config: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { expose }) {
    const formConfig = computed<DynamicApprovalForm>(() => {
      return props.config ? JSON.parse(props.config) : null;
    });

    const state = reactive({});

    const rulesRef = reactive({});

    const initForm = () => {
      const items = formConfig?.value?.items as DynamicApprovalFormItem[];
      items?.forEach(item => {
        const fieldKey = `widget_${item.uid}`;

        //设置默认值
        const dv = item.defaultValue ?? null;
        state[fieldKey] = dv;

        //构建验证
        if (item?.required === 'Y' || item?.required === 'Func') {
          rulesRef[fieldKey] = [];

          if (item?.required === 'Y') {
            rulesRef[fieldKey].push({
              required: true,
              message: '此项必填',
            });
          } else if (item?.required === 'Func') {
            const f = eval(
              `(async function x (state, rule, value, callback){${item.requiredFunc}})`,
            );
            const ruleItem = {
              trigger: 'change',
            };
            ruleItem['validator'] = async function v(rule, value, callback) {
              return await f(state, rule, value, callback);
            };
            rulesRef[fieldKey].push(ruleItem);
          }
        }
      });
      //查看的情况下使用已记录表单数据值
      Object.assign(state, props.formData);
    };

    watch(
      () => formConfig.value,
      n => {
        if (n) {
          initForm();
        }
      },
      {
        immediate: true,
      },
    );

    const { validate: valid, validateInfos } = Form.useForm(state, rulesRef);

    const validate = async () => {
      try {
        await valid();
        return true;
      } catch {
        return false;
      }
    };

    const hiddenAttrs = computed(() => {
      const items = formConfig?.value?.items as DynamicApprovalFormItem[];
      const attrs = {};
      items?.forEach(item => {
        const fieldKey = `widget_${item.uid}`;

        if (item?.hidden === 'Y') {
          attrs[fieldKey] = true;
        } else if (item?.hidden === 'Func') {
          const f = eval(`( function x (state){${item.hiddenFunc}})`);
          attrs[fieldKey] = f(state);
        } else {
          attrs[fieldKey] = false;
        }
      });

      return attrs;
    });

    const readonlyAttrs = computed(() => {
      const items = formConfig?.value?.items as DynamicApprovalFormItem[];
      const attrs = {};
      items?.forEach(item => {
        const fieldKey = `widget_${item.uid}`;

        if (item?.readonly === 'Y') {
          attrs[fieldKey] = true;
        } else if (item?.readonly === 'Func') {
          const f = eval(`( function x (state){${item.readonlyFunc}})`);
          attrs[fieldKey] = f(state);
        } else {
          attrs[fieldKey] = false;
        }
      });

      return attrs;
    });

    const getValues = () => {
      return JSON.stringify(toRaw(state));
    };

    expose({ validate, getValues });

    return {
      state,
      formConfig,
      validate,
      getValues,
      valid,
      validateInfos,
      hiddenAttrs,
      readonlyAttrs,
    };
  },
  components: {
    DynamicItem,
  },
});
</script>

<style lang="less" scoped>
.dynamic-form {
  margin-top: 24px;
}
</style>
