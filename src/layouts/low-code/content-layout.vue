<template>
  <a-tabs defaultActiveKey="page" size="small" style="margin: 10px">
    <a-tab-pane key="page" tab="页面管理">
      <page-manager></page-manager>
    </a-tab-pane>
    <a-tab-pane key="dataset" tab="数据集管理">
      <a-tabs size="small">
        <a-tab-pane key="table" tab="表结构定义">
          <data-set-manager-filed></data-set-manager-filed>
        </a-tab-pane>
        <a-tab-pane key="sql" tab="自定义SQL">
          <data-set-manager-sql></data-set-manager-sql>
        </a-tab-pane>
      </a-tabs>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
/* import PageManager from '@/views/low-code/pages/index.vue';
import DataSetManagerFiled from '@/views/low-code/data-set/table/index.vue';
import DataSetManagerSql from '@/views/low-code/data-set/sql/index.vue'; */

const PageManager = defineAsyncComponent(
  () => import(/* webpackChunkName: "low-code-pages" */ '../../views/low-code/pages/index.vue'),
);
const DataSetManagerFiled = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "low-code-table" */ '../../views/low-code/data-set/table/index.vue'
    ),
);
const DataSetManagerSql = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "low-code-sql" */ '../../views/low-code/data-set/sql/index.vue'),
);

export default defineComponent({
  components: {
    PageManager,
    DataSetManagerFiled,
    DataSetManagerSql,
  },
});
</script>
<style scoped>
.ant-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
  padding: 8px 10px;
  background-color: #fff;
}
.ant-tabs :deep(.ant-tabs-content-holder) {
  margin-top: 10px;
}
</style>
