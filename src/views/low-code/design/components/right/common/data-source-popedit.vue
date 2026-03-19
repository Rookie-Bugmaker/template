<template>
  <popup-edit
    v-if="dataSourceType === 'table'"
    :value="value"
    @update:value="v => $emit('update:value', v)"
    @select="(v, record) => $emit('select', v, record)"
    :options="tablePopeditOptions"
    :size="size"
    :disabled="disabled"
    v-bind="$attrs"
  ></popup-edit>
  <popup-edit
    v-if="dataSourceType === 'view'"
    :value="value"
    @update:value="v => $emit('update:value', v)"
    @select="(v, record) => $emit('select', v, record)"
    :options="viewPopeditOptions"
    :size="size"
    :disabled="disabled"
    v-bind="$attrs"
  ></popup-edit>
</template>

<script lang="ts">
import { defineComponent, inject, watch } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import {
  findPageByApplicationIdOrGroupId as findTableByPage,
  getTableById,
} from '@/api/low-code/data-set/table';
import {
  findPageByApplicationIdOrGroupId as findViewByPage,
  getViewById,
} from '@/api/low-code/data-set/sql';
import PopupEdit from '@/components/popup-edit/index.vue';
import type { Options } from '@/components/popup-edit/typing';

type DataSourceType = 'table' | 'view';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: String,
      default: '',
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
    dataSourceType: {
      type: String as PropType<DataSourceType>,
      default: 'table',
    },
    //允许跨应用查询（获取所以应用下的表或视图）（优先级比allowCrossGroup高）
    allowCrossApplication: {
      type: Boolean,
      default: false,
    },
    //允许跨组查询（获取同应用其他组下的表或视图）
    allowCrossGroup: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emit: ['update:value', 'select'],
  setup(props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    watch(
      () => props.dataSourceType,
      (n, o) => {
        if (n && n !== o) {
          emit('update:value', null);
        }
      },
    );

    const tablePopeditOptions: Options = {
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
        {
          title: '应用名称',
          dataIndex: 'applicationName',
          width: 80,
          ellipsis: true,
        },
        {
          title: '分组名称',
          dataIndex: 'groupName',
          ellipsis: true,
        },
      ],
      getDataById: getTableById,
      getDataByPage: (params: any) => {
        const otherParams = props.allowCrossApplication
          ? {}
          : props.allowCrossGroup
          ? {
              applicationId: designerState.applicationInfo?.applicationId,
            }
          : {
              applicationId: designerState.applicationInfo?.applicationId,
              groupId: designerState.groupInfo?.groupId,
            };
        return findTableByPage(Object.assign(params, otherParams));
      },
      modalWidth: 840,
      modalTitle: '选择数据源',
    };

    const viewPopeditOptions: Options = {
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
        {
          title: '应用名称',
          dataIndex: 'applicationName',
          width: 80,
          ellipsis: true,
        },
        {
          title: '分组名称',
          dataIndex: 'groupName',
          ellipsis: true,
        },
      ],
      getDataById: getViewById,
      getDataByPage: (params: any) => {
        const otherParams = props.allowCrossApplication
          ? {}
          : props.allowCrossGroup
          ? {
              applicationId: designerState.applicationInfo?.applicationId,
            }
          : {
              applicationId: designerState.applicationInfo?.applicationId,
              groupId: designerState.groupInfo?.groupId,
            };
        return findViewByPage(Object.assign(params, otherParams));
      },
      modalWidth: 840,
      modalTitle: '选择数据源',
    };
    return {
      designerState,
      tablePopeditOptions,
      viewPopeditOptions,
    };
  },
  components: {
    PopupEdit,
  },
});
</script>

<style lang="less" scoped></style>
