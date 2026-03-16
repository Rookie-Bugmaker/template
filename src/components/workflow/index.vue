<template>
  <process-approval
    v-if="processInstanceId"
    :processInstanceId="processInstanceId"
    :bizViewPath="bizViewPath"
    :functionId="functionId"
    :approvalButtonCustomStyle="approvalButtonCustomStyle"
    @handle="$emit('handle')"
  >
    <template #default v-if="approvalButtonText">
      {{ approvalButtonText }}
    </template>
    <template #bizView="slotProps">
      <slot name="bizView" v-bind="slotProps" />
    </template>
  </process-approval>
  <submit-for-approval
    v-else-if="bizId && templateAlias"
    :bizId="bizId"
    :bizCode="bizCode"
    :templateAlias="templateAlias"
    :formData="formData"
    :lowCodeFlag="lowCodeFlag"
    :objectId="objectId"
    :submitButtonCustomStyle="submitButtonCustomStyle"
    :submitBefore="submitBefore"
    @submit="$emit('handle')"
  >
    <template #default v-if="submitButtonText">
      {{ submitButtonText }}
    </template>
  </submit-for-approval>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SubmitForApproval from './submit-for-approval/index.vue';
import ProcessApproval from './process-approval/index.vue';

export default defineComponent({
  name: 'WorkflowButton',
  props: {
    //流程实例ID(已提交的工作流才会有这个ID)
    processInstanceId: {
      type: String,
      default: '',
    },
    //提交的业务数据的主键ID
    bizId: {
      type: String,
      default: '',
    },
    //提交的业务数据的单据编号
    bizCode: {
      type: String,
      default: '',
    },
    //提交的业务数据
    formData: {
      type: Object,
      required: true,
    },
    //工作流模板ID
    /* templateId: {
      type: String,
      default: '',
    }, */
    //工作流模板别名（编码，唯一标识）
    templateAlias: {
      type: String,
      default: '',
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
    //是否是低代码中使用的工作流
    lowCodeFlag: {
      type: Boolean,
      default: false,
    },
    //低代码工作流提交时需要带上对应功能的objectId
    objectId: {
      type: String,
      default: '',
    },
    //提交按钮文字
    submitButtonText: {
      type: String,
      default: '',
    },
    //审批/进度按钮文字
    approvalButtonText: {
      type: String,
      default: '',
    },
    // 提交按钮自定义样式
    submitButtonCustomStyle: {
      type: String || Object,
      default: '',
    },
    // 审批/进度按钮自定义样式
    approvalButtonCustomStyle: {
      type: String || Object,
      default: '',
    },
    submitBefore: {
      type: Function,
      default: () => true,
    },
  },
  emits: ['handle'],
  setup() {
    return {};
  },
  components: {
    SubmitForApproval,
    ProcessApproval,
  },
});
</script>

<style lang="less" scoped></style>
