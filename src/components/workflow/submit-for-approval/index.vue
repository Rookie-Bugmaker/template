<template>
  <a-button
    v-if="buttonType === 'button'"
    v-bind="$attrs"
    :disabled="disabled"
    :style="submitButtonCustomStyle"
    @click="handleOpenSubmitModal"
  >
    <slot>提交审批</slot>
  </a-button>
  <a-button
    v-else
    type="link"
    size="small"
    v-bind="$attrs"
    :disabled="disabled"
    :style="submitButtonCustomStyle"
    @click="handleOpenSubmitModal"
  >
    <slot>提交审批</slot>
  </a-button>
  <submit-modal
    v-model:open="state.submitModalVisible"
    :biz-id="bizId"
    :biz-code="bizCode"
    :template-alias="templateAlias"
    :form-data="formData"
    :lowCodeFlag="lowCodeFlag"
    :objectId="objectId"
    @ok="$emit('submit')"
  />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import type { PropType } from 'vue';
import SubmitModal from './submit-modal.vue';

type ButtonType = 'a' | 'button';

export default defineComponent({
  name: 'SubmitForApproval',
  props: {
    bizId: {
      type: String,
      required: true,
    },
    bizCode: {
      type: String,
      default: '',
    },
    templateAlias: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    //是否是低代码中使用的工作流
    lowCodeFlag: {
      type: Boolean,
      defalut: false,
    },
    //低代码工作流提交时需要带上对应功能的objectId
    objectId: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String as PropType<ButtonType>,
      default: 'a',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 提交按钮自定义样式
    submitButtonCustomStyle: {
      type: String || Object,
      default: '',
    },
    submitBefore: {
      type: Function,
      default: () => true,
    },
  },
  emits: ['submit'],
  setup(props) {
    const state = reactive({
      submitModalVisible: false,
    });

    const handleOpenSubmitModal = async () => {
      if (props.disabled) {
        return;
      }
      const submitBeforeRet = await props.submitBefore?.();
      if (!submitBeforeRet) {
        return;
      }
      state.submitModalVisible = true;
    };

    return {
      state,
      handleOpenSubmitModal,
    };
  },
  components: {
    SubmitModal,
  },
});
</script>

<style lang="less" scoped></style>
