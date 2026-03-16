<template>
  <table-wrapper
    :type="wrapperType"
    class="yl-table-wrapper"
    :body-style="
      wrapperType === 'card'
        ? { padding: hideToolbar ? '10px 10px 10px' : '0 10px 5px' }
        : undefined
    "
    ref="elRef"
  >
    <div class="ant-pro-table-list-toolbar" v-if="!hideToolbar">
      <div class="ant-pro-table-list-toolbar-container">
        <div class="ant-pro-table-list-toolbar-left">
          <div class="ant-pro-table-list-toolbar-extra-left">
            <slot name="extraLeft" />
          </div>
        </div>
        <div class="ant-pro-table-list-toolbar-right">
          <div class="ant-pro-table-list-toolbar-extra-right">
            <slot name="extraRight" />
          </div>
          <template v-if="hideRightToolsSetting !== true">
            <div class="ant-pro-table-list-toolbar-divider">
              <a-divider type="vertical" />
            </div>
            <div
              class="ant-pro-table-list-toolbar-setting-item"
              v-if="!hideRightToolsSetting.hideRefresh"
            >
              <a-tooltip :title="$t('table.setting.refresh')">
                <reload-outlined @click="$emit('reload')" />
              </a-tooltip>
            </div>
            <div
              class="ant-pro-table-list-toolbar-setting-item"
              v-if="!hideRightToolsSetting.hideDensity"
            >
              <a-tooltip :title="$t('table.setting.density')">
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <column-height-outlined />
                  <template #overlay>
                    <a-menu
                      style="width: 80px; text-align: center"
                      :selected-keys="[state.tableSize]"
                      @click="
                        ({ key }) => {
                          state.tableSize = key as SizeType;
                        }
                      "
                    >
                      <a-menu-item key="default">
                        <a href="javascript:;">{{ $t('global.size.default') }}</a>
                      </a-menu-item>
                      <a-menu-item key="middle">
                        <a href="javascript:;">{{ $t('global.size.middle') }}</a>
                      </a-menu-item>
                      <a-menu-item key="small">
                        <a href="javascript:;">{{ $t('global.size.small') }}</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-tooltip>
            </div>
            <div
              class="ant-pro-table-list-toolbar-setting-item"
              v-if="!hideRightToolsSetting.hideColumnSorting"
            >
              <a-popover
                placement="bottomRight"
                arrowPointAtCenter
                trigger="click"
                overlayClassName="ant-pro-table-column-setting-overlay"
              >
                <template #title>
                  <div class="ant-pro-table-column-setting-title">
                    <a-checkbox
                      v-model:checked="columnState.checkAll"
                      :indeterminate="columnState.indeterminate"
                      @change="handleColumnAllClick"
                    >
                      {{ $t('table.setting.columnDisplaySorting') }}
                    </a-checkbox>
                    <a @click="reset">{{ $t('table.setting.button.reset') }}</a>
                  </div>
                </template>
                <template #content>
                  <span class="ant-pro-table-column-setting-list">
                    <drag-container
                      lockAxis="y"
                      dragClass="ant-pro-table-drag-ghost"
                      dropClass="ant-pro-table-drop-ghost"
                      @drop="({ removedIndex, addedIndex }) => move(removedIndex, addedIndex)"
                    >
                      <draggable :key="column.key" v-for="column in dynamicColumnItems">
                        <div class="ant-pro-table-column-setting-list-item">
                          <drag-icon />
                          <a-checkbox
                            :checked="column.checked"
                            @change="handleColumnChange($event, column)"
                          >
                            {{ column.label }}
                          </a-checkbox>
                        </div>
                      </draggable>
                    </drag-container>
                  </span>
                </template>
                <a-tooltip :title="$t('form.button.columnSettings')">
                  <setting-outlined />
                </a-tooltip>
              </a-popover>
            </div>
          </template>
        </div>
      </div>
    </div>
    <a-table
      class="yl-table"
      v-bind="$attrs"
      :size="state.tableSize"
      :columns="dynamicColumns"
      @resizeColumn="handleResizeColumn"
      :scroll="$attrs.scroll ? Object.assign({ x: '100%' }, $attrs.scroll) : { x: '100%' }"
    >
      <template v-if="$slots.title" #title="slotProps">
        <slot name="title" v-bind="slotProps" />
      </template>
      <template v-if="$slots.headerCell" #headerCell="slotProps">
        <slot name="headerCell" v-bind="slotProps" />
      </template>
      <template v-if="$slots.bodyCell" #bodyCell="slotProps">
        <slot name="bodyCell" v-bind="slotProps" />
      </template>
      <template v-if="$slots.summary" #summary="slotProps">
        <slot name="summary" v-bind="slotProps" />
      </template>
      <template v-if="$slots.footer" #footer="slotProps">
        <slot name="footer" v-bind="slotProps" />
      </template>
      <template v-if="$slots.expandedRowRender" #expandedRowRender="slotProps">
        <slot name="expandedRowRender" v-bind="slotProps"></slot>
      </template>
    </a-table>
  </table-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watchEffect, unref } from 'vue';
