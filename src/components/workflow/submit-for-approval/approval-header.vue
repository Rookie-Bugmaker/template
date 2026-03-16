<template>
  <div class="approval-header">
    <a-tag
      v-if="processStatusMap[instanceData.processStatus]"
      :color="processStatusMap[instanceData.processStatus].color"
    >
      {{ processStatusMap[instanceData.processStatus].content }}
    </a-tag>
    <span>您正在提交流程</span>
    <span class="highlight">{{ instanceData.processName }}</span>
    <span></span>
    <span>（</span>
    <span v-if="instanceData.bizCode" class="highlight">{{ instanceData.bizCode }}</span>
    <span>）</span>
    <a-tag color="#3b5999">#{{ instanceData.templateVersion }}</a-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { InstanceData } from '@/api/workflow/instance/index';
import { ProcessStatus } from '@/api/workflow/instance/index';

/**
 * 整个流程的状态 0：未开始（待提交），1：进行中，2：已结束，3：已终止（中途拒绝,状态是终止）
 */
const processStatusMap = {
  [ProcessStatus.NotStarted]: { color: '', content: '待提交' },
  [ProcessStatus.InProgress]: { color: 'blue', content: '进行中' },
  [ProcessStatus.Closed]: { color: 'green', content: '已结束' },
  [ProcessStatus.Terminated]: { color: 'red', content: '已终止' },
};

export default defineComponent({
  name: 'ApprovalHeader',
  props: {
    instanceData: {
      type: Object as PropType<InstanceData>,
      default: () => ({}),
    },
  },
  setup() {
    return { ProcessStatus, processStatusMap };
  },
});
</script>

<style lang="less" scoped>
.approval-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 5px;
  font-size: 18px;
  .highlight {
    color: #1890ff;
  }
}
</style>
