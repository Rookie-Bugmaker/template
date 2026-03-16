import { computed, unref, shallowRef, watchEffect, ref, reactive, watch } from 'vue';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import type { ColumnType } from 'ant-design-vue/lib/table';
import type { ComputedRef, Ref } from 'vue';
import type { FixedType } from 'ant-design-vue/lib/vc-table/interface';

// import { useRoute } from 'vue-router';
import vRouter from '@/router';

import type { MenuRouteMetaPermission } from '@/router/typing';
import { isArray, isFunction } from 'lodash';

import { useI18n } from 'vue-i18n';

type Key = number | string;
export type TableOptions = {
  needRowIndex?: boolean | Ref<boolean>;
  rowIndexColumn?: ColumnType;
  checkedList?: Ref<Key[]>;
  fixedFirstColumn?: boolean;
  filterByPermission?: boolean; //是否按权限过滤列，默认开，不需要过滤传false
  blockCode?: string; //权限控制时候的块标识（如果一页页面里同时有多个表格需要列权限的控制的话，需要此属性）
};

export type DynamicColumnItem = {
  key: Key;
  label: string;
  checked: boolean;
};

export type DynamicColumnState = {
  checkAll: boolean;
  checkedList: Key[];
  needRowIndex: boolean;
  indeterminate: boolean;
};

export interface DynamicColumns {
  dynamicColumns: Ref<ColumnType[]>;
  dynamicColumnItems: ComputedRef<DynamicColumnItem[]>;
  state: DynamicColumnState;
  reset: () => void;
  handleColumnChange: (e: CheckboxChangeEvent, column: DynamicColumnItem) => void;
  handleColumnAllClick: (e: CheckboxChangeEvent) => void;
  move: (index: number, targetIndex: number) => void;
}

export const MY_CUSTOM_SHOW_INDEX_KEY = 'my-custom-show-index';

