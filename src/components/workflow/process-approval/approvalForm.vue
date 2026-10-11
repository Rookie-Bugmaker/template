<template>
  <a-spin :spinning="state.loading">
    <approval-header :instance-data="state.instanceData" />
    <approval-steps
      ref="stepsRef"
      :steps="state.steps"
      :task-data="state.taskData"
      :selected-node-id="state.selectedNodeId"
      :readonly="!approvalRule.allowOperation"
      :disabled-select-step="!approvalRule.allowOperation && state.showAll"
      @update-task-data="handleUpdateTaskData"
      @select-step="handleSelectStep"
    />
    <detail-table
      v-model:show-all="state.showAll"
      :node-detail-data="state.nodeDetailData"
      :all-detail-data="state.allDetailData"
      :show-toolbar="true"
    />
    <template v-if="approvalRule.allowOperation && approvalRule.allowUploadAttachment">
      <label
        :class="['comment-label', { 'is-required': approvalRule.requireUploadAttachment }]"
      >
        附件：
      </label>
      <upload-file
        multiple
        v-model:value="operationParams.attachmentId"
        type="input"
        style="margin-bottom: 5px"
        :accept="approvalRule.attachmentAccept ? approvalRule.attachmentAccept : ''"
      ></upload-file>
    </template>
    <template v-if="approvalRule.allowOperation">
      <label :class="['comment-label', { 'is-required': approvalRule.requiredComment }]">
        审批意见：
      </label>
      <a-textarea
        v-model:value.trim="operationParams.comment"
        placeholder="请输入审批意见"
        :auto-size="{ minRows: 4, maxRows: 6 }"
      />
    </template>
    <dynamic-approval-form
      v-if="currentStep?.dynamicApprovalForm"
      :config="currentStep?.dynamicApprovalForm"
      ref="dynamicApprovalFormRef"
    />
  </a-spin>
  <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px">
    <a-dropdown v-if="approvalRule.allowOperation">
      <template #overlay>
        <a-menu :disabled="state.loading">
          <a-menu-item
            v-if="approvalRule.allowTransfer"
            :key="Operation.Deliver"
            @click="handleSelectUser(Operation.Deliver)"
          >
            转交
          </a-menu-item>
          <a-menu-item
            v-if="approvalRule.allowRollBack"
            :key="Operation.Reject"
            @click="handleClickOperation(Operation.Reject)"
          >
            驳回
          </a-menu-item>
          <a-menu-item
            v-if="approvalRule.allowApostille"
            :key="Operation.PlusSign"
            @click="handleSelectUser(Operation.PlusSign)"
          >
            加签
          </a-menu-item>
        </a-menu>
      </template>
      <a-button>
        更多
        <DownOutlined />
      </a-button>
    </a-dropdown>
    <a-button
      v-if="approvalRule.allowOperation && approvalRule.allowSendBack"
      :key="Operation.SendBack"
      :loading="state.loading"
      @click="handleClickOperation(Operation.SendBack)"
    >
      退回
    </a-button>
    <a-button
      v-if="approvalRule.allowOperation && approvalRule.allowRefuse"
      :key="Operation.Refuse"
      :loading="state.loading"
      @click="handleClickOperation(Operation.Refuse)"
    >
      拒绝
    </a-button>
    <a-button
      v-if="approvalRule.allowOperation"
      :key="Operation.Done"
      type="primary"
      :loading="state.loading"
      @click="handleClickOperation(Operation.Done)"
    >
      同意
    </a-button>
  </div>
  <user-select-modal
    v-if="userSelectState.open"
    v-model:open="userSelectState.open"
    :title="userSelectState.title"
    :multiple="userSelectState.operationKey == Operation.PlusSign ? true : false"
    @ok="
      rows => {
        userSelectState.seletedRows = rows;
        userSelectState.open = false;
        handleClickOperation(userSelectState.operationKey);
      }
    "
    @cancel="
      () => {
        userSelectState.seletedRows = [];
        userSelectState.open = false;
      }
    "
  />
