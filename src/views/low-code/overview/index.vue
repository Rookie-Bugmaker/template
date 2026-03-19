<template>
  <yl-table
    row-key="id"
    :loading="loading"
    :columns="baseColumns"
    :data-source="list"
    :pagination="false"
    :scroll="{ x: 'max-content' }"
    table-layout="auto"
    @reload="reload"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'icon'">
        <icon :name="text" :size="18" />
      </template>
      <template v-if="column.dataIndex === 'type'">
        <status-tag
          :value="text"
          :status-list="[
            { value: 'application', text: '应用', color: 'orange' },
            { value: 'group', text: '分组', color: 'blue' },
            { value: 'page', text: '页面', color: 'cyan' },
          ]"
        />
      </template>
      <template v-else-if="column.dataIndex === 'action' && record['type'] == 'page'">
        <a-space>
          <a-button size="small" type="link" @click="handleCreate(record)">创建</a-button>
        </a-space>
      </template>
    </template>
  </yl-table>
</template>

<script lang="ts" setup>
import { useFetchList } from '@/utils/hooks/useFetchList';
import { findTree } from '@/api/low-code/overview/index';
import type { TableColumn } from '@/typing';
import StatusTag from '@/components/status-tag/index.vue';
import { findTreeItemPath } from '@/utils/tree-util';

const baseColumns: TableColumn[] = [
  {
    title: '图标',
    dataIndex: 'icon',
    align: 'right',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '编码',
    dataIndex: 'code',
  },
  {
    title: '描述',
    dataIndex: 'desc',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
];

const { list, loading, reload } = useFetchList(findTree);

const handleCreate = record => {
  const pageId = record.id;
  const result = findTreeItemPath(pageId, list.value || []);
  if (result?.length) {
    const applicationId = result.find(f => f.type == 'application')?.id;
    const groupId = result.find(f => f.type == 'group')?.id;
    toLowCode(applicationId, groupId, pageId);
  }
};

const toLowCode = (applicationId: string, groupId: string, pageId: string) => {
  window.open(`/low-code-application/${applicationId}?groupId=${groupId}&pageId=${pageId}`);
};
</script>

<style lang="less" scoped></style>
