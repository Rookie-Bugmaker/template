<template>
  <div class="list-title">
    <div class="title">列字段</div>
    <div class="title">标题</div>
  </div>
  <sort-list @move="move">
    <sort-item v-for="item in designerState.currentConfig.options.tableColumns" :key="item.uid">
      <field-selector
        v-model:value="item.dataIndex"
        :data-source-id="dataSourceId"
        :type="type"
        size="small"
        style="width: 50%; margin-right: 5px"
        @select="(_e, option) => handleFieldSelect(item.uid, option)"
      />
      <a-input v-model:value="item.title" size="small" style="width: 50%"></a-input>
      <template #action>
        <a-space>
          <delete-outlined class="action-icon" @click="remove(item.uid)" />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加一项</a-button>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import SortList from '../../common/sort-list.vue';
import SortItem from '../../common/sort-item.vue';
import FieldSelector from '../../common/data-source-options-config/field-selector.vue';
import { generateKey } from '@/views/low-code/design/utils/key';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: '',
  props: {
    dataSourceId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'table',
    },
  },
  setup() {
    const designerState = inject(designerStateInjectKey);

    const move = ({ removedIndex, addedIndex }) => {
      const newList = designerState.currentConfig.options.tableColumns.slice();
      const item = newList[removedIndex];
      newList.splice(removedIndex, 1);
      if (addedIndex === 0) {
        newList.unshift(item);
      } else {
        newList.splice(addedIndex, 0, item);
      }
      designerState.currentConfig.options.tableColumns = newList;
    };

    const add = () => {
      const newItem = {
        dataIndex: '',
        title: '',
        uid: generateKey(),
      };
      designerState.currentConfig.options.tableColumns.push(newItem);
    };

    const edit = (columnUid: string) => {
      designerState.currentConfig = designerState.currentConfig.options.tableColumns.find(
        f => f.uid === columnUid,
      );
    };

    const remove = (columnUid: string) => {
      const removeIndex = designerState.currentConfig.options.tableColumns.findIndex(
        f => f.uid == columnUid,
      );
      designerState.currentConfig.options.tableColumns.splice(removeIndex, 1);
    };

    const handleFieldSelect = (uid, option) => {
      const target = designerState.currentConfig.options.tableColumns.find(f => f.uid == uid);
      if (!target.title) {
        target.title = option.fieldDesc;
      }
    };

    return {
      designerState,
      move,
      add,
      edit,
      remove,
      handleFieldSelect,
    };
  },
  components: {
    SortList,
    SortItem,
    FieldSelector,
  },
});
</script>

<style lang="less" scoped>
.list-title {
  display: flex;
  padding: 5px 45px 8px 37px;
  color: #747a83;
  border-top: 1px solid #efefef;
  .title {
    flex: 1 1 50%;
    font-size: 14px;
    line-height: 20px;
  }
}
.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
