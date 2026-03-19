<template>
  <div class="list-title">
    <div class="title">值</div>
    <div class="title">标签</div>
    <div class="title" v-if="showDescription">提示</div>
  </div>
  <sort-list @move="move">
    <sort-item
      v-for="item in designerState.currentConfig.options.options.filter(
        f => f.dataIndex !== TABLE_COLUMN_ACTION_KEY,
      )"
      :key="item.uid"
    >
      <a-input-number
        v-if="valueType === 'number'"
        v-model:value="item.value"
        size="small"
      ></a-input-number>
      <a-input v-else v-model:value="item.value" size="small"></a-input>
      <a-input v-model:value="item.label" size="small" style="margin-right: 5px"></a-input>
      <a-input
        v-if="showDescription"
        v-model:value="item.desc"
        size="small"
        style="margin-right: 5px"
      ></a-input>
      <template #action>
        <a-space>
          <!-- <form-outlined class="action-icon" @click="edit(item.uid)" /> -->
          <delete-outlined class="action-icon" @click="remove(item.uid)" />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加一项</a-button>
</template>

<script lang="ts">
import { defineComponent, inject, watch } from 'vue';
import SortList from './sort-list.vue';
import SortItem from './sort-item.vue';
import { generateKey } from '@/views/low-code/design/utils/key';
import { designerStateInjectKey, TABLE_COLUMN_ACTION_KEY } from '@/views/low-code/design/keys';

export default defineComponent({
  name: 'FixedOptionsList',
  props: {
    valueType: {
      type: String,
      default: 'string',
    },
    showDescription: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const designerState = inject(designerStateInjectKey);

    const move = ({ removedIndex, addedIndex }) => {
      const newOptions = designerState.currentConfig.options.options.slice();
      const optionItem = newOptions[removedIndex];
      newOptions.splice(removedIndex, 1);
      if (addedIndex === 0) {
        newOptions.unshift(optionItem);
      } else {
        newOptions.splice(addedIndex, 0, optionItem);
      }
      designerState.currentConfig.options.options = newOptions;
    };

    const add = () => {
      const newItem = {
        label: '选项',
        value: '1',
        uid: generateKey(),
      };
      designerState.currentConfig.options.options.push(newItem);
    };

    const edit = (columnUid: string) => {
      designerState.currentConfig = designerState.currentConfig.options.options.find(
        f => f.uid === columnUid,
      );
    };

    const remove = (columnUid: string) => {
      const removeIndex = designerState.currentConfig.options.options.findIndex(
        f => f.uid == columnUid,
      );
      designerState.currentConfig.options.options.splice(removeIndex, 1);
    };

    watch(
      () => props.valueType,
      (n, o) => {
        if (n && n !== o) {
          designerState?.currentConfig?.options?.options?.forEach(e => {
            e.value = null;
          });
        }
      },
    );

    return {
      TABLE_COLUMN_ACTION_KEY,
      designerState,
      move,
      add,
      edit,
      remove,
    };
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
    flex: 1 1 33%;
    font-size: 14px;
    line-height: 20px;
  }
}
.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
