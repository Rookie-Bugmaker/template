<template>
  <popup-edit
    v-if="props.dataSourceType === 'table'"
    v-bind="$attrs"
    :options="tableOptions"
    :placeholder="props.placeholder"
    @bring="(value, record) => emit('bring', value, record)"
  />
  <popup-edit
    v-else
    v-bind="$attrs"
    :options="viewOptions"
    :placeholder="props.placeholder"
    @bring="(value, record) => emit('bring', value, record)"
  />
</template>

<script setup lang="ts">
import PopupEdit from '@/components/popup-edit/index.vue';
import type { Options } from '@/components/popup-edit/typing';
import {
  findPageByApplicationIdOrGroupId as findTableByPage,
  getTableById,
} from '@/api/low-code/data-set/table';
import {
  findPageByApplicationIdOrGroupId as findViewByPage,
  getViewById,
} from '@/api/low-code/data-set/sql';

type Props = {
  queryParams: object;
  placeholder: string;
  dataSourceType: 'table' | 'view';
};

const props = withDefaults(defineProps<Props>(), {
  queryParams: null,
  placeholder: '请选择数据源',
  dataSourceType: 'table',
});

const emit = defineEmits(['bring']);

/* 表结构 */
const tableOptions: Options = {
  getDataById: getTableById,
  getDataByPage: async (params: any) => findTableByPage(Object.assign(params, props.queryParams)),
  modalWidth: 800,
  modalTitle: '表结构',
  valueField: 'tableId',
  textField: 'tableName',
  searchFormFields: [
    {
      field: 'tableName',
      label: '表名',
    },
    {
      field: 'tableFullName',
      label: '表名称',
    },
  ],
  tableColumns: [
    {
      title: '表名',
      dataIndex: 'tableName',
      ellipsis: true,
    },
    {
      title: '表名称',
      dataIndex: 'tableFullName',
      ellipsis: true,
    },
    {
      title: '表说明',
      dataIndex: 'tableDesc',
      ellipsis: true,
    },
  ],
};

/* 视图 */
const viewOptions: Options = {
  getDataById: getViewById,
  getDataByPage: async (params: any) => findViewByPage(Object.assign(params, props.queryParams)),
  modalWidth: 800,
  modalTitle: '视图',
  valueField: 'viewId',
  textField: 'viewName',
  searchFormFields: [
    {
      field: 'viewName',
      label: '视图名',
    },
    {
      field: 'name',
      label: '视图名称',
    },
  ],
  tableColumns: [
    {
      title: '视图名',
      dataIndex: 'viewName',
      ellipsis: true,
    },
    {
      title: '视图名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'viewDesc',
      ellipsis: true,
    },
  ],
};
</script>

<style lang="less" scoped></style>
