import { reactive, toRaw, toRefs, computed } from 'vue';
import { isBoolean } from 'lodash';
import { message } from 'ant-design-vue';

export type SelectKey = string | number;
export type Selectable = boolean | ((row: any, selectedRow: any[]) => boolean);

export interface TableRowSelectionState {
  selectedRows: any[];
  selectedRowKeys: SelectKey[];
}

export interface TableRowSelectionOptions {
  rowKey?: string;
  multiple?: boolean;
  selectedRows?: any[];
  selectedRowKeys?: SelectKey[];
  selectable?: Selectable;
  /* 是否行点击选中 */
  isRowTriggerSelect?: boolean;
  /**是否可以取消选中 */
  isCanDeselect?: boolean;
  /**设置不能选中的原因 */
  cantSelectableReson?: string;
  onRowSelectionChange?: any;
  cantSelectableClick?: (row: any) => void;
  /* 初始值 */
  defaultSelectedRows?: any[];
  defaultSelectedRowKeys?: SelectKey[];
  [key: string]: any;
}

export function useTableRowSelection<T = any>(defaultOptions: TableRowSelectionOptions) {
  const initOptions = (): TableRowSelectionOptions => ({
    rowKey: 'key',
    multiple: true,
    selectable: true,
    isRowTriggerSelect: true,
    isCanDeselect: true,
    cantSelectableReson: '',
    fixed: true,
    onRowSelectionChange: () => void 0,
  });

  const initState = (): TableRowSelectionState => ({
    selectedRows: defaultOptions.defaultSelectedRows || [],
    selectedRowKeys: defaultOptions.defaultSelectedRowKeys || [],
  });

  /* 配置项 */
  const options: TableRowSelectionOptions = reactive(Object.assign(initOptions(), defaultOptions));
  /* 选择数据 */
  const state: TableRowSelectionState = reactive(initState());

  /* 判断选择行是否可选择 */
  const isSelectable = (record: T, selectedRows: T[]) => {
    const ret = isBoolean(options.selectable)
      ? !options.selectable
      : !options.selectable(record, selectedRows);
    return ret;
  };

  /* 处理table选择事件 */
  const handleTableSelect = (record: T, selected: boolean) => {
    // 判断能否选中
    if (isSelectable(record, state.selectedRows)) {
      options.cantSelectableClick?.(record);
      return;
    }
    //存在不能选择的原因时 不可选中
    if (options.cantSelectableReson.trim()) {
      return message.warning(options.cantSelectableReson);
    }

    const keyValue = record[options.rowKey];
    if (options.multiple) {
      //多选时确认选择通过按钮触发
      if (selected) {
        state.selectedRowKeys.push(keyValue);
        state.selectedRows.push(toRaw(record));
      } else {
        state.selectedRowKeys = state.selectedRowKeys.filter(k => k != keyValue);
        state.selectedRows = state.selectedRows.filter(f => f[options.rowKey] != keyValue);
      }
    } else {
      state.selectedRows = selected ? [toRaw(record)] : [];
      state.selectedRowKeys = selected ? [keyValue] : [];
    }

    options.onRowSelectionChange(state.selectedRows);
  };

  // 全选
  const handleTableSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
    changeRows.forEach(v => {
      handleTableSelect(v, selected);
    });
    // const changeRowKeyValues = changeRows
    //   .filter(r => !isSelectable(r, state.selectedRows))
    //   .map(m => m[options.rowKey]);
    // if (selected) {
    //   state.selectedRowKeys.push(...changeRowKeyValues);
    //   state.selectedRows.push(...changeRows);
    // } else {
    //   state.selectedRowKeys = state.selectedRowKeys.filter(k => !changeRowKeyValues.includes(k));
    //   state.selectedRows = state.selectedRows.filter(
    //     f => !changeRowKeyValues.includes(f[options.rowKey]),
    //   );
    // }
  };

  // 触发选择/反选行
  const triggerSelect = (record: T) => {
    if (options.isRowTriggerSelect) {
      //构建数据
      const keyValue = record[options.rowKey];
      const selected = !state.selectedRowKeys.find(k => k == keyValue);
      //如果不能取消你选中并且目前已经选中 不再继续执行
      if (!options.isCanDeselect && !selected) return;
      handleTableSelect(record, selected);
    }
  };

  /* 自定义行点击事件 */
  const customRow = (record: T) => {
    return {
      onClick: e => {
        e.stopPropagation();
        triggerSelect(record);
      },
    };
  };

  // 重载state
  const reloadState = record => {
    Object.assign(state, record);
  };

  //清空已选择
  const clearSelected = () => {
    state.selectedRowKeys = [];
    state.selectedRows = [];
  };

  const changeSelectable = (cantSelectableReson?: string) => {
    if (cantSelectableReson.trim()) return void (options.cantSelectableReson = cantSelectableReson);
    options.cantSelectableReson = '';
  };

  return {
    ...toRefs(state),
    rowSelection: {
      ...toRefs(state),
      type: computed(() => (options.multiple ? 'checkbox' : 'radio')),
      onSelect: handleTableSelect,
      onSelectAll: handleTableSelectAll,
      getCheckboxProps: (record: T) => ({ disabled: isSelectable(record, state.selectedRows) }),
      onChange: (_, selectedRows) => {
        options.onRowSelectionChange(selectedRows);
      },
      ...toRefs(options),
    },
    customRow,
    triggerSelect,
    clearSelected,
    changeSelectable,
    reloadState,
  };
}
