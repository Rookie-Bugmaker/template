<template>
  <page-container>
    <div class="ant-pro-table">
      <div class="ant-pro-table-search">
        <a-form layout="horizontal">
          <a-row :gutter="16" type="flex" justify="start">
            <a-col :xs="24" :sm="24" :md="6">
              <a-form-item :label="t('view.system.user.form.userName.label')">
                <a-input
                  v-model:value="queryParams.userName"
                  :placeholder="t('view.system.user.form.userName.placeholder')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="6">
              <a-form-item :label="t('view.system.user.form.userDesc.label')">
                <a-input
                  v-model:value="queryParams.userDescription"
                  :placeholder="t('view.system.user.form.userDesc.placeholder')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="6">
              <a-form-item :label="t('view.system.user.form.roleId.label')">
                <role-popup-edit
                  v-model:value="queryParams.roleId"
                  :placeholder="t('view.system.user.form.roleId.placeholder')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col flex="auto">
              <a-form-item :wrapper-col="{ span: 24 }" class="search-form-query-item">
                <a-space>
                  <yl-button act-type="search" html-type="submit" @click="reload"></yl-button>
                  <yl-button act-type="reset" @click="resetQueryParams"></yl-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <yl-table
        row-key="userId"
        :size="state.tableSize"
        :loading="state.loading"
        :columns="baseColumns"
        needRowIndex
        :data-source="state.dataSource"
        :pagination="state.pagination"
        :row-selection="rowSelection"
        :customRow="customRow"
        :scroll="{ y: 'calc(100vh - 350px)' }"
        @change="handleTableChange"
        @reload="reload"
      >
        <template #extraLeft>
          <a-space>
            <yl-button
              act-type="add"
              @click="
                () => {
                  editModal.model = null;
                  editModal.open = true;
                }
              "
            ></yl-button>
            <yl-button
              act-type="remove-batch"
              confirm
              :disabled="!rowSelection.selectedRowKeys.value?.length"
              @click="handleBatchDelete"
            ></yl-button>
            <import-export
              :only-import="true"
              downloadTempleteName="用户管理模版"
              downloadResName="用户管理验证结果"
              :importUrl="importUrl"
              :checkFileUrl="checkFileUrl"
              :downloadTempleteUrl="downloaTempleteUrl"
              :downloadResUrl="downloadResUrl"
              @success="reload"
            />
          </a-space>
        </template>
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'userType'">
            <user-type-tag :value="text" />
          </template>
          <template v-else-if="column.dataIndex === 'disableState'">
            <a-tag v-if="disableStateMap[text]" :color="disableStateMap[text].color">
              {{ disableStateMap[text].content() }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'startDate'">
            {{ text ? dayjs(text).format('YYYY-MM-DD') : null }}
          </template>
          <template v-else-if="column.dataIndex === 'endDate'">
            {{ text ? dayjs(text).format('YYYY-MM-DD') : null }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <yl-button act-type="edit-inline" @click.stop="handleOpenEdit(record)"></yl-button>
            <yl-button
              act-type="remove-inline"
              confirm
              stop-propagation
              @click.stop="handleDelete(record)"
            ></yl-button>
          </template>
        </template>
      </yl-table>
    </div>
    <edit-modal
      v-if="editModal.open"
      :model="editModal.model"
      :open="editModal.open"
      @cancel="
        () => {
          editModal.open = false;
        }
      "
      @ok="
        () => {
          editModal.open = false;
          reload();
        }
      "
    />
  </page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { findUserByPageCp, deleteUser } from '@/api/system/user/index';
import type { Pagination, TableColumn } from '@/typing';
import { useI18n } from 'vue-i18n';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { message } from 'ant-design-vue';
import importExport from '@/components/import-export/index.vue';
import { Service } from '@/api/typing';
import EditModal from './edit-modal.vue';
import RolePopupEdit from './components/role-popup-edit.vue';
import dayjs from 'dayjs';
import UserTypeTag from './components/user-type-tag.vue';
import { useTableRowSelection } from '@/utils/hooks/useTableRowSelection';

export default defineComponent({
  name: 'UserList',
  setup() {
    const { t } = useI18n();
    const baseColumns: TableColumn[] = [
      {
        title: () => t('view.system.user.table.userName.title'),
        dataIndex: 'userName',
      },
      {
        title: () => t('view.system.user.table.userDesc.title'),
        dataIndex: 'userDescription',
        ellipsis: true,
      },
      {
        title: () => t('view.system.user.table.userType.title'),
        dataIndex: 'userType',
        width: 100,
      },
      {
        title: () => t('view.system.user.table.userStatus.title'),
        dataIndex: 'disableState',
        width: 100,
      },
      {
        title: () => t('view.system.user.table.lastUpdateTime.title'),
        dataIndex: 'lastUpdateDate',
        width: 160,
      },
      {
        title: () => t('view.system.user.table.operation.title'),
        dataIndex: 'action',
        fixed: 'right',
        width: 120,
      },
    ];

    const disableStateMap = {
      Y: { color: 'error', content: () => t('global.status.disable') },
      N: { color: 'success', content: () => t('global.status.enable') },
    };

    const initValues = () => ({
      userName: '',
      userDescription: '',
      roleId: '',
    });
    const queryParams = reactive(initValues());

    const resetQueryParams = () => Object.assign(queryParams, initValues());

    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });

    const { reload: rawReload, context: state } = useFetchData(findUserByPageCp, fetchDataContext);
    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      state.page = page;
      state.pageSize = pageSize;
    };

    /* 选择 */
    const { rowSelection, clearSelected, customRow } = useTableRowSelection({
      rowKey: 'userId',
      multiple: true,
    });

    const reload = () => {
      clearSelected();
      rawReload();
    };

    // edit
    const editModal = reactive({
      open: false,
      model: null,
    });
    const handleOpenEdit = (record: any) => {
      editModal.open = true;
      editModal.model = {
        ...record,
      };
    };

    //delete
    const handleDelete = (record: any) => {
      state.loading = true;
      deleteUser(record.userId)
        .then(res => {
          state.loading = false;
          if (res.success) {
            reload();
            message.success(res.message);
          } else {
            message.error(res.message);
          }
        })
        .catch(err => {
          state.loading = false;
          message.error(err);
        });
    };

    const handleBatchDelete = () => {
      const keys = rowSelection.selectedRowKeys.value as string[];
      if (!keys.length) {
        message.warning('请选择要删除的行');
        return;
      }
      state.loading = true;
      deleteUser(keys.join(','))
        .then(res => {
          state.loading = false;
          if (res.success) {
            reload();
            message.success(res.message);
          } else {
            message.error(res.message);
          }
        })
        .catch(err => {
          state.loading = false;
          message.error(err);
        });
    };

    const importUrl = ref<string>(`${Service.SYS}/user/import/data`);
    const checkFileUrl = ref<string>(`${Service.SYS}/user/import/user`);
    const downloaTempleteUrl = ref<string>(`${Service.SYS}/user/download/template`);
    const downloadResUrl = ref<string>(`${Service.SYS}/user/download/data`);

    return {
      dayjs,
      t,
      disableStateMap,

      state,
      baseColumns,
      reload,

      queryParams,
      resetQueryParams,
      handleTableChange,

      fetchDataContext,
      // edit
      editModal,
      handleOpenEdit,
      handleDelete,
      importUrl,
      checkFileUrl,
      downloaTempleteUrl,
      downloadResUrl,

      rowSelection,
      customRow,

      handleBatchDelete,
    };
  },
  components: {
    EditModal,
    importExport,
    RolePopupEdit,
    UserTypeTag,
  },
});
</script>
