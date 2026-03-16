<template>
  <yl-modal title="组件选择" :width="600" :open="open" @ok="handleOk" @cancel="handleCancel">
    <a-table
      row-key="componentId"
      :row-selection="rowSelection"
      :custom-row="customRow"
      :columns="baseColumns"
      size="small"
      :data-source="state.pageComponents"
      :scorll="{ y: 300 }"
    ></a-table>
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import type { TableProps } from 'ant-design-vue';
import type { TableColumn } from '@/typing';
import { injectDashboardState } from './hooks/useDashboardState';
import { type PageComponentItem } from '@/api/system/home/index';

export default defineComponent({
  name: 'PageComponentsModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:open', 'ok', 'cancel'],
  setup(props, { emit }) {
    const baseColumns: TableColumn[] = [
      {
        title: '主页标题',
        dataIndex: 'homePageTitle',
      },
      {
        title: '功能名称',
        dataIndex: 'functionName',
      },
      {
        title: '功能编码',
        dataIndex: 'functionCode',
      },
      {
        title: '业务领域',
        dataIndex: 'businessAreaName',
        width: 100,
      },
      /*{
        title: '刷新频率（S）',
        dataIndex: 'refreshRate',
        width: 115,
      },{
        title: '加载限制',
        dataIndex: 'loadingType',
        width: 80,
      },
       {
        title: '默认显示',
        dataIndex: 'showStatus',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      }, */
    ];

    const state = injectDashboardState();

    const rowSelection: TableProps['rowSelection'] = reactive({
      selectedRowKeys: [] as string[],
      onChange: (selectedRowKeys: string[] /* , selectedRows: PageComponentItem[] */) => {
        rowSelection.selectedRowKeys = selectedRowKeys;
      },
    });

    const customRow = ({ componentId }: PageComponentItem) => {
      return {
        onClick: () => {
          const index = rowSelection.selectedRowKeys.indexOf(componentId);
          if (index < 0) {
            rowSelection.selectedRowKeys.push(componentId);
          } else {
            rowSelection.selectedRowKeys.splice(index, 1);
          }
        },
      };
    };

    watch(
      () => props.open,
      (n, o) => {
        if (n && n !== o) {
          rowSelection.selectedRowKeys = state.layout.map(m => m.i);
        }
      },
    );

    const handleOk = () => {
      emit('ok', rowSelection.selectedRowKeys);
      emit('update:open', false);
    };

    const handleCancel = () => {
      emit('cancel');
      emit('update:open', false);
    };

    return { baseColumns, state, rowSelection, customRow, handleOk, handleCancel };
  },
});
</script>

<style lang="less" scoped></style>
