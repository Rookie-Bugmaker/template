<template>
  <!-- <page-container> -->
  <a-card>
    <a-form layout="horizontal">
      <a-row :gutter="16" type="flex" justify="start">
        <a-col>
          <a-form-item>
            <a-button
              type="primary"
              @click="
                () => {
                  editModal.tableId = '';
                  editModal.open = true;
                }
              "
            >
              <template #icon>
                <plus-outlined />
              </template>
            </a-button>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item>
            <a-upload :showUploadList="false" :customRequest="tableUpload">
              <a-button type="primary">
                <upload-outlined></upload-outlined>
                导入
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item>
            <a-button @click="tableDownload">
              导出
              <template #icon>
                <download-outlined />
              </template>
            </a-button>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6">
          <a-form-item>
            <a-input-search
              v-model:value="queryParams.tableFullName"
              placeholder="请输入表名称"
              allow-clear
              @search="() => reload()"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      row-key="tableId"
      :row-selection="rowSelection"
      :size="state.tableSize"
      :loading="state.loading"
      :columns="dynamicColumns"
      :data-source="state.dataSource"
      :pagination="state.pagination"
      :scroll="{ y: 'calc(100vh - 350px)' }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'releaseStatus'">
          <a-tag v-if="releaseFlagMap[text]" :color="releaseFlagMap[text]?.color">
            {{ releaseFlagMap[text]?.content }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="statusFlagMap[text]" :color="statusFlagMap[text]?.color">
            {{ statusFlagMap[text]?.content }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a :title="text" @click="() => editTable(record.tableId)">编辑</a>
            <a-popconfirm title="是否删除该表？" @confirm="handleDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-card>
  <edit-modal
    :tableId="editModal.tableId"
    :open="editModal.open"
    @cancel="
      () => {
        editModal.open = false;
        reload();
      }
    "
    @ok="
      () => {
        editModal.open = false;
        reload();
      }
    "
  />
  <!-- </page-container> -->
</template>

<script lang="ts">
import { Service } from '@/api/typing';
import { defineComponent, reactive, inject, ref, watch } from 'vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { findByPage, deleteById, uploadTable } from '@/api/low-code/data-set/table';
import type { Pagination, TableColumn } from '@/typing';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import { groupIdInjectKey, appIdInjectKey } from '@/layouts/low-code/keys';
import { UploadOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { TableProps } from 'ant-design-vue';
import EditModal from './edit-modal.vue';
import { useDownloadFile } from '@/utils/hooks/useDownloadFile';

export default defineComponent({
  components: {
    EditModal,
    DownloadOutlined,
    UploadOutlined,
    PlusOutlined,
  },
  setup() {
    const groupId = inject(groupIdInjectKey);
    const applicationId = inject(appIdInjectKey);
    const groupName = ref<string>('');

    const baseColumns: TableColumn[] = [
      { title: '表名', dataIndex: 'tableName' },
      { title: '名称', dataIndex: 'tableFullName' },
      { title: '表说明', dataIndex: 'tableDesc' },
      { title: '状态', dataIndex: 'status' },
      { title: '发布状态', dataIndex: 'releaseStatus' },
      { title: '创建人', dataIndex: 'createByName' },
      { title: '创建时间', dataIndex: 'createDate', width: 160 },
      { title: '操作', dataIndex: 'action' },
    ];
    const releaseFlagMap = {
      Y: { color: 'success', content: '已发布' },
      N: { color: 'error', content: '未发布' },
    };
    const statusFlagMap = {
      Y: { color: 'success', content: '有效' },
      N: { color: 'error', content: '无效' },
    };
    const editModal = reactive({
      open: false,
      tableId: '',
    });

    const {
      state: columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(baseColumns, { needRowIndex: false });
    const queryParams = reactive({
      tableFullName: '',
      applicationId: applicationId,
      groupId: groupId.value,
    });
    watch(groupId, () => {
      queryParams.groupId = groupId.value;
      // console.log(groupId.value);
      reload();
    });
    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });
    const { reload, context: state } = useFetchData(findByPage, fetchDataContext, {
      // autoFetch: false,
    });
    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      state.page = page;
      state.pageSize = pageSize;
    };
    // edit
    const editTable = (id: string) => {
      editModal.open = true;

      editModal.tableId = id;
    };
    //delete
    const handleDelete = (record: any) => {
      state.loading = true;
      deleteById(record.tableId)
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
    const selectedRows = ref('');
    // 多选
    const rowSelection: TableProps['rowSelection'] = {
      onChange: (selectedRowKeys: string[]) => {
        selectedRows.value = selectedRowKeys.join(',');
      },
    };
    // 导入
    const tableUpload = option => {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('applicationId', queryParams.applicationId);
      formData.append('groupId', queryParams.groupId);
      uploadTable(formData).then(res => {
        if (res.code === 200) {
          message.success('文件导入成功');
          reload();
        } else {
          message.error(res.message);
        }
      });
    };

    // 导出
    const { download } = useDownloadFile({
      url: `${Service.LOWCODE}/table/export`,
    });
    const tableDownload = () => {
      if (selectedRows.value.length === 0) {
        message.warning('请先勾选需要导出的表结构');
        return;
      }
      download({ tableIds: selectedRows.value });
    };
    return {
      rowSelection,
      tableUpload,
      tableDownload,
      groupName,
      queryParams,
      editModal,
      baseColumns,
      state,
      columnState,
      dynamicColumns,
      dynamicColumnItems,
      reload,
      handleTableChange,
      handleColumnChange,
      handleColumnAllClick,
      reset,
      move,
      editTable,
      handleDelete,
      statusFlagMap,
      releaseFlagMap,
    };
  },
});
</script>

<style scoped></style>