import type { PropType } from 'vue';
import type { TableColumn } from '@/typing';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import DragIcon from '@/components/table/drag-icon.vue';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import { cloneDeep, isBoolean } from 'lodash';
import TableWrapper from './table-wrapper.vue';
import type { TableColumnsType } from 'ant-design-vue';

type TableWrapperType = 'card' | 'default';

type HideRightToolsOptions = {
  hideRefresh?: boolean;
  hideDensity?: boolean;
  hideColumnSorting?: boolean;
};

export default defineComponent({
  name: 'YlTable',
  inheritAttrs: false,
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    //是否显示列序号
    needRowIndex: {
      type: Boolean,
      default: false,
    },
    //序号列个性化配置
    rowIndexColumn: {
      type: Object as PropType<TableColumn>,
      default: null,
    },
    //表格大小
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
    //是否可拖动
    resizable: {
      type: Boolean,
      default: true,
    },
    //隐藏工具栏
    hideToolbar: {
      type: Boolean,
      default: false,
    },
    //隐藏工具栏右侧按钮
    hideRightTools: {
      type: [Boolean, Object] as PropType<boolean | HideRightToolsOptions>,
      default: false,
    },
    //设置列默认宽度（组件会给每一列加上默认宽度）
    columnDefaultWidth: {
      type: [Number, Boolean],
      default: 120,
    },
    wrapperType: {
      type: String as PropType<TableWrapperType>,
      default: 'card',
    },
  },
  emits: ['reload', 'columns-change'],
  setup(props, { emit }) {
    const state = reactive({
      tableSize: 'small' as SizeType,
    });

    const hideRightToolsSetting = computed<true | HideRightToolsOptions>(() => {
      const c = props.hideRightTools;
      if (isBoolean(c)) {
        if (c) {
          return true;
        } else {
          return {
            hideRefresh: false,
            hideDensity: false,
            hideColumnSorting: false,
          };
        }
      } else {
        return c;
      }
    });

    watchEffect(() => {
      state.tableSize = unref(props.size);
    });

    const hasPropertyAndNotNull = (obj: any, key: string) => {
      return Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== '';
    };

    const recursionSetColumns = (columns: TableColumnsType) => {
      //以table设置为基准
      const resizable = props.resizable;
      const columnDefaultWidth = props.columnDefaultWidth
        ? isBoolean(props.columnDefaultWidth)
          ? 120
          : props.columnDefaultWidth
        : false;
      return columns.map((m, index) => {
        const c = cloneDeep(m) as any;
        if (index !== columns.length - 1) {
          //列有配置可拖动则按列设置为准，没有则按table设置为准
          c.resizable = resizable
            ? hasPropertyAndNotNull(c, 'resizable')
              ? c.resizable
              : props.resizable
            : false;
        }
        //为列设置默认宽度
        if (columnDefaultWidth) {
          c.width = hasPropertyAndNotNull(c, 'width') ? c.width : columnDefaultWidth;
        }
        //设置ellipsis
        c.ellipsis = hasPropertyAndNotNull(c, 'ellipsis') ? c.ellipsis : true;
        if (c.children?.length) {
          c.children = recursionSetColumns(c.children);
        }
        return c;
      });
    };

    const converColumns = computed(() => recursionSetColumns(props.columns));

    const {
      state: columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(converColumns, {
      needRowIndex: props.needRowIndex,
      rowIndexColumn: props.rowIndexColumn,
      fixedFirstColumn: true,
    });

    const handleResizeColumn = (width, column) => {
      column.width = width;
    };

    watchEffect(
      () => {
        emit('columns-change', dynamicColumns.value);
      },
      {
        flush: 'post',
      },
    );

    return {
      state,
      hideRightToolsSetting,
      columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
      handleResizeColumn,
    };
  },
  components: {
    DragContainer,
    Draggable,
    DragIcon,
    TableWrapper,
  },
});
</script>

<style lang="less" scoped></style>
