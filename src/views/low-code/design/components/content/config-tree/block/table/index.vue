<template>
  <block-wrapper :is-selected="designerState.currentConfig?.uid === tableConfig.uid">
    <div class="ant-pro-table-list-toolbar">
      <div class="ant-pro-table-list-toolbar-container">
        <div class="ant-pro-table-list-toolbar-left">
          <a-space v-if="tableConfig.action.top.position == 'left'">
            <widget-wrapper
              v-for="item in topActions"
              :key="item.uid"
              :movable="false"
              :hide-remove="true"
            >
              <yl-button
                v-if="item.mainType === MainType.TableCreate"
                act-type="add"
                withoutPermission
              ></yl-button>
              <widget v-else :config="item" />
            </widget-wrapper>
            <widget-wrapper :movable="false" :hide-remove="true">
              <import-export v-if="tableConfig?.importAndExport?.enabled" />
            </widget-wrapper>
          </a-space>
        </div>
        <div class="ant-pro-table-list-toolbar-right">
          <a-space v-if="tableConfig.action.top.position == 'right'">
            <widget-wrapper
              v-for="item in topActions"
              :key="item.uid"
              :movable="false"
              :hide-remove="true"
            >
              <yl-button
                v-if="item.mainType === MainType.TableCreate"
                act-type="add"
                withoutPermission
              ></yl-button>
              <widget v-else :config="item" />
            </widget-wrapper>
            <widget-wrapper :movable="false" :hide-remove="true">
              <import-export v-if="tableConfig?.importAndExport?.enabled" />
            </widget-wrapper>
          </a-space>
          <div class="ant-pro-table-list-toolbar-divider">
            <a-divider type="vertical" />
          </div>
          <div class="ant-pro-table-list-toolbar-setting-item">
            <reload-outlined />
          </div>
          <div class="ant-pro-table-list-toolbar-setting-item">
            <column-height-outlined />
          </div>
          <div class="ant-pro-table-list-toolbar-setting-item">
            <setting-outlined />
          </div>
        </div>
      </div>
    </div>
    <a-table
      v-if="tableColumns?.length"
      class="designer-table"
      :dataSource="dataSource"
      :columns="tableColumns"
      @resizeColumn="handleResizeColumn"
      :scroll="{ x: 'max-content', y: config.options.scrollY }"
      :row-class-name="stripe"
      :size="config.options.size"
      :bordered="config.options.bordered"
      :pagination="
        config.options.pagination.enabled
          ? {
              size: 'small',
            }
          : false
      "
      :rowSelection="config.options?.rowSelection?.enabled ? config.options.rowSelection : null"
    >
      <template #headerCell="{ title, column }">
        <template v-if="column.options?.required">
          <span class="header-cell-required">{{ title }}</span>
        </template>
        <template v-else>
          <span>{{ title }}</span>
        </template>
      </template>
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === TABLE_COLUMN_ACTION_KEY">
          <widget-wrapper :movable="false" :hide-remove="true">
            <a v-if="config.workflow?.enabled">提交审批</a>
            <template v-for="item in column.items" :key="item.uid">
              <yl-button
                v-if="item.mainType === MainType.TableEdit"
                act-type="edit-inline"
                withoutPermission
              ></yl-button>
              <yl-button
                v-else-if="item.mainType === MainType.TableRemove"
                act-type="remove-inline"
                withoutPermission
              ></yl-button>
              <widget v-else :config="item" />
            </template>
          </widget-wrapper>
        </template>
        <template v-else>
          <template v-if="config.editable.enabled && config.editable.mode === 'inline'">
            <widget-wrapper :movable="false" :hide-remove="true">
              <widget :config="column" />
            </widget-wrapper>
          </template>
        </template>
      </template>
    </a-table>
    <a-table
      v-else
      class="designer-table"
      :dataSource="dataSource"
      @resizeColumn="handleResizeColumn"
      :scroll="{ x: 'max-content', y: config.options.scrollY }"
      :row-class-name="stripe"
      :size="config.options.size"
      :bordered="config.options.bordered"
      :pagination="config.options.pagination.enabled"
      :rowSelection="config.options?.rowSelection?.enabled ? config.options.rowSelection : null"
    >
      <a-table-column key="default" title="未设置表格列" data-index="default">
        <template #default>
          <span>未设置</span>
        </template>
      </a-table-column>
    </a-table>
  </block-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed } from 'vue';
