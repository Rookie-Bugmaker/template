<template>
  <popup-edit
    :value="value"
    @update:value="v => $emit('update:value', v)"
    @select="(v, r) => $emit('select', v, r)"
    v-bind="$attrs"
    :options="options"
    allow-clear
    @clear="$emit('clear')"
  ></popup-edit>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { findDataSourceByPage, findDataSourceById } from '@/api/low-code/data-source/index';
import type { Options } from '@/components/popup-edit/typing';
import PopupEdit from '@/components/popup-edit/index.vue';

export default defineComponent({
  name: 'DataSourceSelector',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value', 'select', 'clear'],
  setup() {
    const options: Options = {
      valueField: 'dataSourceId',
      textField: 'dataSourceCode',
      searchFormFields: [
        {
          field: 'dataSourceCode',
          label: '数据源编码',
        },
        {
          field: 'dbUrl',
          label: '数据库连接',
        },
      ],
      tableColumns: [
        {
          title: '数据源编码',
          dataIndex: 'dataSourceCode',
        },
        {
          title: '数据库连接',
          dataIndex: 'dbUrl',
        },
        {
          title: '用户名',
          dataIndex: 'username',
        },
        {
          title: '描述',
          dataIndex: 'dataSourceDesc',
        },
      ],
      getDataById: findDataSourceById,
      getDataByPage: findDataSourceByPage,
      modalWidth: 900,
      modalTitle: '请选择数据源',
    };

    return {
      options,
    };
  },
  components: {
    PopupEdit,
  },
});
</script>
