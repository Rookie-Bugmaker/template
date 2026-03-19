<template>
  <div class="list-title">
    <div class="title">操作按钮</div>
  </div>
  <sort-list @move="move">
    <sort-item v-for="item in tableConfig.action.column.items" :key="item.uid">
      <!-- <a-input v-model:value="item.text" size="small" style="margin-right: 5px"></a-input> -->
      <span style="margin-right: 5px">{{ item.options.text }}</span>
      <template #action>
        <a-space>
          <form-outlined
            v-if="item.mainType !== MainType.TableEdit && item.mainType !== MainType.TableRemove"
            class="action-icon"
            @click="edit(item.uid)"
          />
          <delete-outlined
            v-if="item.mainType !== MainType.TableEdit && item.mainType !== MainType.TableRemove"
            class="action-icon"
            @click="remove(item.uid)"
          />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加一项</a-button>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue';
import SortList from '../../common/sort-list.vue';
import SortItem from '../../common/sort-item.vue';
import { MainType, defaultColumnActionItemConfig } from '@/views/low-code/design/typing/index';
import { generateKey } from '@/views/low-code/design/utils/key';
import { cloneDeep } from 'lodash';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

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

    const move = ({ removedIndex, addedIndex }) => {
      const newItems = tableConfig.value.action.column.items.slice();
      const actionItem = newItems[removedIndex];
      newItems.splice(removedIndex, 1);
      if (addedIndex === 0) {
        newItems.unshift(actionItem);
      } else {
        newItems.splice(addedIndex, 0, actionItem);
      }
      tableConfig.value.action.column.items = newItems;
    };

    const add = () => {
      const newItem = cloneDeep(defaultColumnActionItemConfig);
      const key = generateKey();
      newItem.uid = key;
      tableConfig.value.action.column.items.push(newItem);
    };

    const edit = (uid: string) => {
      designerState.currentConfig = tableConfig.value.action.column.items.find(f => f.uid === uid);
    };

    const remove = (uid: string) => {
      const removeIndex = tableConfig.value.action.column.items.findIndex(f => f.uid == uid);
      tableConfig.value.action.column.items.splice(removeIndex, 1);
    };

    return { MainType, tableConfig, move, add, edit, remove };
  },
  components: {
    SortList,
    SortItem,
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
