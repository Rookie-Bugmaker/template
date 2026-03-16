<template>
  <yl-modal
    title="审批/进度"
    :open="open"
    :width="1150"
    :confirmLoading="state.loading"
    :maskClosable="false"
    centered
    @cancel="handleCancel"
    :footer="approvalRule.allowOperation === false ? null : undefined"
  >
    <a-tabs
      v-model:activeKey="state.activeKey"
      tabPosition="left"
      class="approval-tabs"
      :tabBarGutter="20"
    >
      <a-tab-pane key="1">
        <template #tab>
          <span class="tab-title">
            <apartment-outlined />
            流程图
          </span>
        </template>
        <a-spin :spinning="state.loading">
          <approval-header :instance-data="state.instanceData" />
          <approval-steps
            ref="stepsRef"
            :steps="state.steps"
            :task-data="state.taskData"
            @update-task-data="handleUpdateTaskData"
            @select-step="handleSelectStep"
            :selected-node-id="state.selectedNodeId"
            :readonly="!approvalRule.allowOperation"
            :disabledSelectStep="state.showAll"
          />
          <detail-table
            v-model:show-all="state.showAll"
            :node-detail-data="state.nodeDetailData"
            :all-detail-data="state.allDetailData"
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
            ref="dynamicApprovalForm"
          />
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" forceRender>
        <template #tab>
          <span class="tab-title">
            <file-done-outlined />
            单据明细
          </span>
        </template>
        <slot
          name="bizView"
          :biz-id="state.bizId"
          :editable="state.editPermissions.enable"
          :nodeCode="currentStep?.nodeCode"
          :setRef="setBizViewComponentRef"
        >
          <suspense>
            <component
              v-if="bizViewComponent"
              :is="bizViewComponent"
              :biz-id="state.bizId"
              :function-id="functionId"
              :page-id="state.pageId"
              :editable="state.editPermissions.enable"
              :nodeCode="currentStep?.nodeCode"
              :componentPath="state.function?.component"
              :projectPath="state.function?.project?.url"
              :processInstanceId="processInstanceId"
              ref="bizViewComponentRef"
            ></component>
            <template #fallback>
              <fragment>
                <a-skeleton active />
                <a-skeleton active />
              </fragment>
            </template>
          </suspense>
        </slot>
      </a-tab-pane>
    </a-tabs>

    <template #footer>
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
            <!-- <a-menu-item :key="Operation.Resolve" @click="handleClickOperation(Operation.Resolve)">
              加签完成
            </a-menu-item> -->
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
    </template>
  </yl-modal>
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
  <!-- :max-select-num="1" -->
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, watch, reactive, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
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
import { findFunctionById, type FunctionItem } from '@/api/system/function/index';

import ApprovalHeader from './approval-header.vue';
import ApprovalSteps from './approval-steps.vue';
import DetailTable from './detail-table.vue';
import UserSelectModal from '@/components/user-tag-selet/select-modal.vue';
import DynamicApprovalForm from '@/components/workflow/dynamic-approval-form/index.vue';
import UploadFile from '@/components/upload-file/index.vue';

import { Skeleton as ASkeleton } from 'ant-design-vue';

enum Operation {
  Done = 1, //同意
  Deliver = 2, //转交
  Reject = 3, //驳回
  Refuse = 4, //拒绝
  PlusSign = 5, //加签
  Resolve = 6, //加签完成任务
  SendBack = 7, //退回到发起人
}

