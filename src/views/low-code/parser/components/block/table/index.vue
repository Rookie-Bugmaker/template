<template>
  <edit-inline-table
    v-if="config.editable.mode === 'inline'"
    ref="tableRef"
    :style="{ 'margin-bottom': '6px' }"
    :row-key="customRowKey ? customRowKey : tableRowKey"
    :config="config"
    :block-map="blockMap"
    :relation="hasRelation ? relation : null"
    :data-source="state.dataSource"
    :columns="config.columns"
    :scroll="{ x: '100%', y: config.options.scrollY }"
    :row-class-name="stripe"
    :size="state.tableSize"
    :loading="state.loading"
    :bordered="config.options.bordered"
    :pagination="config.options.pagination.enabled ? state.pagination : false"
    @change="handleTableChange"
    @reload="reload"
    :rowSelection="rowSelection"
    @columns-change="handleColumnsChange"
    :needRowIndex="config?.options?.needRowIndex"
    :params="params"
  >
    <template #extraLeft>
      <a-space v-if="config.action.top.position == 'left'">
        <template v-for="item in topActions" :key="item.uid">
          <yl-button
            v-if="item.mainType === MainType.TableCreate"
            act-type="add"
            :disabled="item.options?.disabled || itemDisabledCondition(item, null)"
            @click="item.options?.onClick?.()"
          ></yl-button>
          <widget v-else :config="item" />
        </template>
        <import-and-export
          v-if="config?.importAndExport?.enabled"
          :config="config"
          :get-export-params="getExportParams"
          @success="reload"
        />
      </a-space>
    </template>
    <template #extraRight>
      <a-space v-if="config.action.top.position == 'right'">
        <template v-for="item in topActions" :key="item.uid">
          <yl-button
            v-if="item.mainType === MainType.TableCreate"
            act-type="add"
            :disabled="item.options?.disabled"
            @click="item.options?.onClick?.()"
          ></yl-button>
          <widget v-else :config="item" />
        </template>
        <import-and-export
          v-if="config?.importAndExport?.enabled"
          :config="config"
          :get-export-params="getExportParams"
          @success="reload"
        />
      </a-space>
    </template>
  </edit-inline-table>
  <edit-popup-table
    v-if="config.editable.mode === 'popup'"
    ref="tableRef"
    :style="{ 'margin-bottom': '6px' }"
    :row-key="customRowKey ? customRowKey : tableRowKey"
    :config="config"
    :block-map="blockMap"
    :relation="hasRelation ? relation : null"
    :data-source="state.dataSource"
    :columns="config.columns"
    :scroll="{ x: '100%', y: config.options.scrollY }"
    :row-class-name="stripe"
    :size="state.tableSize"
    :loading="state.loading"
    :bordered="config.options.bordered"
    :pagination="config.options.pagination.enabled ? state.pagination : false"
    @change="handleTableChange"
    @reload="reload"
    :rowSelection="rowSelection"
    @columns-change="handleColumnsChange"
    :needRowIndex="config?.options?.needRowIndex"
    :params="params"
  >
    <template #extraLeft>
      <a-space v-if="config.action.top.position == 'left'">
        <template v-for="item in topActions" :key="item.uid">
          <yl-button
            v-if="item.mainType === MainType.TableCreate"
            act-type="add"
            :disabled="item.options?.disabled || itemDisabledCondition(item, null)"
            @click="item.options?.onClick?.()"
          ></yl-button>
          <widget v-else :config="item" />
        </template>
        <import-and-export
          v-if="config?.importAndExport?.enabled"
          :config="config"
          :get-export-params="getExportParams"
          @success="reload"
        />
      </a-space>
    </template>
    <template #extraRight>
      <a-space v-if="config.action.top.position == 'right'">
        <template v-for="item in topActions" :key="item.uid">
          <yl-button
            v-if="item.mainType === MainType.TableCreate"
            act-type="add"
            :disabled="item.options?.disabled"
            @click="item.options?.onClick?.()"
          ></yl-button>
          <widget v-else :config="item" />
        </template>
        <import-and-export
          v-if="config?.importAndExport?.enabled"
          :config="config"
          :get-export-params="getExportParams"
          @success="reload"
        />
      </a-space>
    </template>
  </edit-popup-table>