// columns 支持响应式，排序会影响原数组，所以，不同表格不能也不该使用同一份 columns，如果你需要共用，建议你使用函数返回，确保每一个 table 使用的都是独立的配置
export const useTableDynamicColumns = (
  columns: ColumnType[] | Ref<ColumnType[]>,
  defOptions: TableOptions = {},
): DynamicColumns => {
  const { t } = useI18n();
  const defaultRowIndexColumn = {
    title: () => t('global.table.rowIndex.title'),
    dataIndex: MY_CUSTOM_SHOW_INDEX_KEY,
    key: MY_CUSTOM_SHOW_INDEX_KEY,
    customRender: ({ index }: any) => `${index + 1}`,
    fixed: false as FixedType,
    width: 65,
    ...defOptions?.rowIndexColumn,
  };

  const getKey = (column: ColumnType) =>
    column?.key ??
    (Array.isArray(column.dataIndex)
      ? (column.dataIndex as []).join('$$')
      : (column.dataIndex as string));
  const mergedColumns = shallowRef<ColumnType[]>([]);

  const checkedList = ref([]);

  watch(
    () => columns,
    () => {
      const originColumns = unref(columns || [])
        .slice()
        .map(column => {
          return { ...column, key: getKey(column) };
        });

      mergedColumns.value =
        defOptions.filterByPermission === false
          ? originColumns
          : filterColumnsByPermission(originColumns, defOptions.blockCode);

      //columns重置时重置勾选列
      if (checkedList?.value) {
        checkedList.value = mergedColumns.value.map(column => column.key) ?? [];
      }
    },
    { immediate: true, deep: true },
  );

  const defaultCheckedList =
    defOptions.checkedList?.value ?? mergedColumns.value.map(column => column.key) ?? [];
  checkedList.value = defaultCheckedList;
  const state = reactive<DynamicColumnState>({
    checkAll: false,
    needRowIndex: false,
    checkedList: defaultCheckedList,
    indeterminate: true,
  });
  const listMap = computed(() => {
    return new Map(state.checkedList.map((c, index) => [c, index]));
  });
  const columnsMap = computed(() => {
    return new Map(mergedColumns.value.map((c, index) => [c.key, index]));
  });

  watchEffect(() => {
    state.needRowIndex = !!unref(defOptions.needRowIndex);
    state.checkedList = checkedList.value.filter(key => columnsMap.value.has(key));
  });

  watch(
    [() => state.checkedList, mergedColumns],
    () => {
      state.checkAll = state.checkedList.length === mergedColumns.value.length;
      state.indeterminate =
        !!state.checkedList.length && state.checkedList.length < mergedColumns.value.length;
    },
    { immediate: true },
  );

  const dynamicColumns = ref([]);
  watch(
    [mergedColumns, () => state.needRowIndex, () => state.checkedList],
    () => {
      let newColumns = mergedColumns.value.slice();
      newColumns = newColumns
        .filter(item => {
          return listMap.value.has(item.key);
        })
        .sort((a, b) => {
          const aKey = a.key as string;
          const bKey = b.key as string;
          return columnsMap.value.get(aKey) - columnsMap.value.get(bKey);
        })
        .map(item => item);
      if (state.needRowIndex) {
        if (defOptions?.fixedFirstColumn) {
          defaultRowIndexColumn.fixed = 'left';
        }
        newColumns.unshift(defaultRowIndexColumn);
      }
      dynamicColumns.value = newColumns;
    },
    { immediate: true },
  );

  const dynamicColumnItems = computed<DynamicColumnItem[]>(() =>
    mergedColumns.value.map(column => {
      return {
        key: column.key,
        label: isFunction(column.title) ? column.title({}) : column.title,
        checked: listMap.value.has(column.key),
      } as DynamicColumnItem;
    }),
  );
  const dynamicColumnValues = computed(() => dynamicColumnItems.value.map(column => column.key));

  const handleColumnChange = (e: CheckboxChangeEvent, column: DynamicColumnItem) => {
    const checked = (e.target as HTMLInputElement).checked;
    column.checked = checked;
    if (checked) {
      if (!listMap.value.has(column.key)) {
        checkedList.value = [...state.checkedList, column.key];
      }
    } else {
      checkedList.value = state.checkedList.filter(item => item !== column.key);
    }
  };

  const handleColumnAllClick = (e: CheckboxChangeEvent) => {
    const checked = (e.target as HTMLInputElement).checked;
    checkedList.value = checked ? dynamicColumnValues.value : [];
  };

  const reset = () => {
    checkedList.value = defaultCheckedList;
    mergedColumns.value = mergedColumns.value
      .sort((a, b) => defaultCheckedList.indexOf(a.key) - defaultCheckedList.indexOf(b.key))
      .slice();
  };

  const move = (index: number, targetIndex: number) => {
    const newColumns = mergedColumns.value.slice();
    const columnItem = newColumns[index];
    newColumns.splice(index, 1);
    if (targetIndex === 0) {
      newColumns.unshift(columnItem);
    } else {
      newColumns.splice(targetIndex, 0, columnItem);
    }
    mergedColumns.value = newColumns;
  };

  return {
    dynamicColumns,
    dynamicColumnItems,
    state,
    reset,
    handleColumnAllClick,
    handleColumnChange,
    move,
  };
};

//根据当前页面的路由权限设置，过滤表格字段
export const filterColumnsByPermission = (
  columns: ColumnType[],
  blockCode?: string,
): ColumnType[] => {
  const route = vRouter.currentRoute.value; //useRoute(); useRoute不在setup内可能会返回undefined

  //当前页面的权限设置
  const currentRoutePermission = route?.meta?.permission as MenuRouteMetaPermission[];
  if (currentRoutePermission?.length) {
    //列权限，如果有指定块按指定获取列权限设置,没有则默认取第一个块权限
    const hideColumns = blockCode
      ? currentRoutePermission.find(f => f.blockCode === blockCode)?.hideColumns
      : currentRoutePermission?.[0]?.hideColumns;
    if (hideColumns?.length) {
      return columns.filter(f => {
        return !hideColumns.some(s => {
          if (isArray(f.dataIndex) && isArray(s)) {
            //嵌套关系下的数据，列的dataIndex用数组标识,同时列权限的数据也被转换成了数组，需要在将数组做比对
            return f.dataIndex.join('.') === s.join('.');
          } else {
            //默认用dataIndex过滤，没有的则用key
            return s === (f.dataIndex || f.key);
          }
        });
      });
    }
  }
  return columns;
};