export default defineComponent({
  name: 'ApprovalModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
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
  },
  emits: ['handle', 'cancel', 'update:open'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      steps: [] as SequenceGraphItem[],
      taskData: [],
      bizId: '',
      instanceData: {} as InstanceData,
      selectedNodeId: '', //选中的节点的ID
      nodeDetailData: [], //选中节点的审批记录数据
      allDetailData: [], //全部节点审批记录数据（按开始时间倒序排）
      showAll: true, //是否展示全部数据
      activeKey: '1',
      pageId: '', //低代码的页面id
      editPermissions: {
        //表单编辑权限
        enable: false,
      },
      function: null as FunctionItem,
    });

    const stepsRef = ref(null);

    const bizViewComponentRef = ref(null);
    //使用插槽的方式时，使用此方法获取组件ref,明细页组件使用时，需要这样:ref="setRef"
    const setBizViewComponentRef = e => {
      if (e) {
        bizViewComponentRef.value = e;
      }
    };

    //调用审批明细页保存
    const saveData = async () => {
      //如果审批明细页没有设定保存方法，则直接返回true
      if (!bizViewComponentRef.value?.saveData) {
        return true;
      }
      const result = await bizViewComponentRef.value?.saveData();
      //审批明细页保存成功需要返回true用作保存成功判定
      return result === true;
    };

    const bizViewComponent = defineAsyncComponent(async () => {
      if (props.bizViewPath) {
        return import(/* @vite-ignore */ `../../../views/${props.bizViewPath}.vue`);
      } else if (props.functionId) {
        const { success, result } = await findFunctionById(props.functionId);
        if (success && result) {
          //有pageId的是低代码生成的页面
          if (result.pageId) {
            state.pageId = result.pageId;
            //防止子应用路径不存在报错
            const lowcodePath = 'low-code/parser';
            return import(/* @vite-ignore */ `../../../views/${lowcodePath}/approval-view.vue`);
          } else {
            //如果绑定了项目，且功能不在本主应用内，需要通过iframe方式加载页面
            const currentProjectCode = process.env.VUE_APP_PROJECT_CODE;
            if (result.project?.name && result.project?.name !== currentProjectCode) {
              state.function = result;
              return import(/* @vite-ignore */ `./sub-service-page.vue`);
            } else {
              const path = result.component.slice(0, result.component.lastIndexOf('/'));
              return import(/* @vite-ignore */ `../../../views/${path}/approval-view.vue`);
            }
          }
        } else {
          return null;
        }
      }
    });

    const initApprovalRule = () => {
      return {
        allowTransfer: false, //允许转交 1是 0 否
        allowApostille: false, //允许加签 1是 0 否
        allowRollBack: false, //允许驳回 1是 0 否
        requiredComment: false, //要求填写审批意见 1是 0 否
        allowOperation: false, //允许操作
        allowSendBack: false, //允许退回
        allowRefuse: false, //允许拒绝
        allowUploadAttachment: false, //允许上传附件

        requireUploadAttachment: false, //要求上传附件
        attachmentAccept: '', //上传文件类型限制
      };
    };

    const approvalRule = reactive(initApprovalRule());

    const getApprovalRule = () => {
      Object.assign(approvalRule, initApprovalRule());
      const currentStep = state.steps.find(f => f.isCurrentNode === true);
      //没有进行中的节点表示流程已结束（默认状态所有操作不可用）
      if (
        currentStep?.operationAuthority &&
        state.instanceData.processStatus === ProcessStatus.InProgress
      ) {
        //判断当前查看的用户是否有操作当前进行中的节点的权限
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

    //获取所有节点下的明细数据
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

    const getInstanceData = () => {
      state.loading = true;
      state.steps = [];
      state.taskData = [];
      Object.assign(operationParams, initOperationParams());
      getRunningSequenceGraph(props.processInstanceId)
        .then(res => {
          if (res.success) {
            state.bizId = res.result.bizId;
            state.instanceData = res.result;
            state.editPermissions = res.result.editPermissions;
            state.steps = res.result.sequenceGraph;
            state.allDetailData = getDetailData(res.result.sequenceGraph);

            state.allDetailData = orderBy(
              state.allDetailData,
              ['createTime', 'handleTime' /* , 'nodeIndex' */],
              ['desc', 'desc' /* , 'desc' */],
            );

            //历史审批数据（被拒绝或终止的审批实例数据）
            const historyRecord =
              res.result?.hisRunningInfoList?.reduce((a, b) => {
                const record = getDetailData(b.sequenceGraph);
                return a.concat(record);
              }, []) || [];

            if (historyRecord?.length) {
              state.allDetailData.push(
                { divider: true },
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

    const handleCancel = () => {
      emit('cancel');
      emit('update:open', false);
    };

    const initUserSelectState = () => {
      return {
        open: false,
        seletedRows: [],
        title: '',
        operationKey: Operation.Deliver,
      };
    };

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

    const executeOperation = (operationKey: Operation, otherParams?: Record<string, any>) => {
      state.loading = true;
      operationParams.extra.taskData = state.taskData;
      operationParams.dynamicApprovalFormValues = getDynamicApprovalFormValues();
      operationApiMap[operationKey](Object.assign({}, operationParams, otherParams))
        .then(res => {
          if (res.success) {
            message.success(res.message);
            emit('handle');
            emit('update:open', false);
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
        if (!stepsRef.value.validate()) {
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
        //可编辑节点（处理节点），才调用明细页保存
        if (state.editPermissions.enable) {
          state.loading = true;
          const saveResult = await saveData();
          state.loading = false;
          if (!saveResult) {
            message.warning('单据明细页保存失败！');
            return;
          }
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
      [Operation.SendBack]: async () => {
        if (!operationParams.comment) {
          message.warning('请输入审批意见');
        } else {
          //可编辑节点（处理节点），才调用明细页保存
          if (state.editPermissions.enable) {
            state.loading = true;
            const saveResult = await saveData();
            state.loading = false;
            if (!saveResult) {
              message.warning('单据明细页保存失败！');
              return;
            }
          }
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

    const handleUpdateTaskData = (taskId: string, ids: string[]) => {
      state.taskData.find(f => Object.keys(f).includes(taskId))[taskId] = ids;
    };

    const handleSelectStep = (item: Partial<SequenceGraphItem>) => {
      state.selectedNodeId = item.nodeId;
      //排序
      state.nodeDetailData = orderBy(
        item.approvalRecords || [],
        ['createTime', 'handleTime'],
        ['desc', 'desc'],
      );
    };

    watch(
      () => props.open,
      (n, o) => {
        if (n === true && n != o) {
          getInstanceData();
        }
      },
      {
        immediate: true,
      },
    );

    const currentStep = computed(() => state.steps.find(f => f.isCurrentNode === true));

    const dynamicApprovalForm = ref(null);

    const validateDynamicApprovalForm = async () => {
      if (dynamicApprovalForm?.value) {
        const r = await dynamicApprovalForm?.value?.validate();
        return r;
      } else {
        return true;
      }
    };

    const getDynamicApprovalFormValues = () => {
      return dynamicApprovalForm?.value?.getValues();
    };

    return {
      Operation,
      bizViewComponentRef,
      setBizViewComponentRef,
      bizViewComponent,
      state,
      stepsRef,
      approvalRule,
      handleCancel,
      userSelectState,
      handleSelectUser,
      operationParams,
      handleClickOperation,
      handleUpdateTaskData,
      handleSelectStep,
      currentStep,
      dynamicApprovalForm,
    };
  },
  components: {
    ApprovalHeader,
    ApprovalSteps,
    DetailTable,
    UserSelectModal,
    DynamicApprovalForm,
    UploadFile,
    ASkeleton,
  },
});
</script>

<style lang="less" scoped>
.comment-label {
  display: block;
  margin-bottom: 5px;
  &.is-required::before {
    position: relative;
    margin-right: 5px;
    color: red;
    content: '*';
  }
}
.approval-tabs {
  height: 100%;
  :deep(.ant-tabs-tab) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px !important;
  }
  :deep(.ant-tabs-content) {
    height: 100%;
  }
  .tab-title {
    // padding: 0 16px;
    writing-mode: vertical-lr;
    letter-spacing: 6px;
    display: flex;
    > span {
      margin-bottom: 10px;
      margin-right: 0 !important;
    }
  }
}
</style>
