<template>
  <yl-modal
    title="提交审批"
    :open="open"
    :width="950"
    :bodyStyle="{ padding: '5px 8px 8px', overflow: 'hidden' }"
    :confirmLoading="state.loading"
    :maskClosable="false"
    centered
    ok-text="提交"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="state.loading">
      <approval-header :instance-data="state.instanceData" />
      <approval-steps
        ref="stepsRef"
        :steps="state.steps"
        :task-data="state.taskData"
        @update-task-data="handleUpdateTaskData"
      />
      <template v-if="historyApprovalRecord?.length">
        <div style="margin: 8px 0 8px">历史记录:</div>
        <approval-detail show-all :show-toolbar="false" :allDetailData="historyApprovalRecord" />
      </template>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent, watch, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
// import type { PropType } from 'vue';
import {
  getSequenceGraph,
  startProcessInstance,
  getHistoryApprovalRecord,
} from '@/api/workflow/instance/index';
import type {
  InstanceData,
  SequenceGraphItem,
  ApprovalRecordItem,
} from '@/api/workflow/instance/index';
import { cloneDeep, orderBy } from 'lodash';

import ApprovalHeader from './approval-header.vue';
import ApprovalSteps from './approval-steps.vue';
import ApprovalDetail from '../process-approval/detail-table.vue';

interface AllApprovalRecordItem extends ApprovalRecordItem {
  nodeInfo: ApprovalRecordItem;
}

export default defineComponent({
  name: 'SubmitModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
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
  },
  emits: ['ok', 'cancel', 'update:open'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      steps: [],
      taskData: [],
      instanceData: {} as InstanceData,
    });

    const stepsRef = ref(null);

    const getSteps = () => {
      state.loading = true;
      state.steps = [];
      state.taskData = [];
      getSequenceGraph({
        bizId: props.bizId,
        bizCode: props.bizCode,
        templateAlias: props.templateAlias,
        formData: props.formData,
      })
        .then(res => {
          if (res.success) {
            state.instanceData = res.result;
            state.steps = res.result.sequenceGraph;
            state.taskData.push({ start_event: [] });
            state.steps.forEach(f => {
              state.taskData.push({ [f.nodeId]: [] });
            });
            state.taskData.push({ end_event: [] });
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

    const historyApprovalRecord = ref<AllApprovalRecordItem[]>([]);
    const getApprovalRecord = () => {
      getHistoryApprovalRecord(props.bizId, props.templateAlias).then(({ success, result }) => {
        if (success && result) {
          const historyRecord =
            result?.hisRunningInfoList?.reduce((a, b) => {
              const record = getDetailData(b.sequenceGraph);
              return a.concat(record);
            }, []) || [];

          const record = getDetailData(result.sequenceGraph).concat(historyRecord);

          historyApprovalRecord.value = orderBy(
            record,
            ['createTime', 'handleTime'],
            ['desc', 'desc'],
          );
        }
      });
    };

    watch(
      () => props.open,
      (n, o) => {
        if (n === true && n != o) {
          getSteps();
          getApprovalRecord();
        }
      },
      { immediate: true },
    );

    const handleUpdateTaskData = (taskId: string, ids: string[]) => {
      state.taskData.find(f => Object.keys(f).includes(taskId))[taskId] = ids;
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      if (stepsRef.value.validate()) {
        state.loading = true;
        startProcessInstance({
          bizId: props.bizId,
          bizCode: props.bizCode,
          templateId: state.instanceData.templateId,
          formData: props.formData,
          taskData: state.taskData,
          currentTaskId: state.steps[0].nodeId,
          lowCodeFlag: props.lowCodeFlag,
          objectId: props.objectId,
        })
          .then(res => {
            if (res.success) {
              message.success('提交成功');
              emit('ok');
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
      } else {
        message.warning('请选择人员');
      }
    };

    const handleCancel = () => {
      emit('cancel');
      emit('update:open', false);
    };

    return {
      state,
      stepsRef,
      handleUpdateTaskData,
      handleSubmit,
      handleCancel,
      historyApprovalRecord,
    };
  },
  components: { ApprovalHeader, ApprovalSteps, ApprovalDetail },
});
</script>
