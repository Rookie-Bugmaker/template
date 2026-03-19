<template>
  <div class="designer-conditions">
    <div class="title">条件列表</div>
    <a-input
      v-model:value.trim="searchValue"
      placeholder="搜索条件"
      style="width: 100%"
      allow-clear
    >
      <template #suffix>
        <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input>

    <a-button type="primary" block @click="add" style="margin: 8px 0">新增条件</a-button>

    <a-list
      item-layout="horizontal"
      size="small"
      :data-source="conditions"
      style="width: 100%; height: calc(100vh - 180px)"
    >
      <template #renderItem="{ item }">
        <a-list-item
          :style="{ cursor: 'pointer', 'border-radius': '6px' }"
          :class="{ 'is-active': editingKey === item.uid }"
          @click="edit(item.uid)"
        >
          <a-list-item-meta>
            <template #title>
              <div style="display: flex; justify-content: space-between">
                <span>{{ item.name }}</span>
                <delete-outlined @click.stop="remove(item.uid)" />
              </div>
            </template>
            <template #description>
              <ellipsis tipType="title" :content="item.desc"></ellipsis>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
  <!-- <edit-drawer :open="!!editingKey" @update:open="() => (editingKey = null)" :uid="editingKey" /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useConditions from '@/views/low-code/design/hooks/useConditions';
import Ellipsis from '@/components/ellipsis/index.vue';
// import EditDrawer from './edit-drawer.vue';

export default defineComponent({
  name: '',
  setup() {
    const { conditions, editingKey, searchValue, add, edit, remove } = useConditions();
    return {
      conditions,
      editingKey,
      searchValue,
      add,
      edit,
      remove,
    };
  },
  components: {
    Ellipsis,
    // EditDrawer,
  },
});
</script>

<style lang="less" scoped>
.designer-conditions {
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
.is-active {
  background-color: #165eff;
  :deep(.ant-list-item-meta-title) {
    color: #fff !important;
  }
  :deep(.ant-list-item-meta-description) {
    color: rgba(255, 255, 255, 0.75) !important;
  }
}
</style>
