<template>
  <div class="list-title">
    <div class="title">源字段</div>
    <!-- <div class="title">填充块</div> -->
    <div class="title">填充字段</div>
  </div>
  <sort-list @move="move">
    <sort-item v-for="item in designerState.currentConfig.options.brings" :key="item.uid">
      <field-selector
        v-model:value="item.sourceField"
        :type="designerState.currentConfig.options.dataSource.type"
        :dataSourceId="designerState.currentConfig.options.dataSource.objectId"
        :size="size"
        style="width: 100px"
      />
      <!-- <a-input v-model:value="item.targetBlock" style="margin-right: 5px" :size="size"></a-input> -->
      <a-select
        v-model:value="item.targetWidget"
        :dropdown-match-select-width="false"
        :get-popup-container="getPopupContainer"
        :size="size"
        style="width: 100px"
      >
        <a-select-option
          v-for="item in (currentBlock?.fieldList || currentBlock?.columns || []).filter(
            f =>
              f.uid !== designerState.currentConfig.uid &&
              ![TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY].includes(f.key),
          )"
          :key="item.uid"
          :value="item.uid"
        >
          <span>{{ item?.label || item?.title }}</span>
        </a-select-option>
      </a-select>
      <template #action>
        <delete-outlined class="action-icon" @click="remove(item.uid)" />
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加一项</a-button>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import SortList from './sort-list.vue';
import SortItem from './sort-item.vue';
import { generateKey } from '@/views/low-code/design/utils/key';
import {
  designerStateInjectKey,
  TABLE_COLUMN_ACTION_KEY,
  TABLE_COLUMN_ROW_INDEX_KEY,
} from '@/views/low-code/design/keys';
import { getFieldBlock } from '@/views/low-code/design/utils/move';

import FieldSelector from './data-source-options-config/field-selector.vue';

export default defineComponent({
  name: '',
  props: {
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
  },
  setup() {
    const designerState = inject(designerStateInjectKey);

    const move = ({ removedIndex, addedIndex }) => {
      const newItems = designerState.currentConfig.options.brings.slice();
      const actionItem = newItems[removedIndex];
      newItems.splice(removedIndex, 1);
      if (addedIndex === 0) {
        newItems.unshift(actionItem);
      } else {
        newItems.splice(addedIndex, 0, actionItem);
      }
      designerState.currentConfig.options.brings = newItems;
    };

    const currentBlock = getFieldBlock(
      designerState.currentConfig.uid,
      designerState.currentBlockMap,
    );

    const add = () => {
      const newItem = () => {
        return {
          uid: generateKey(),
          sourceField: null, //当前控件带出的dataItem中，选择哪个字段值作为带出字段
          targetBlock: currentBlock.uid, //带入的块ID, 默认只能带出到当前块，先不给用户设置带到其他块（留个后门，万一要带到其他块，就可以直接改）
          targetWidget: null, //带入的块里面的控件ID
        };
      };

      //版本差异,缺少属性,旧版本没有brings这个属性
      if (!designerState.currentConfig.options?.brings?.length) {
        designerState.currentConfig.options.brings = [];
      }
      designerState.currentConfig.options.brings.push(newItem());
    };

    const remove = (uid: string) => {
      const removeIndex = designerState.currentConfig.options.brings.findIndex(f => f.uid == uid);
      designerState.currentConfig.options.brings.splice(removeIndex, 1);
    };

    const getPopupContainer = () => document.body;

    return {
      TABLE_COLUMN_ACTION_KEY,
      TABLE_COLUMN_ROW_INDEX_KEY,
      designerState,
      currentBlock,
      move,
      add,
      remove,
      getPopupContainer,
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
  padding: 5px 25px 8px 37px;
  color: #747a83;
  border-top: 1px solid #efefef;
  .title {
    flex: 1 1 33.3%;
    font-size: 14px;
    line-height: 20px;
  }
}
.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
