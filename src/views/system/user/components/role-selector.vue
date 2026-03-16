<template>
  <yl-modal
    :title="$t('view.system.user.modal.roleSelector.roleSelect.title')"
    :open="open"
    :width="800"
    :bodyStyle="{ padding: '18px 24px 12px' }"
    :confirmLoading="loading"
    centered
    @ok="handleSubmit"
    @cancel="
      () => {
        // resetFields();
        $emit('cancel');
      }
    "
  >
    <a-form :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
      <a-row>
        <a-col :span="8">
          <a-form-item label="角色名称">
            <a-input
              v-model:value="queryParams.roleName"
              placeholder="请输入角色名称"
              allowClear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="角色编码">
            <a-input
              v-model:value="queryParams.roleCode"
              placeholder="请输入角色编码"
              allowClear
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col flex="auto">
          <a-form-item style="float: right">
            <a-space>
              <yl-button act-type="search" html-type="submit" @click="reload"></yl-button>
              <yl-button
                act-type="reset"
                @click="Object.assign(queryParams, { roleName: '', roleCode: '' })"
              ></yl-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      row-key="roleId"
      :size="tableState.tableSize"
      :loading="tableState.loading"
      :columns="tableColumns"
      :data-source="tableState.dataSource"
      :pagination="tableState.pagination"
      @change="handleTableChange"
      :rowSelection="{
        selectedRowKeys: tableSelectionState.selectedRowKeys,
        hideSelectAll: true,
        onSelect: handleTableSelect,
        getCheckboxProps: (record: any) => ({
          disabled: record.enableFlag === 'N',
        }),
      }"
      :customRow="customRow"
      :scroll="{ y: 'calc(100vh - 320px)' }"
    ></a-table>
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Pagination, TableColumn } from '@/typing';
import { findRoleByPage } from '@/api/system/role/index';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { cloneDeep } from 'lodash';

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13 },
  },
};
export default defineComponent({
  name: 'SelectorModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const tableColumns: TableColumn[] = [
      {
        title: () => t('view.system.user.modal.roleSelector.roleCode.tableTitle'),
        dataIndex: 'roleCode',
      },
      {
        title: () => t('view.system.user.modal.roleSelector.roleName.tableTitle'),
        dataIndex: 'roleName',
      },
      {
        title: () => t('view.system.user.modal.roleSelector.roleDesc.tableTitle'),
        dataIndex: 'roleDescription',
      },
    ];

    const loading = ref(false);
    const initValues = () => ({
      roleName: '',
      roleCode: '',
    });
    const queryParams = reactive(initValues());

    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });
    const { reload, context: tableState } = useFetchData(findRoleByPage, fetchDataContext);
    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      tableState.page = page;
      tableState.pageSize = pageSize;
    };

    const handleSearch = (e: Event) => {
      e.preventDefault();
      reload();
    };

    watch(
      () => props.open,
      (n, o) => {
        if (n == true && n != o) {
          reload();
        }
      },
    );

    watch(
      () => props.selectedIds,
      n => {
        tableSelectionState.selectedRowKeys = n;
      },
    );

    watch(
      () => props.selectedRows,
      n => {
        tableSelectionState.selectedRows = n;
      },
    );

    const tableSelectionState = reactive({
      selectedRowKeys: [],
      selectedRows: [] as any[],
    });

    /*  const handleTableSelectedChange = (selectedRowKeys: any) => {
      tableSelectionState.selectedRowKeys = selectedRowKeys;
    }; */

    const handleTableSelect = (record: any, selected: any) => {
      const cloneRecord = cloneDeep(record);
      const index = tableSelectionState.selectedRows.findIndex(i => i.roleId == cloneRecord.roleId);
      if (index != -1 && !selected) {
        tableSelectionState.selectedRowKeys.splice(index, 1);
        tableSelectionState.selectedRows.splice(index, 1);
      }
      if (index == -1 && selected) {
        tableSelectionState.selectedRowKeys.push(cloneRecord.roleId);
        tableSelectionState.selectedRows.push(cloneRecord);
      }
    };

    // 触发选择/反选行
    const triggerSelect = (record: any) => {
      //构建数据
      const keyValue = record.roleId;
      const selected = !tableSelectionState.selectedRowKeys.find(k => k == keyValue);
      handleTableSelect(record, selected);
    };

    /* 自定义行点击事件 */
    const customRow = (record: any) => {
      return {
        onClick: e => {
          e.stopPropagation();
          triggerSelect(record);
        },
      };
    };

    const handleSubmit = () => {
      emit('ok', tableSelectionState.selectedRowKeys, tableSelectionState.selectedRows);
    };

    return {
      emit,
      tableColumns,
      ...formLayout,
      initValues,
      queryParams,
      loading,
      handleSearch,
      reload,
      tableState,
      handleTableChange,
      tableSelectionState,
      // handleTableSelectedChange,
      handleTableSelect,
      handleSubmit,
      customRow,
    };
  },
});
</script>
