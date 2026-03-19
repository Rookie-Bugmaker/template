<template>
  <div class="list-title">
    <div class="title">标题</div>
    <!-- <div class="title">数据字段</div> -->
    <div class="title">类型</div>
  </div>
  <sort-list @move="moveColumn">
    <sort-item
      v-for="item in tableConfig.columns.filter(
        f => ![TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY].includes(f.dataIndex),
      )"
      :key="item.uid"
    >
      <a-input v-model:value.trim="item.title" size="small" style="margin-right: 5px"></a-input>
      <!-- <a-input v-model:value="item.dataIndex" size="small"></a-input> -->
      <select-column-widget-type
        v-model:value="item.type"
        size="small"
        @change="v => handleChangeColumnWidgetType(item.uid, v)"
      />
      <template #action>
        <a-space>
          <form-outlined class="action-icon" @click="editColumn(item.uid)" />
          <delete-outlined class="action-icon" @click="removeColumn(item.uid)" />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="addColumn">添加一项</a-button>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue';
import SortList from '../../common/sort-list.vue';
import SortItem from '../../common/sort-item.vue';
import {
  defaultColumnConfig,
  defaultConfig,
  WidgetType,
} from '@/views/low-code/design/typing/index';
import { generateKey } from '@/views/low-code/design/utils/key';
import { cloneDeep } from 'lodash';
import {
  designerStateInjectKey,
  TABLE_COLUMN_ACTION_KEY,
  TABLE_COLUMN_ROW_INDEX_KEY,
} from '@/views/low-code/design/keys';
import SelectColumnWidgetType from './select-column-widget-type.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const tableConfig = computed(() => {
      return props.config;
    });

    const designerState = inject(designerStateInjectKey);

    const moveColumn = ({ removedIndex, addedIndex }) => {
      //如果有第一列ROW_INDEX,removedIndex, addedIndex下标都要+1，因为界面上把第一列ROW_INDEX隐藏了
      const offsetIndex = tableConfig.value.options.needRowIndex ? 1 : 0;
      const ri = removedIndex + offsetIndex;
      const ai = addedIndex + offsetIndex;

      const newColumns = tableConfig.value.columns.slice();
      const columnItem = newColumns[ri];
      newColumns.splice(ri, 1);
      if (addedIndex === 0) {
        newColumns.unshift(columnItem);
      } else {
        newColumns.splice(ai, 0, columnItem);
      }
      tableConfig.value.columns = newColumns;
    };

    const addColumn = () => {
      const newColumn = cloneDeep(defaultColumnConfig);
      const newWidgetConfig = cloneDeep(defaultConfig[WidgetType.Input]);
      delete newWidgetConfig['label'];
      delete newWidgetConfig['layout'];
      Object.assign(newWidgetConfig, newColumn);
      const key = generateKey();
      newWidgetConfig.uid = key;
      newWidgetConfig['key'] = key;
      tableConfig.value.columns.push(newWidgetConfig);
    };

    const editColumn = (columnUid: string) => {
      designerState.currentConfig = props.config.columns.find(f => f.uid === columnUid);
    };

    const removeColumn = (columnUid: string) => {
      const removeIndex = tableConfig.value.columns.findIndex(f => f.uid == columnUid);
      tableConfig.value.columns.splice(removeIndex, 1);
    };

    const handleChangeColumnWidgetType = (uid: string, type: WidgetType) => {
      const targetColumn = tableConfig.value.columns.find(f => f.uid == uid);
      targetColumn.type = type;
      const newOptions = cloneDeep(defaultConfig[type]).options;
      targetColumn.options = newOptions;
    };

    return {
      TABLE_COLUMN_ACTION_KEY,
      TABLE_COLUMN_ROW_INDEX_KEY,
      tableConfig,
      moveColumn,
      addColumn,
      editColumn,
      removeColumn,
      handleChangeColumnWidgetType,
    };
  },
  components: {
    SortList,
    SortItem,
    SelectColumnWidgetType,
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