import type { PropType } from 'vue';
import BlockWrapper from '../../common/block-wrapper.vue';
import WidgetWrapper from '../../common/widget-wrapper.vue';
import Widget from '../../widget/index.vue';
import {
  designerStateInjectKey,
  TABLE_COLUMN_ACTION_KEY,
  TABLE_COLUMN_ROW_INDEX_KEY,
} from '@/views/low-code/design/keys';
import { generateKey } from '@/views/low-code/design/utils/key';
import { MainType, WidgetType } from '@/views/low-code/design/typing/index';
import { cloneDeep } from 'lodash';
import ImportExport from '@/components/import-export/index.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
  },
  setup(props) {
    const dataSource = ref([
      { [TABLE_COLUMN_ROW_INDEX_KEY]: 1, temp: 'temp0' },
      { [TABLE_COLUMN_ROW_INDEX_KEY]: 2, temp: 'temp1' },
      { [TABLE_COLUMN_ROW_INDEX_KEY]: 3, temp: 'temp2' },
    ]);

    const handleResizeColumn = (w, col) => {
      col.width = w;
    };

    const designerState = inject(designerStateInjectKey);

    const tableConfig = computed(() => {
      const c = props.config;
      /* if (c) {
        c.columns?.forEach(e => {
          e.customHeaderCell = customHeaderCell;
          e.customCell = customCell;
        });

        const columnAction = c.action?.column;

        //操作列
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
          if (c.editable.enabled && c.editable.edit.enabled) {
            if (editIndex < 0) {
              const newEditItem = {
                mainType: MainType.TableEdit,
                type: WidgetType.Button,
                name: '编辑按钮',
                uid: generateKey(),
                options: c.editable.edit.options,
              };
              columnAction.items.push(newEditItem);
            }
          } else {
            if (editIndex >= 0) {
              columnAction.items.splice(editIndex, 1);
            }
          }

          const removeIndex = columnAction.items.findIndex(
            f => f.mainType === MainType.TableRemove,
          );

          if (c.editable.enabled && c.editable.remove.enabled) {
            if (removeIndex < 0) {
              const newRemoveItem = {
                mainType: MainType.TableRemove,
                type: WidgetType.Button,
                name: '删除按钮',
                uid: generateKey(),
                options: c.editable.remove.options,
              };
              columnAction.items.push(newRemoveItem);
            }
          } else {
            if (removeIndex >= 0) {
              columnAction.items.splice(removeIndex, 1);
            }
          }

          if (columnAction.fixed === 'left') {
            c.columns.unshift(actionColumn);
          } else {
            c.columns.push(actionColumn);
          }
        } else {
          c.columns.splice(actionIndex, 1);
        }
      } */

      //序号列
      const rowIndexColumnIndex = c.columns.findIndex(
        s => s.dataIndex === TABLE_COLUMN_ROW_INDEX_KEY,
      );
      //每次都删除，保证序号在第一列
      if (rowIndexColumnIndex !== -1) {
        c.columns.splice(rowIndexColumnIndex, 1);
      }
      if (c.options.needRowIndex) {
        const rowIndexColumn = {
          dataIndex: TABLE_COLUMN_ROW_INDEX_KEY,
          key: TABLE_COLUMN_ROW_INDEX_KEY,
          title: '序号',
          width: 65,
        };
        c.columns.unshift(rowIndexColumn);
      }

      return c;
    });

    const tableColumns = computed(() => {
      const c = props.config;
      const columns = cloneDeep(c.columns);
      if (c) {
        columns?.forEach(e => {
          e.customHeaderCell = customHeaderCell;
          e.customCell = customCell;
        });

        const columnAction = c.action?.column;

        //操作列
        const actionIndex = columns.findIndex(s => s.dataIndex === TABLE_COLUMN_ACTION_KEY);
        if (columnAction.show) {
          if (actionIndex !== -1) {
            columns.splice(actionIndex, 1);
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
            columns.unshift(actionColumn);
          } else {
            columns.push(actionColumn);
          }
        } else {
          if (actionIndex !== -1) {
            columns.splice(actionIndex, 1);
          }
        }
      }

      //序号列
      const rowIndexColumnIndex = columns.findIndex(
        s => s.dataIndex === TABLE_COLUMN_ROW_INDEX_KEY,
      );
      //每次都删除，保证序号在第一列
      if (rowIndexColumnIndex !== -1) {
        columns.splice(rowIndexColumnIndex, 1);
      }
      if (c.options.needRowIndex) {
        const rowIndexColumn = {
          dataIndex: TABLE_COLUMN_ROW_INDEX_KEY,
          key: TABLE_COLUMN_ROW_INDEX_KEY,
          title: '序号',
          width: 65,
        };
        columns.unshift(rowIndexColumn);
      }

      return columns;
    });

    const topActions = computed(() => {
      const c = props.config;
      const index = c.action.top.items.findIndex(f => f.mainType === MainType.TableCreate);
      if (index >= 0) {
        c.action.top.items.splice(index, 1);
      }
      if (c.editable.enabled && c.editable.create.enabled) {
        const newItem = {
          mainType: MainType.TableCreate,
          type: WidgetType.Button,
          name: '新增按钮',
          uid: generateKey(),
          options: c.editable.create.options,
        };
        c.action.top.items.unshift(newItem);
      }
      return c.action.top.items;
    });

    const customHeaderCell = column => {
      return {
        onClick: event => {
          event.stopPropagation();
          //不能直接用column赋值，插槽给的column会丢失响应式
          designerState.currentConfig = props.config.columns.find(f => f.uid === column.uid);
        },
      };
    };
    const customCell = (_record, _rowIndex, column) => {
      return {
        onClick: event => {
          event.stopPropagation();
          //不能直接用column赋值，插槽给的column会丢失响应式
          designerState.currentConfig = props.config.columns.find(f => f.uid === column.uid);
        },
      };
    };

    const stripe = (_: any, index: number) =>
      index % 2 === 1 && tableConfig.value.options.stripe && 'table-row-striped';

    return {
      dataSource,
      MainType,
      TABLE_COLUMN_ACTION_KEY,
      handleResizeColumn,
      tableConfig,
      tableColumns,
      topActions,
      designerState,
      stripe,
    };
  },
  components: { BlockWrapper, WidgetWrapper, Widget, ImportExport },
});
</script>

<style lang="less" scoped>
.designer-table {
  z-index: 4;
  :deep(.ant-table-cell) {
    &:hover {
      border: 1px dashed #1890ff;
    }
  }
  :deep(.table-row-striped) {
    background: #fafafa;
  }
}
</style>
