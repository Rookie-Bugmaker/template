<template>
  <page-container>
    <div class="ant-pro-table">
      <div class="ant-pro-table-search">
        <a-form layout="horizontal">
          <a-row :gutter="16" type="flex" justify="start">
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item :label="$t('view.system.low-code-api.form.code.label')">
                <a-input
                  v-model:value="queryParams.apiCode"
                  :placeholder="$t('view.system.low-code-api.form.code.placeholder')"
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
        row-key="apiId"
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
          <yl-button
            act-type="add"
            @click="
              () => {
                editModalState.model = null;
                editModalState.visible = true;
              }
            "
          ></yl-button>
        </template>
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'parameterList'">
            <parameter-list-drawer
              :size="state.tableSize"
              :list="record.parameterList"
            ></parameter-list-drawer>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <yl-button act-type="edit-inline" @click="handleOpenEdit(record)"></yl-button>
            <yl-button act-type="remove-inline" confirm @click="handleDelete(record)"></yl-button>
          </template>
        </template>
      </yl-table>
    </div>

    <edit-modal
      :model="editModalState.model"
      :open="editModalState.visible"
      @cancel="
        () => {
          editModalState.visible = false;
        }
      "
      @ok="
        () => {
          editModalState.visible = false;
          reload();
        }
      "
    />
  </page-container>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { findApiByPage, deleteApi } from '@/api/low-code/low-code-api/index';
import type { Pagination, TableColumn } from '@/typing';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { message } from 'ant-design-vue';
import EditModal from './edit-modal/index.vue';
import ParameterListDrawer from './drawer/index.vue';

const { t } = useI18n();
const baseColumns: TableColumn[] = [
  {
    title: () => t('view.system.low-code-api.table.code.title'),
    dataIndex: 'lowCodeApiCode',
  },
  {
    title: () => t('view.system.low-code-api.table.parameterList.title'),
    dataIndex: 'parameterList',
  },
  {
    title: () => t('view.system.low-code-api.table.operation.title'),
    width: 120,
    fixed: 'right',
    dataIndex: 'action',
  },
];

const initValues = () => ({
  apiCode: '',
  apiType: 0,
});
const queryParams = reactive(initValues());

const resetQueryParams = () => Object.assign(queryParams, initValues());

const fetchDataContext = reactive({
  stripe: false,
  requestParams: queryParams,
});

const { reload, context: state } = useFetchData(findApiByPage, fetchDataContext);
const handleTableChange = ({ current: page, pageSize }: Pagination) => {
  state.page = page;
  state.pageSize = pageSize;
};

// edit
const editModalState = reactive({
  visible: false,
  model: null,
});

const handleOpenEdit = (record: any) => {
  editModalState.visible = true;
  editModalState.model = record;
};

//delete
const handleDelete = (record: any) => {
  state.loading = true;
  deleteApi(record.apiId)
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
</script>

<style lang="less" scoped></style>
