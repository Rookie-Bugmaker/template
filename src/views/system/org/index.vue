<template>
  <page-container>
    <div class="ant-pro-table">
      <div class="ant-pro-table-search">
        <a-form layout="horizontal">
          <a-row :gutter="16" type="flex" justify="start">
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item :label="t('view.system.org.form.orgCode.label')">
                <a-input
                  v-model:value="queryParams.orgCode"
                  :placeholder="t('view.system.org.form.orgCode.placeholder')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item :label="t('view.system.org.form.orgName.label')">
                <a-input
                  v-model:value="queryParams.orgName"
                  :placeholder="t('view.system.org.form.orgName.placeholder')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <!-- <a-col :xs="24" :sm="24" :md="8">
              <a-form-item>
                <a-button type="primary" @click="reload">
                  <search-outlined />
                  {{ t('form.button.search') }}
                </a-button>
              </a-form-item>
            </a-col> -->
            <a-col flex="auto">
              <a-form-item :wrapper-col="24" class="search-form-query-item">
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
        row-key="orgId"
        :size="state.tableSize"
        :loading="state.loading"
        :columns="baseColumns"
        :need-row-index="true"
        :data-source="state.dataSource"
        :pagination="state.pagination"
        @change="handleTableChange"
        @reload="reload"
      >
        <template #extraLeft>
          <a-space align="center">
            <yl-button
              act-type="add"
              @click="
                () => {
                  editModal.model = null;
                  editModal.open = true;
                }
              "
            ></yl-button>
          </a-space>
        </template>
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.dataIndex === 'orgStatus'">
            <a-tag v-if="orgStatusMap[text]" :color="orgStatusMap[text]?.color">
              {{ orgStatusMap[text].content() }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <!-- <a :title="text" @click="() => handleOpenEdit(record)">
                  {{ t('global.operation.edit') }}
                </a> -->
              <yl-button act-type="edit-inline" @click="handleOpenEdit(record)"></yl-button>
            </a-space>
          </template>
        </template>
      </yl-table>
    </div>

    <edit-modal
      v-if="editModal.open"
      :open="editModal.open"
      :model="editModal.model"
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
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { findOrgByPage } from '@/api/system/org/index';
import type { Pagination, TableColumn } from '@/typing';
import { useFetchData } from '@/utils/hooks/useFetchData';

import EditModal from './edit-modal.vue';

export default defineComponent({
  name: 'ApiList',
  setup() {
    const { t } = useI18n();
    const baseColumns: TableColumn[] = [
      {
        title: () => t('view.system.org.table.orgCode.title'),
        dataIndex: 'orgCode',
      },
      {
        title: () => t('view.system.org.table.orgName.title'),
        dataIndex: 'orgName',
      },
      {
        title: () => t('view.system.org.table.orgLocation.title'),
        dataIndex: 'orgLocation',
      },
      {
        title: () => t('view.system.org.table.orgStatus.title'),
        dataIndex: 'orgStatus',
      },
      {
        title: () => t('view.system.org.table.createDate.title'),
        dataIndex: 'createDate',
      },
      {
        title: () => t('view.system.org.table.lastUpdateDate.title'),
        dataIndex: 'lastUpdateDate',
      },
      {
        width: 80,
        title: () => t('view.system.org.table.action.title'),
        dataIndex: 'action',
        fixed: 'right',
      },
    ];

    const orgStatusMap = {
      Y: { color: 'green', content: () => t('view.system.org.orgStatusMap.valid.content') },
      N: { color: 'orange', content: () => t('view.system.org.orgStatusMap.invalid.content') },
    };

    const initValues = () => ({
      orgCode: '',
      orgName: '',
    });
    const queryParams = reactive(initValues());

    const resetQueryParams = () => Object.assign(queryParams, initValues());

    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });

    const { reload, context: state } = useFetchData(findOrgByPage, fetchDataContext);
    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      state.page = page;
      state.pageSize = pageSize;
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

    return {
      t,
      orgStatusMap,

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
    };
  },
  components: {
    EditModal,
  },
});
</script>
