<template>
  <a-button
    v-if="buttonType === 'button'"
    v-bind="$attrs"
    :disabled="disabled"
    :style="approvalButtonCustomStyle"
    @click="handleOpenModal"
  >
    <slot name="default">审批/进度</slot>
  </a-button>
  <a-button
    v-else
    type="link"
    size="small"
    v-bind="$attrs"
    :disabled="disabled"
    @click="handleOpenModal"
  >
    <slot name="default">审批/进度</slot>
  </a-button>
  <approval-modal
    v-if="state.modalVisible"
    v-model:open="state.modalVisible"
    :style="approvalButtonCustomStyle"
    :process-instance-id="processInstanceId"
    :bizViewPath="bizViewPath"
    :functionId="functionId"
    @handle="$emit('handle')"
  >
    <template #bizView="slotProps">
      <slot name="bizView" v-bind="slotProps"></slot>
    </template>
  </approval-modal>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import type { PropType } from 'vue';
import ApprovalModal from './approval-modal.vue';

type ButtonType = 'a' | 'button';

export default defineComponent({
  name: 'ProcessApproval',
  inheritAttrs: false,
  props: {
    processInstanceId: {
      type: String,
      required: true,
    },
    //优先级bizView插槽>bizViewPath>functionId
    //流程审批界面中的业务数据查看页路径（也可以通过插槽bizView方式引入）
    bizViewPath: {
      type: String,
      default: '',
    },
    //根据functionId查找组件路径，会寻找与此组件同目录下找名为approval-view.vue的组件，作为流程审批界面中的业务数据查看页
    functionId: {
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
    // 审批/进度按钮自定义样式
    approvalButtonCustomStyle: {
      type: String || Object,
      default: '',
    },
  },
  emits: ['handle'],
  setup(props) {
    const state = reactive({
      modalVisible: false,
    });

    const handleOpenModal = () => {
      if (props.disabled) {
        return;
      }
      state.modalVisible = true;
    };

    return {
      state,
      handleOpenModal,
    };
  },
  components: {
    ApprovalModal,
  },
});
</script>

<style lang="less" scoped></style>
