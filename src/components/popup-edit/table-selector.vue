<template>
  <a-table
    :row-key="options?.rowKeyFn || options.valueField"
    :size="tableState.tableSize"
    :loading="tableState.loading"
    :columns="options.tableColumns"
    :data-source="tableState.dataSource"
    :pagination="tableState.pagination"
    :showExpandColumn="false"
    :scroll="{ y: options?.scrollY ?? 390 }"
    @change="handleTableChange"
    :custom-row="customTableRow"
    :rowSelection="{
      selectedRowKeys: state.tempSelectedKeys,
      type: state.multiple ? 'checkbox' : 'radio',
      onSelect: handleTableSelect,
      onSelectAll: handleTableSelectAll,
    }"
  >
    <template v-for="name in Object.keys($slots)" #[name.slice(6)]="slotProps">
      <slot :name="name" v-bind="slotProps"></slot>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { injectPopupEditState } from './usePopupEdit';

export default defineComponent({
  name: 'PopupModalTableSelector',
  setup() {
    const { state, confirmSelect, options, tableState, handleTableChange } = injectPopupEditState();

    //处理table全选事件
    const handleTableSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
      const key = options.valueField;
      const changeRowKeyValues = changeRows.map(m => m[key]);
      state.tempSelectedKeys = selected
        ? [...state.tempSelectedKeys, ...changeRowKeyValues]
        : state.tempSelectedKeys.filter(k => !changeRowKeyValues.includes(k));
      state.tempSelectedRows = selected
        ? [...state.tempSelectedRows, ...changeRows]
        : state.tempSelectedRows.filter(f => !changeRowKeyValues.includes(f[key]));
    };

    //处理table选择事件
    const handleTableSelect = (record: any, selected: boolean /* , selectedRows: any[] */) => {
      const key = options.valueField;
      const keyValue = record[key];

      if (state.multiple === false) {
        //单选时直接触发确认选择
        state.tempSelectedKeys = [keyValue];
        state.tempSelectedRows = [record];
        confirmSelect();
      } else {
        //多选时确认选择通过按钮触发
        state.tempSelectedKeys = selected
          ? [...state.tempSelectedKeys, keyValue]
          : state.tempSelectedKeys.filter(k => k != keyValue);
        //不能使用selectedRows直接赋值给tempSelectedRows，翻页后会获取不到之前页面已选择的selectedRows，会undefined
        // state.tempSelectedRows = selectedRows;
        state.tempSelectedRows = selected
          ? [...state.tempSelectedRows, record]
          : state.tempSelectedRows.filter(f => f[key] != keyValue);
      }
    };

    //客制化选中行事件
    const customTableRow = (record: any) => {
      return {
        onClick: () => {
          //构建数据
          const key = options.valueField;
          const keyValue = record[key];
          const selected = !state.tempSelectedKeys.find(k => k == keyValue);
          //handleTableSelect方法已有以下逻辑
          /* const selectedRows = selected
            ? [...state.tempSelectedRows, record]
            : state.tempSelectedRows.filter(f => f[key] != keyValue); */
          //统一由此方法触发选中
          handleTableSelect(record, selected /* , selectedRows */);
        },
      };
    };

    return {
      state,
      options,
      tableState,
      handleTableChange,
      handleTableSelect,
      handleTableSelectAll,
      customTableRow,
    };
  },
  components: {},
});
</script>
