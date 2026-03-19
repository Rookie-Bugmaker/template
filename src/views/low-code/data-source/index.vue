<template>
  <page-container>
    <div class="ant-pro-table">
      <div class="ant-pro-table-search">
        <a-form layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="16" type="flex" justify="start">
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="数据源编码">
                <a-input
                  v-model:value="queryParams.dataSourceCode"
                  placeholder="请输入数据源编码"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="数据库连接">
                <a-input
                  v-model:value="queryParams.dbUrl"
                  placeholder="请输入数据库连接"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="驱动">
                <a-input
                  v-model:value="queryParams.driverClassName"
                  placeholder="请输入驱动"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="描述">
                <a-input
                  v-model:value="queryParams.dataSourceDesc"
                  placeholder="请输入描述"
                  allow-clear
                />
              </a-form-item>
            </a-col>
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
        row-key="id"
        :size="state.tableSize"
        :loading="state.loading"
        :columns="baseColumns"
        :data-source="state.dataSource"
        :pagination="state.pagination"
        :needRowIndex="true"
        @change="handleTableChange"
      >
        <template #extraLeft>
          <yl-button
            act-type="add"
            @click="
              () => {
                editModal.model = null;
                editModal.open = true;
              }
            "
          ></yl-button>
        </template>
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" @click="availabilityTest(record)">测试连接</a-button>
            <yl-button act-type="edit-inline" @click="handleOpenEdit(record)"></yl-button>
            <yl-button act-type="remove-inline" confirm @click="handleDelete(record)"></yl-button>
          </template>
        </template>
      </yl-table>
    </div>

    <edit-modal
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
      @test="availabilityTest"
    />
  </page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
// 查询和删除
import {
  findDataSourceByPage,
  deleteDataSource,
  dataSourceAvailabilityTest,
} from '@/api/low-code/data-source/index';
import type { Pagination, TableColumn } from '@/typing';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import { message, Modal } from 'ant-design-vue';

import EditModal from './edit-modal.vue';
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
export default defineComponent({
  name: 'ApiList',
  setup() {
    // 表格列
    const baseColumns: TableColumn[] = [
      {
        title: '数据源编码',
        dataIndex: 'dataSourceCode',
        width: 70,
      },
      {
        title: '数据库连接',
        dataIndex: 'dbUrl',
        width: 220,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: 70,
      },
      {
        title: '驱动',
        dataIndex: 'driverClassName',
      },
      {
        title: '描述',
        dataIndex: 'dataSourceDesc',
      },
      {
        title: '操作',
        fixed: 'right',
        dataIndex: 'action',
        width: 150,
      },
    ];

    const typeMap = ref<{ [key: string]: string }>({});
    // 查询字段
    const initValues = () => ({
      dataSourceCode: '',
      dbUrl: '',
      driverClassName: '',
      dataSourceDesc: '',
    });
    const queryParams = reactive(initValues());
    // 重置查询字段
    const resetQueryParams = () => Object.assign(queryParams, initValues());
    // 获取数据上下文
    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });

    const {
      state: columnState,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(baseColumns, { needRowIndex: true });

    // 分页+查询
    const { reload, context: state } = useFetchData(findDataSourceByPage, fetchDataContext);

    // 换页
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

    //delete
    const handleDelete = (record: any) => {
      state.loading = true;
      deleteDataSource(record.dataSourceId)
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

    // 可用性测试
    const availabilityTest = (record: any) => {
      const { dbUrl, username, password, driverClassName } = record;
      dataSourceAvailabilityTest({
        dbUrl,
        username,
        password,
        driverClassName,
      })
        .then(res => {
          if (res.success) {
            message.success(res.message);
          } else {
            Modal.error({
              title: '错误',
              content: res.message,
            });
          }
        })
        .catch(err => {
          Modal.error({
            title: '错误',
            content: err,
          });
        });
    };

    return {
      typeMap,

      state,
      columnState,
      dynamicColumnItems,
      reload,
      baseColumns,

      queryParams,
      resetQueryParams,
      handleTableChange,

      handleColumnChange,
      handleColumnAllClick,
      reset,
      move,
      fetchDataContext,
      // edit
      editModal,
      handleOpenEdit,
      handleDelete,
      availabilityTest,
      ...formLayout,
    };
  },
  components: {
    EditModal,
  },
});
</script>
