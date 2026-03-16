<template>
  <a-tooltip :title="state.processStatus === ProcessStatus.InProgress ? undefined : false">
    <template #title>
      <div class="info-wrapper">
        <div class="node-info">当前节点：{{ state.nodeName }}</div>
        <div class="user-info">
          <span class="user-info-title">
            当前审批-{{ ApprovalTypeMap[state.nodeAssigneeType].content }}
          </span>
          <div v-for="(item, index) in state.userList" :key="index">
            {{ item.userName }}
            <span>-</span>
            {{ approvalStatusMap[item.userStatus].content }}
          </div>
        </div>
      </div>
    </template>
    <a-badge
      :color="processStatusMap[state.processStatus].color"
      :text="processStatusMap[state.processStatus].content"
    />
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import type { PropType } from 'vue';
import {
  getProcessStatus,
  ProcessStatus,
  ApprovalStatus,
  ApprovalType,
} from '@/api/workflow/instance/index';
import type { ProcessStatusItem } from '@/api/workflow/instance/index';

export default defineComponent({
  name: 'ProcessStatus',
  props: {
    //单个使用时传id
    processInstanceId: {
      type: String,
      default: '',
    },
    //多个使用时（表格中每行都有一个状态时，由接口一次性查询多行的状态并返回，所以传递的是流程状态数据），传状态数据
    processStatusData: {
      type: Object as PropType<ProcessStatusItem>,
      default: null,
    },
  },
  setup(props) {
    const defaultStatus = () => {
      return {
        processStatus: 0,
        nodeAssigneeType: 1,
        nodeName: null,
        processInstanceId: null,
        userList: [],
      };
    };
    const state: ProcessStatusItem = reactive(defaultStatus());

    const getProcessStatusInfo = processInstanceId => {
      getProcessStatus(processInstanceId).then(({ success, result }) => {
        if (success && result?.length) {
          Object.assign(state, result[0]);
        } else {
          Object.assign(state, defaultStatus());
        }
      });
    };

    watch(
      () => props.processInstanceId,
      (n, o) => {
        if (n) {
          if (n !== o) {
            getProcessStatusInfo(n);
          }
        } else {
          Object.assign(state, defaultStatus());
        }
      },
      { immediate: true },
    );

    watch(
      () => props.processStatusData,
      n => {
        if (n) {
          Object.assign(state, n);
        } else {
          Object.assign(state, defaultStatus());
        }
      },
      { immediate: true, deep: true },
    );

    /**
     * 整个流程的状态 0：未开始（待提交），1：进行中，2：已结束，3：已终止（中途拒绝,状态是终止）
     */
    const processStatusMap = {
      [ProcessStatus.NotStarted]: { color: '#bfbfbf', content: '待提交' },
      [ProcessStatus.InProgress]: { color: 'blue', content: '进行中' },
      [ProcessStatus.Closed]: { color: 'green', content: '已结束' },
      [ProcessStatus.Terminated]: { color: 'red', content: '已终止' },
    };

    const approvalStatusMap = {
      [ApprovalStatus.PendingApproval]: { color: '#bfbfbf', content: '待审批' },
      [ApprovalStatus.Passed]: { color: 'green', content: '已通过' },
    };

    const ApprovalTypeMap = {
      [ApprovalType.Single]: { color: '', content: '单人审批' },
      [ApprovalType.Countersign]: { color: '', content: '多人会签' },
      [ApprovalType.OrSignature]: { color: '', content: '多人或签' },
    };

    return {
      state,
      ProcessStatus,
      processStatusMap,
      approvalStatusMap,
      ApprovalTypeMap,
    };
  },
});
</script>

<style lang="less" scoped>
.info-wrapper {
  .node-info {
    padding: 5px;
    border-bottom: 1px solid;
    // border: 1px solid;
    // border-radius: 4px;
  }
  .user-info {
    padding: 5px;
    box-sizing: border-box;
    .user-info-title {
      margin-bottom: 5px;
    }
  }
}
</style>