</template>

<script lang="ts">
import { defineComponent, inject, computed, reactive, ref, watch } from 'vue';
import type { PropType } from 'vue';
import Widget from '../../widget/index.vue';
import { TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY } from '@/views/low-code/design/keys';
import { generateKey } from '@/views/low-code/design/utils/key';
import { MainType, WidgetType, BlockType } from '@/views/low-code/design/typing/index';
import { cloneDeep, camelCase } from 'lodash';

import { parserStateInjectKey } from '@/views/low-code/parser/keys';

/* import { Container as DragContainer, Draggable } from '@/components/draggable';
import DragIcon from '@/components/table/drag-icon.vue'; */
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';

import { useFetchData, wrap } from '@/utils/hooks/useFetchData';
import type { Pagination } from '@/typing';
import { queryByPage, queryByList } from '@/api/low-code/parser';

import EditInlineTable from './edit-inline-table.vue';
import EditPopupTable from './edit-popup-table.vue';
import ImportAndExport from './import-and-export.vue';
import { message } from 'ant-design-vue';

import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';
import { getFilter } from '@/views/low-code/parser/utils/filter';

export default defineComponent({
  name: 'DTable',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
    params: {
      type: Object,
      default: () => {
        return {
          primarykey: '',
          parentParams: {},
        };
      },
    },
    //不受relation限制查询数据
    withoutRelation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const tableRef = ref(null);

    const eh = useEventHandler();

    const handleResizeColumn = (w, col) => {
      col.width = w;
    };

    const parserState = inject(parserStateInjectKey);

    //表格的rowKey,用于选择功能
    const tableRowKey = computed(() => props.config.dataSource?.dataObjectPrimaryKey);

    const customRowKey = props.config.options?.customRowKey
      ? record => {
          return eval(`(record)=>{
    ${props.config.options.customRowKey}}`)(record);
        }
      : null;

    const selectedState = reactive({
      selectedRowKeys: [],
      selectedRows: [],
      onChange: (selectedRowKeys, selectedRows) => {
        selectedState.selectedRowKeys = selectedRowKeys;
        selectedState.selectedRows = selectedRows;
      },
      ...props.config.options?.rowSelection,
    });

    const rowSelection = props.config.options?.rowSelection?.enabled ? selectedState : null;

    const tableDataSourceObjectId = computed(() => props.config?.dataSource?.objectId);

    /**
     * 获取父级块的数据源唯一标识，父级块的主键Key,当前子块对应父级块主键的字段key
     * 返回null说明没有关联关系
     * 返回对象说明有关系，需要校验对象里面的值是否存在
     */
    const getRelationInfo = () => {
      let result = { parentDataKey: '', parentKey: '', childKey: '' };
      //如果当前表格的编辑数据源作为子表出现在关系中，需要在新增构建数据时获取主表的主键
      const target = parserState.relations.find(
        f => f.subId === props.config.dataSource.dataObjectId,
      );
      if (target) {
        result = {
          parentDataKey: `data_${target.mainId}`,
          parentKey: target.columnRelations?.[0]?.mainColumnCode,
          childKey: target.columnRelations?.[0]?.subColumnCode,
        };
      }
      return result;
    };

    //{ parentDataKey, parentKey, childKey }
    const relation = getRelationInfo();

    const hasRelation = ref(!!relation.parentDataKey);

    const parentKeyValue = computed(() =>
      hasRelation.value ? parserState.data[relation.parentDataKey]?.[relation.parentKey] : null,
    );

    const tableConfig = computed(() => {
      const c = props.config;
      if (c) {
        const columnAction = c.action?.column;

        const actionIndex = c.columns.findIndex(s => s.dataIndex === TABLE_COLUMN_ACTION_KEY);
        if (columnAction.show) {
          if (actionIndex !== -1) {
            c.columns.splice(actionIndex, 1);
          }
          const actionColumn = {
            dataIndex: TABLE_COLUMN_ACTION_KEY,
            key: TABLE_COLUMN_ACTION_KEY,
            title: columnAction.title,
            width: columnAction.width,
            fixed: columnAction.fixed,
            items: columnAction.items,
          };

          const editIndex = columnAction.items.findIndex(f => f.mainType === MainType.TableEdit);
          if (editIndex >= 0) {
            columnAction.items.splice(editIndex, 1);
          }
          if (c.editable.enabled && c.editable.edit.enabled) {
            const newEditItem = {
              mainType: MainType.TableEdit,
              type: WidgetType.Button,
              name: '编辑按钮',
              uid: generateKey(),
              options: c.editable.edit.options,
            };
            columnAction.items.push(newEditItem);
          }

          const removeIndex = columnAction.items.findIndex(
            f => f.mainType === MainType.TableRemove,
          );
          if (removeIndex >= 0) {
            columnAction.items.splice(removeIndex, 1);
          }
          if (c.editable.enabled && c.editable.remove.enabled) {
            const newRemoveItem = {
              mainType: MainType.TableRemove,
              type: WidgetType.Button,
              name: '删除按钮',
              uid: generateKey(),
              options: c.editable.remove.options,
            };
            columnAction.items.push(newRemoveItem);
          }

          if (columnAction.fixed === 'left') {
            c.columns.unshift(actionColumn);
          } else {
            c.columns.push(actionColumn);
          }
        } else {
          if (actionIndex !== -1) {
            c.columns.splice(actionIndex, 1);
          }
        }
      }

      //删除配置序号列
      const rowIndexColumnIndex = c.columns.findIndex(
        s => s.dataIndex === TABLE_COLUMN_ROW_INDEX_KEY,
      );
      if (rowIndexColumnIndex !== -1) {
        c.columns.splice(rowIndexColumnIndex, 1);
      }

      c.columns.map((m, index) => {
        //可拖动
        //最后一列不加拖动，也没啥用；加了会导致table x出滚动条
        if (index !== c.columns.length - 1) {
          m.resizable = true;
        }
        //数据源关系绑定
        const target = props.config.dataSource.mappingRelations.find(f => f.uid === m.uid);
        if (target) {
          m.dataIndex = target.viewField || `widget_${m.uid}`;
          m.editDataIndex = target.editField || target.viewField || `widget_${m.uid}`;
          m.editDataIndexType = target.editFieldType;
          m.defaultValueType = target.defaultValueType;
          m.defaultValue = target.defaultValue;
        } else {
          //排除特殊列后（如序号和操作列没有uid），没有设置关系或者编辑关系的，取widget_uid作为dataIndex和editDataIndex
          if (m.uid) {
            m.dataIndex = `widget_${m.uid}`;
            m.editDataIndex = `widget_${m.uid}`;
          }
        }

        //是否启用单元格分组合并
        if (m.cellGroupMerge === true) {
          m.customCell = (record, index, column) => {
            //当前单元格field
            const currentDataIndex = column.dataIndex;
            //当前单元格值
            const currentValue = record[column.dataIndex];
            //如果值为空不进行合并
            if ([null, '', undefined].includes(currentValue)) {
              return {
                rowSpan: 1,
              };
            }

            //行编辑且新增时，会往最在数组最前添加一条记录，导致index获取+1，所以需要-1
            const currentIndex = hasEditingRow() && isCreating() ? index - 1 : index;

            //判断当前单元格所在行是否正在编辑中
            const isCurrentEditingRow = isEditingRow(record['editRowKey']);
            const preRowData = state?.dataSource[currentIndex - 1];

            //获取列索引
            const currentColumnIndex = tableColumnsChangeRecord.value.findIndex(
              f => f.uid === column.uid,
            );

            //获取当前列前面的所有列设置
            const preColumns = tableColumnsChangeRecord.value.slice(0, currentColumnIndex);
            //判断两行数据是否是同一分组（当前列的值，与之前所有列的值，都需与对应比较的行的对应列的值相等，才会判断为同一组）
            const isSameGroupWithRowData = (rowData: any) => {
              return (
                rowData[currentDataIndex] === currentValue &&
                !preColumns.some(preColumn => {
                  return rowData[preColumn.dataIndex] !== record[preColumn.dataIndex];
                })
              );
            };

            //以下情况下，当前行会当做是第一行：没有上一行| 上一行值不等于当前行值| 是正在编辑中的行 | 上一行正在编辑中 | 与上一行数据比较，判断当前行是否与上一行数据再同一分组
            const isFirstDataRow =
              !preRowData ||
              preRowData[currentDataIndex] !== currentValue ||
              isCurrentEditingRow ||
              isEditingRow(preRowData['editRowKey']) ||
              !isSameGroupWithRowData(preRowData);

            //判断当前行是否正在编辑
            if (!isCurrentEditingRow) {
              //第一行的合并单元格，计算并设置rowSpan
              if (isFirstDataRow) {
                let rowSpanSize = 1;
                const dataSourceLength = state?.dataSource?.length;
                //往下找，直到找到值与当前单元格值不在同一分组或找到的行正在编辑中，则跳出循环，停止合并单元格计数
                for (let i = currentIndex + 1; i < dataSourceLength; i++) {
                  const dataItem = state.dataSource[i];
                  if (!isSameGroupWithRowData(dataItem) || isEditingRow(dataItem['editRowKey'])) {
                    break;
                  }
                  rowSpanSize++;
                }
                return {
                  rowSpan: rowSpanSize,
                };
              } else {
                //合并行余下的单元格rowSpan都为0
                return {
                  rowSpan: 0,
                };
              }
            } else {
              //当前行正在编辑，则独自一行，不合并
              return {
                rowSpan: 1,
              };
            }
          };
        }
      });

      return c;
    });

    const topActions = computed(() => {
      const c = props.config;
      const index = c.action.top.items.findIndex(f => f.mainType === MainType.TableCreate);
      if (index >= 0) {
        c.action.top.items.splice(index, 1);
      }
      if (c.editable.enabled && c.editable.create.enabled) {
        const clickEvent = () => {
          if (c.editable.mode === 'inline') {
            tableRef.value?.addRow();
          } else if (c.editable.mode === 'popup') {
            tableRef.value?.addRow();
          }
        };
        const newItem = {
          mainType: MainType.TableCreate,
          type: WidgetType.Button,
          name: '新增按钮',
          uid: generateKey(),
          options: Object.assign({}, c.editable.create.options, {
            onClick: clickEvent,
            disabled: computed(
              () =>
                c.editable.create.options.disabled || (hasRelation.value && !parentKeyValue.value),
            ),
          }),
        };
        c.action.top.items.unshift(newItem);
      }
      return c.action.top.items;
    });

    const {
      state: columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(cloneDeep(tableConfig.value.columns), {
      needRowIndex: tableConfig.value.options.needRowIndex,
      fixedFirstColumn: true,
    });

    //不排除一个表格与多个查询表单绑定
    const searchFormList = (Array.from(props.blockMap.values()) as any[]).filter(
      f =>
        f.type == BlockType.SearchForm && f.searchSetting.objectId == tableDataSourceObjectId.value,
    );

    const getFilters = () => {
      const searchFilterList =
        searchFormList.reduce((a, b) => {
          const filters = b.searchSetting.mappingRelations
            ?.filter(f => !f.isCustomParam) //去除自定义查询参数条件
            .reduce((x, y) => {
              //const v = parserState.data[`searchForm_${b.uid}`]?.[y.viewField];
              //查询块的控件直接通过widget_uid作为数据绑定key，因为查询块可能存在一个viewField绑定两个控件
              const v = parserState.data[`searchForm_${b.uid}`]?.[`widget_${y.uid}`];
              //查询块的字段值为空的话，或者没有绑定viewField，则不传该条件
              if (v !== undefined && v !== null && v !== '' && y.viewField) {
                const filter = {
                  field: y.viewField,
                  operator: y.operator,
                  value: v,
                };
                x.push(filter);
              }
              return x;
            }, []);
          return a.concat(filters);
        }, []) || [];
      if (hasRelation.value && !props.withoutRelation) {
        const parentFilter = {
          field: relation.childKey,
          operator: 'eq',
          value:
            parserState.data?.[relation.parentDataKey]?.[relation.parentKey] ||
            props.params.primaryKey,
        };
        searchFilterList.push(parentFilter);
      }
      const dataSourceFilter = tableConfig.value.dataSource.filter;
      if (dataSourceFilter) {
        searchFilterList.push(
          getFilter(
            dataSourceFilter,
            parserState.block,
            parserState.blockConfig,
            props.params?.parentParams,
          ),
        );
      }
      return searchFilterList;
    };

    const getFilterObject = () => {
      const retObj = {};
      const filters = getFilters();
      //目前只遍历第一层filters，获取查询块和关联父级的的filters即可
      filters.forEach(e => {
        const key = camelCase(e.field);
        retObj[key] = e.value;
      });
      return retObj;
    };

    const getParams = () => {
      //如果表格绑定多个查询块，则各查询块的数据源如果id相同，正常情况下params也相同
      const paramList =
        searchFormList?.reduce((a, b) => {
          const params = b.searchSetting?.params || [];
          if (a?.length) {
            a.forEach((m, index) => {
              //如果有相同的param key,且设置了uid(绑定了控件的)，则替换当前params中的元素
              //（逻辑为默认取最后一个设置了动态参数的param）
              const target = params.find(f => f.key === m.key && f.uid);
              if (target) {
                a.splice(index, 1, target);
              }
            });
            return a;
          } else {
            //首次进入时为空数组，或后续为空数组时，直接拿后续block的params合并到数组中
            return a.concat(params);
          }
        }, []) || [];

      paramList.forEach(p => {
        const paramUid = p.uid;
        const targetBlock = searchFormList?.find(f => {
          return parserState.data[`searchForm_${f.uid}`]?.[`widget_${paramUid}`];
        });
        const v = targetBlock
          ? parserState.data[`searchForm_${targetBlock.uid}`]?.[`widget_${paramUid}`]
          : null;
        p.value = v;
      });

      return paramList;
    };

    const getSort = () => {
      return props.config.dataSource?.sort?.filter(f => f.field && f.type && f.nulls) || [];
    };

    const getQueryParams = () => {
      return {
        pageId: parserState.pageId,
        //functionId?: string;
        objectId: props.config.dataSource.objectId,
        type: props.config.dataSource.type,
        fuzzyQuery: {
          fields: [],
          value: '',
        },
        params: getParams(),
        filter: {
          logic: 'and',
          filters: getFilters(),
        },
        sort: getSort(),
      };
    };

    //给导出方法获取参数用
    const getExportParams = () => {
      //当导出方案为客制化（custom）时，参数将转成驼峰
      if (props.config.importAndExport?.exportType === 'custom') {
        return getFilterObject();
      } else {
        return getQueryParams();
      }
    };

    const initFetchDataContext = () => {
      const retObject = {
        page: 1,
        tableSize: props.config.options.size, // 'default' | 'middle' | 'small'
        stripe: props.config.options.stripe,
        /* requestParams: {
          pageId: parserState.pageId,
          //functionId?: string;
          objectId: props.config.dataSource.objectId,
          type: props.config.dataSource.type,
          fuzzyQuery: {
            fields: [],
            value: '',
          },
          params: [],
          filter: {
            logic: 'and',
            filters: getFilters(),
          },
          sort: [],
        }, */
      } as any;

      if (props.config.options.pagination.pageSize) {
        retObject.pageSize = props.config.options.pagination.pageSize;
      }

      return retObject;
    };

    const validateSearchForm = () => {
      const searchBlockRefs = searchFormList
        .map(m => parserState?.block?.get(m.uid))
        .filter(x => x);
      return Promise.all(searchBlockRefs.map(m => m.validate?.()));
    };

    const fetchDataContext = reactive(initFetchDataContext());

    const {
      stripe,
      reload: fetchData,
      context: state,
    } = useFetchData(
      (params: any) => {
        //查询参数需动态获取，不仅是为了获取最新值，而且要把查询块中的空值的filter去掉
        const p = cloneDeep(params);
        Object.assign(p, getQueryParams());
        if (props.config?.options?.pagination?.enabled) {
          return queryByPage(p);
        } else {
          delete p['page'];
          delete p['pageSize'];
          return wrap(() => queryByList(p))();
        }
      },
      fetchDataContext,
      {
        autoFetch: hasRelation.value
          ? false
          : props.config?.options?.autoFetch === false
          ? false
          : true,
        onValidateParams: (_params, next) => {
          // 如果表格有关联关系，且父级块中的主键为空，则不执行查询
          if (
            hasRelation.value &&
            !parserState.data?.[relation.parentDataKey]?.[relation.parentKey] &&
            !props.withoutRelation
          ) {
            return;
          }
          validateSearchForm()
            .then(() => {
              next();
            })
            .catch(() => {
              message.warning('校验失败');
              return;
            });
        },
      },
    );
    /*     const stripe = (_: any, index: number) =>
      index % 2 === 1 && props.config.options.stripe && 'ant-pro-table-row-striped'; */

    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      validateSearchForm()
        .then(() => {
          state.page = page;
          state.pageSize = pageSize;
        })
        .catch(() => {
          message.warning('校验失败');
        });
    };

    const reload = () => {
      // 如果表格有关联关系，且父级块中的主键为空，则不执行查询
      if (
        hasRelation.value &&
        !parserState.data?.[relation.parentDataKey]?.[relation.parentKey] &&
        !props.withoutRelation
      ) {
        return;
      }
      validateSearchForm()
        .then(() => {
          fetchData();
        })
        .catch(() => {
          message.warning('校验失败');
        });
    };

    // 直接监听关联的父级块的主键id,有变动的话则查询（无论有没有关系都监听，如果没有关系则一直是undefined，并不会触发查询）
    watch(
      () => parserState.data?.[relation?.parentDataKey]?.[relation?.parentKey],
      (n, o) => {
        if (n && n !== o) {
          reload();
        }
      },
      {
        immediate: true,
      },
    );

    const getModel = () => {
      return tableRef.value?.getModel?.();
    };

    const hasEditingRow = () => {
      return tableRef.value?.hasEditingRow?.();
    };

    const isEditingRow = (editRowKey: string) => {
      return tableRef.value?.isEditingRow?.(editRowKey) === true;
    };

    const isCreating = () => {
      return tableRef.value?.isCreate;
    };

    const getData = () => {
      return state?.dataSource || [];
    };

    expose({ reload, getModel, hasEditingRow, rowSelection, getData });

    const tableColumnsChangeRecord = ref([]);

    const handleColumnsChange = (c: any[]) => {
      tableColumnsChangeRecord.value = c;
    };

    //禁用条件
    const itemDisabledCondition = (config, value) => {
      const condition =
        config.options?.disabledCondition &&
        parserState?.conditions?.find(f => f.uid === config.options?.disabledCondition);
      if (condition) {
        const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
        return f(value, null, parserState, eh);
      } else {
        return false;
      }
    };

    return {
      MainType,
      TABLE_COLUMN_ACTION_KEY,
      tableRef,
      handleResizeColumn,
      tableRowKey,
      customRowKey,
      rowSelection,
      relation,
      hasRelation,
      parentKeyValue,
      tableConfig,
      topActions,
      parserState,
      stripe,
      //cloumns
      columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
      //data
      fetchDataContext,
      reload,
      state,
      getQueryParams,
      getExportParams,
      handleTableChange,
      getModel,
      getData,
      hasEditingRow,
      handleColumnsChange,
      itemDisabledCondition,
    };
  },
  components: {
    Widget,
    /* DragContainer,
    Draggable,
    DragIcon, */
    EditInlineTable,
    EditPopupTable,
    ImportAndExport,
  },
});
</script>

<style lang="less" scoped></style>
