<template>
  <yl-table
    row-key="roleId"
    size="small"
    :columns="tableColumns"
    :data-source="state.dataSource"
    :pagination="false"
    :hide-toolbar="true"
    wrapper-type="default"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'action'">
        <a-space>
          <!-- <a-popconfirm :title="$t('global.operation.delete.tips')" @confirm="handleDelete(record)">
            <a>{{ $t('global.operation.delete') }}</a>
          </a-popconfirm> -->
          <yl-button act-type="remove-inline" confirm @click="handleDelete(record)"></yl-button>
        </a-space>
      </template>
    </template>
  </yl-table>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onUnmounted } from 'vue';
import type { PropType } from 'vue';
import type { TableColumn } from '@/typing';
import { useI18n } from 'vue-i18n';
import type { RoleItem } from '@/api/system/role/index';

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
  name: 'RoleTable',
  props: {
    tableData: {
      type: Array as PropType<RoleItem[]>,
      default: () => [],
    },
  },
  emits: ['delete-role'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const tableColumns: TableColumn[] = [
      {
        title: () => t('view.system.user.modal.roleCode.roleTable'),
        dataIndex: 'roleCode',
        ellipsis: true,
      },
      {
        title: () => t('view.system.user.modal.roleName.roleTable'),
        dataIndex: 'roleName',
        ellipsis: true,
      },
      {
        title: () => t('view.system.user.modal.roleDesc.roleTable'),
        dataIndex: 'roleDescription',
        ellipsis: true,
      },
      {
        title: () => t('view.system.user.modal.operation.roleTable'),
        width: 80,
        dataIndex: 'action',
      },
    ];

    const loading = ref(false);

    const state = reactive({
      dataSource: [] as RoleItem[],
    });

    watch(
      () => props.tableData,
      n => {
        state.dataSource = n;
      },
      { immediate: true },
    );

    onUnmounted(() => {
      state.dataSource = [];
    });

    const handleDelete = (record: any) => {
      emit('delete-role', record.roleId);
    };

    return {
      tableColumns,
      ...formLayout,
      loading,
      state,
      handleDelete,
    };
  },
});
</script>
