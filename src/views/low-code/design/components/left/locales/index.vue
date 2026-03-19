<template>
  <div class="designer-locales">
    <div class="title">多语言方案管理</div>
    <a-input
      v-model:value.trim="state.searchValue"
      placeholder="搜索语言方案"
      style="width: 100%"
      allow-clear
    >
      <template #suffix>
        <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input>
    <edit-popover :model="null" @ok="handleAdd">
      <a-button type="primary" block style="margin: 8px 0 12px">新增语言方案</a-button>
    </edit-popover>
    <a-table :columns="tableColumns" :data-source="tableData" size="small" style="width: 100%">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <edit-popover :model="record" @ok="handleEdit" :getPopupContainer="getPopupContainer">
              <a>编辑</a>
            </edit-popover>
            <a-popconfirm
              title="是否删除该语言方案？"
              @confirm="handleDelete(record)"
              :getPopupContainer="getPopupContainer"
            >
              <a>删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, inject, computed } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import EditPopover from './edit-popover.vue';

const tableColumns = [
  { title: '中文', dataIndex: 'zh-CN' },
  { title: '英文', dataIndex: 'en-US' },
  { title: '操作', dataIndex: 'action', width: 85 },
];

export default defineComponent({
  name: '',
  setup() {
    const designerState = inject(designerStateInjectKey);
    const state = reactive({ searchValue: '' });
    const tableData = computed(() => {
      const originData = designerState.config.locales;
      const searchValue = state.searchValue;
      if (!searchValue) {
        return originData;
      } else {
        return originData.filter(
          f => f['zh-CN'].includes(searchValue) || f['en-US'].includes(searchValue),
        );
      }
    });
    const handleAdd = data => {
      designerState.config.locales.push(data);
    };
    const handleEdit = data => {
      const item = designerState.config.locales.find(f => f.uid === data.uid);
      if (item) {
        Object.assign(item, data);
      }
    };
    const handleDelete = data => {
      const index = designerState.config.locales.findIndex(f => f.uid === data.uid);
      if (index !== -1) {
        designerState.config.locales.splice(index, 1);
      }
    };
    const getPopupContainer = () => {
      return document.body;
    };
    return {
      tableColumns,
      designerState,
      state,
      tableData,
      handleAdd,
      handleEdit,
      handleDelete,
      getPopupContainer,
    };
  },
  components: {
    EditPopover,
  },
});
</script>

<style lang="less" scoped>
.designer-locales {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  .title {
    height: 40px;
    padding: 0 5px;
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
    text-align: left;
  }
}
</style>