</template>

<script lang="ts">
import { defineComponent, watch, reactive, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { isEmpty, cloneDeep, orderBy } from 'lodash';
import {
  getRunningSequenceGraph,
  processDone,
  processDeliver,
  processRefuse,
  processReject,
  processPlusSign,
  processResolve,
  processSendBack,
  OperationAuthority,
  ProcessStatus,
} from '@/api/workflow/instance/index';
import type {
  ProcessOperationParams,
  SequenceGraphItem,
  InstanceData,
} from '@/api/workflow/instance/index';

import ApprovalHeader from './approval-header.vue';
import ApprovalSteps from './approval-steps.vue';
import DetailTable from './detail-table.vue';
import UserSelectModal from '@/components/user-tag-selet/select-modal.vue';
import DynamicApprovalForm from '@/components/workflow/dynamic-approval-form/index.vue';
import UploadFile from '@/components/upload-file/index.vue';

enum Operation {
  Done = 1, // 同意
  Deliver = 2, // 转交
  Reject = 3, // 驳回
  Refuse = 4, // 拒绝
  PlusSign = 5, // 加签
  Resolve = 6, // 加签完成
  SendBack = 7, // 退回
}

export default defineComponent({
  name: 'ApprovalForm',
  props: {
    processInstanceId: {
      type: String,
      required: true,
    },
  },
  emits: ['handle'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      steps: [] as SequenceGraphItem[],
      taskData: [] as Record<string, string[]>[],
      instanceData: {} as InstanceData,
      selectedNodeId: '',
      nodeDetailData: [] as any[],
      allDetailData: [] as any[],
      showAll: true,
    });

    const stepsRef = ref(null);
    const dynamicApprovalFormRef = ref(null);

    // ---- 审批规则 ----
    const initApprovalRule = () => ({
      allowTransfer: false,
      allowApostille: false,
      allowRollBack: false,
      requiredComment: false,
      allowOperation: false,
      allowSendBack: false,
      allowRefuse: false,
      allowUploadAttachment: false,
      requireUploadAttachment: false,
      attachmentAccept: '',
    });
    const approvalRule = reactive(initApprovalRule());

    const getApprovalRule = () => {
      Object.assign(approvalRule, initApprovalRule());
      const currentStep = state.steps.find(f => f.isCurrentNode === true);
      if (
        currentStep?.operationAuthority &&
        state.instanceData.processStatus === ProcessStatus.InProgress
      ) {
        approvalRule.allowOperation = currentStep.operationAuthority.includes(
          OperationAuthority.Done,
        );
        approvalRule.allowTransfer = currentStep.operationAuthority.includes(
          OperationAuthority.Deliver,
        );
        approvalRule.allowApostille = currentStep.operationAuthority.includes(
          OperationAuthority.PlusSign,
        );
        approvalRule.allowRollBack = currentStep.operationAuthority.includes(
          OperationAuthority.Reject,
        );
        approvalRule.allowSendBack = currentStep.operationAuthority.includes(
          OperationAuthority.SendBack,
        );
        approvalRule.allowRefuse = currentStep.operationAuthority.includes(
          OperationAuthority.Refuse,
        );
        approvalRule.requiredComment = currentStep.requiredComment;
        approvalRule.allowUploadAttachment = currentStep.allowUploadAttachment;
        approvalRule.requireUploadAttachment = currentStep.requireUploadAttachment;
        approvalRule.attachmentAccept = currentStep.attachmentAccept;
      }
    };

    // ---- 明细数据 ----
    const getDetailData = (sequenceGraph: SequenceGraphItem[]) => {
      return (
        sequenceGraph?.reduce((a, b, index) => {
          const copyInfo = cloneDeep(b);
          delete copyInfo['approvalRecords'];
          const record =
            b.approvalRecords?.map(m => {
              return Object.assign(m, {
                nodeInfo: copyInfo,
                nodeIndex: index,
              });
            }) || [];
          return a.concat(record);
        }, []) || []
      );
    };

    // ---- 加载工作流数据 ----
    const getInstanceData = () => {
      state.loading = true;
      state.steps = [];
      state.taskData = [];
      Object.assign(operationParams, initOperationParams());
      getRunningSequenceGraph(props.processInstanceId)
        .then(res => {
          if (res.success) {
            state.instanceData = res.result;
            state.steps = res.result.sequenceGraph || [];
            state.allDetailData = getDetailData(res.result.sequenceGraph);
            state.allDetailData = orderBy(
              state.allDetailData,
              ['createTime', 'handleTime'],
              ['desc', 'desc'],
            );

            // 历史审批数据（被拒绝或终止的审批实例数据）
            const historyRecord =
              res.result?.hisRunningInfoList?.reduce((a: any[], b: any) => {
                const record = getDetailData(b.sequenceGraph);
                return a.concat(record);
              }, []) || [];
            if (historyRecord?.length) {
              state.allDetailData.push(
                { divider: true } as any,
                ...orderBy(historyRecord, ['createTime', 'handleTime'], ['desc', 'desc']),
              );
            }

            state.taskData.push({ start_event: [] });
            state.steps.forEach(f => {
              state.taskData.push({ [f.nodeId]: [] });
            });
            state.taskData.push({ end_event: [] });

            if (state.steps.length) {
              const currentStep = state.steps.find(f => f.isCurrentNode === true);
              currentStep && handleSelectStep(currentStep);
            }
            getApprovalRule();
          } else {
            message.error(res.message);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    // ---- 操作参数 ----
    const initOperationParams = (): ProcessOperationParams => {
      return {
        userId: '',
        userIds: [],
        processInstanceId: props.processInstanceId,
        comment: '',
        extra: {
          taskData: [],
        },
        dynamicApprovalFormValues: null,
        attachmentId: null,
      };
    };
    const operationParams: ProcessOperationParams = reactive(initOperationParams());

    const operationApiMap = {
      [Operation.Done]: processDone,
      [Operation.Deliver]: processDeliver,
      [Operation.Reject]: processReject,
      [Operation.Refuse]: processRefuse,
      [Operation.PlusSign]: processPlusSign,
      [Operation.Resolve]: processResolve,
      [Operation.SendBack]: processSendBack,
    };

    // ---- 选人弹窗 ----
    const initUserSelectState = () => ({
      open: false,
      seletedRows: [] as any[],
      title: '',
      operationKey: Operation.Deliver,
    });
    const userSelectState = reactive(initUserSelectState());

    const handleSelectUser = (operationKey: Operation) => {
      Object.assign(userSelectState, initUserSelectState());
      if (operationKey === Operation.Deliver) {
        userSelectState.operationKey = Operation.Deliver;
        userSelectState.title = '转交';
      }
      if (operationKey === Operation.PlusSign) {
        userSelectState.operationKey = Operation.PlusSign;
        userSelectState.title = '加签';
      }
      userSelectState.open = true;
    };

    // ---- 动态表单 ----
    const currentStep = computed(() => state.steps.find(f => f.isCurrentNode === true));

    const validateDynamicApprovalForm = async () => {
      if (dynamicApprovalFormRef?.value) {
        const r = await dynamicApprovalFormRef?.value?.validate();
        return r;
      }
      return true;
    };

    const getDynamicApprovalFormValues = () => {
      return dynamicApprovalFormRef?.value?.getValues();
    };

    // ---- 执行操作 ----
    const executeOperation = (operationKey: Operation, otherParams?: Record<string, any>) => {
      state.loading = true;
      operationParams.extra.taskData = state.taskData;
      operationParams.dynamicApprovalFormValues = getDynamicApprovalFormValues();
      operationApiMap[operationKey](Object.assign({}, operationParams, otherParams))
        .then(res => {
          if (res.success) {
            message.success(res.message);
            emit('handle');
          } else {
            message.error(res.message);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    const operationFunc = {
      [Operation.Done]: async () => {
        if (!stepsRef.value?.validate()) {
          message.warning('请选择人员');
          return;
        }
        if (
          approvalRule.allowUploadAttachment &&
          approvalRule.requireUploadAttachment &&
          isEmpty(operationParams.attachmentId)
        ) {
          message.warning('请上传附件');
          return;
        }
        if (approvalRule.requiredComment && isEmpty(operationParams.comment)) {
          message.warning('请输入审批意见');
          return;
        }
        const v = await validateDynamicApprovalForm();
        if (!v) {
          message.warning('校验失败');
          return;
        }
        executeOperation(Operation.Done);
      },
      [Operation.Deliver]: () => {
        if (userSelectState.seletedRows.length) {
          userSelectState.open = false;
          operationParams.userId = userSelectState.seletedRows.map(m => m.userId).join(',');
          executeOperation(Operation.Deliver);
        } else {
          message.warning('请选择转交用户');
        }
      },
      [Operation.Reject]: () => {
        if (operationParams.comment) {
          executeOperation(Operation.Reject);
        } else {
          message.warning('请输入审批意见');
        }
      },
      [Operation.Refuse]: () => {
        if (operationParams.comment) {
          executeOperation(Operation.Refuse);
        } else {
          message.warning('请输入审批意见');
        }
      },
      [Operation.SendBack]: () => {
        if (!operationParams.comment) {
          message.warning('请输入审批意见');
        } else {
          executeOperation(Operation.SendBack);
        }
      },
      [Operation.PlusSign]: () => {
        if (userSelectState.seletedRows.length) {
          userSelectState.open = false;
          operationParams.userId = userSelectState.seletedRows.map(m => m.userId).join(',');
          executeOperation(Operation.PlusSign, {
            userIds: userSelectState.seletedRows.map(m => m.userId),
            beforeAddSign: 'Y',
          });
        } else {
          message.warning('请选择加签用户');
        }
      },
      [Operation.Resolve]: () => {
        executeOperation(Operation.Resolve);
      },
    };

    const handleClickOperation = (operationKey: Operation) => {
      operationFunc[operationKey]();
    };

    // ---- 步骤交互 ----
    const handleUpdateTaskData = (taskId: string, ids: string[]) => {
      state.taskData.find(f => Object.keys(f).includes(taskId))![taskId] = ids;
    };

    const handleSelectStep = (item: Partial<SequenceGraphItem>) => {
      state.selectedNodeId = item.nodeId || '';
      state.nodeDetailData = orderBy(
        item.approvalRecords || [],
        ['createTime', 'handleTime'],
        ['desc', 'desc'],
      );
    };

    // ---- 监听 processInstanceId 变化自动加载 ----
    watch(
      () => props.processInstanceId,
      val => {
        if (val) {
          getInstanceData();
        }
      },
      { immediate: true },
    );

    return {
      state,
      stepsRef,
      dynamicApprovalFormRef,
      approvalRule,
      operationParams,
      Operation,
      userSelectState,
      currentStep,
      handleSelectUser,
      handleClickOperation,
      handleUpdateTaskData,
      handleSelectStep,
    };
  },
  components: {
    ApprovalHeader,
    ApprovalSteps,
    DetailTable,
    UserSelectModal,
    DynamicApprovalForm,
    UploadFile,
    DownOutlined,
  },
});
</script>

<style lang="less" scoped>
.comment-label {
  display: block;
  margin-bottom: 5px;
  margin-top: 8px;
  &.is-required::before {
    position: relative;
    margin-right: 5px;
    color: red;
    content: '*';
  }
}
</style>
