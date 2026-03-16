<template>
  <div class="table-toolbar" v-if="showToolbar">
    <span style="margin-right: 12px">查看审批记录</span>
    <a-radio-group
      :value="showAll"
      @change="e => $emit('update:showAll', e.target.value)"
      button-style="solid"
      size="small"
    >
      <a-radio-button :value="true">全部</a-radio-button>
      <a-radio-button :value="false">按节点</a-radio-button>
    </a-radio-group>
  </div>
  <a-table
    row-key="id"
    size="small"
    class="detail-table"
    :columns="tableColumns"
    :data-source="showAll ? allDetailData : nodeDetailData"
    :scroll="{ x: true, y: 200 }"
    table-layout="auto"
    :pagination="false"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="record.divider">
        <template v-if="column.dataIndex.toString() === ['nodeInfo', 'nodeName'].toString()">
          <span style="opacity: 0.85">-以下为历史记录-</span>
        </template>
        <template v-else>
          <span></span>
        </template>
      </template>
      <template v-else>
        <template v-if="column.dataIndex === 'approvalStatus'">
          <a-tag v-if="approvalStatusMap[text]" :color="approvalStatusMap[text]?.color">
            {{ approvalStatusMap[text].content }}
          </a-tag>
        </template>
        <template v-else-if="column.dataIndex.toString() === ['nodeInfo', 'nodeName'].toString()">
          <a-badge
            v-if="NodeAttr[record.nodeInfo.nodeType]"
            :color="NodeAttr[record.nodeInfo.nodeType].color"
            :text="text"
          />
        </template>
        <template v-else-if="column.dataIndex === 'comment'">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>{{ text }}</span>
            </template>
            <div
              style="
                width: 210px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
              "
            >
              {{ text }}
            </div>
          </a-tooltip>
        </template>
        <template v-else-if="column.dataIndex === 'attachmentId'">
          <upload-file
            v-if="text"
            multiple
            :value="text"
            type="dialog"
            disabled
            size="small"
            style="padding: 0"
          ></upload-file>
        </template>
        <template v-else-if="column.dataIndex === 'dynamicApprovalFormValues'">
          <a-popover title="附加信息" trigger="hover">
            <template #content>
              <dynamic-approval-form
                v-if="record?.nodeInfo?.dynamicApprovalForm"
                :config="record?.nodeInfo?.dynamicApprovalForm"
                disabled
                :form-data="JSON.parse(text)"
              />
            </template>
            <a-button v-if="text" type="link">查看</a-button>
          </a-popover>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          <span v-if="text">{{ text.substring(0, text.indexOf('.')) }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'handleTime'">
          <span v-if="text">{{ text.substring(0, text.indexOf('.')) }}</span>
        </template>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import type { TableColumn } from '@/typing';
import type { ApprovalRecordItem } from '@/api/workflow/instance/index';
import { ApprovalStatus } from '@/api/workflow/instance/index';
import { NodeAttr } from '@/api/workflow/template/typing';

import DynamicApprovalForm from '@/components/workflow/dynamic-approval-form/index.vue';
import UploadFile from '@/components/upload-file/index.vue';

const approvalStatusMap = {
  [ApprovalStatus.PendingApproval]: { color: '', content: '待审批' },
  [ApprovalStatus.Passed]: { color: 'green', content: '已通过' },
  [ApprovalStatus.Rejected]: { color: 'volcano', content: '已拒绝' },
  [ApprovalStatus.Dismissed]: { color: 'purple', content: '已驳回' },
  [ApprovalStatus.Forwarded]: { color: 'cyan', content: '已转交' },
  [ApprovalStatus.Unhandled]: { color: 'orange', content: '未处理' },
  [ApprovalStatus.PlusSigned]: { color: 'pink', content: '已加签' },
  [ApprovalStatus.Cc]: { color: 'blue', content: '已抄送' },
  [ApprovalStatus.Termination]: { color: 'red', content: '已终止' },
  [ApprovalStatus.SendBack]: { color: '#f50', content: '已退回' },
};

const baseColumns: TableColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 80,
  },
  /* {
    title: '加签用户',
    dataIndex: 'isPlusSignUser',
  },
  {
    title: '被转交用户',
    dataIndex: 'isDeliveredUser',
  }, */
  {
    title: '状态',
    dataIndex: 'approvalStatus',
    width: 60,
  },
  {
    title: '审批意见',
    dataIndex: 'comment',
    ellipsis: true,
  },
  {
    title: '附件',
    dataIndex: 'attachmentId',
    width: 80,
  },
  {
    title: '附加信息',
    dataIndex: 'dynamicApprovalFormValues',
    width: 110,
  },
  {
    title: '开始时间',
    dataIndex: 'createTime',
    width: 165,
  },
  {
    title: '处理时间',
    dataIndex: 'handleTime',
    width: 165,
  },
];

const extraColumns: TableColumn[] = [
  {
    title: '节点名称',
    dataIndex: ['nodeInfo', 'nodeName'],
    width: 160,
  },
];

interface AllApprovalRecordItem extends ApprovalRecordItem {
  nodeInfo: ApprovalRecordItem;
}

export default defineComponent({
  name: 'DetailTable',
  props: {
    showAll: {
      type: Boolean,
      default: true,
    },
    allDetailData: {
      type: Array as PropType<AllApprovalRecordItem[]>,
      default: () => [],
    },
    nodeDetailData: {
      type: Array as PropType<ApprovalRecordItem[]>,
      default: () => [],
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:showAll'],
  setup(props) {
    const tableColumns = computed<TableColumn[]>(() => {
      return props.showAll ? extraColumns.concat(baseColumns) : baseColumns;
    });
    return { NodeAttr, approvalStatusMap, tableColumns };
  },
  components: {
    DynamicApprovalForm,
    UploadFile,
  },
});
</script>

<style lang="less" scoped>
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 35px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.detail-table {
  // height: 191px;
  margin-bottom: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}
</style>
