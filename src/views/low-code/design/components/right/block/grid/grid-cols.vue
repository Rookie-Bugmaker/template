<template>
  <div class="list-title">
    <div class="title">列宽</div>
    <div class="title">左间隔</div>
    <div class="title">左移动</div>
    <div class="title">右移动</div>
  </div>
  <sort-list @move="move">
    <sort-item v-for="item in gridConfig.children" :key="item.uid">
      <a-input-number
        v-model:value="item.options.span"
        size="small"
        :min="1"
        :max="24"
        style="width: 23%"
      ></a-input-number>
      <a-input-number
        v-model:value="item.options.offset"
        size="small"
        :min="0"
        style="width: 23%"
      ></a-input-number>
      <a-input-number
        v-model:value="item.options.pull"
        size="small"
        :min="0"
        style="width: 23%"
      ></a-input-number>
      <a-input-number
        v-model:value="item.options.push"
        size="small"
        :min="0"
        style="width: 23%"
      ></a-input-number>
      <template #action>
        <a-space>
          <delete-outlined class="action-icon" @click="remove(item.uid)" />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加列</a-button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SortList from '../../common/sort-list.vue';
import SortItem from '../../common/sort-item.vue';
import { MainType, gridColConfig } from '@/views/low-code/design/typing/index';
import { generateKey } from '@/views/low-code/design/utils/key';
import { cloneDeep } from 'lodash';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const gridConfig = computed(() => {
      return props.config;
    });

    const move = ({ removedIndex, addedIndex }) => {
      const copyItems = gridConfig.value.children.slice();
      const moveItem = copyItems[removedIndex];
      copyItems.splice(removedIndex, 1);
      if (addedIndex === 0) {
        copyItems.unshift(moveItem);
      } else {
        copyItems.splice(addedIndex, 0, moveItem);
      }
      gridConfig.value.children = copyItems;
    };

    const add = () => {
      const newItem = cloneDeep(gridColConfig);
      const key = generateKey();
      newItem['uid'] = key;
      gridConfig.value.children.push(newItem);
    };

    const remove = (uid: string) => {
      const removeIndex = gridConfig.value.children.findIndex(f => f.uid == uid);
      gridConfig.value.children.splice(removeIndex, 1);
    };

    return { MainType, gridConfig, move, add, remove };
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
    flex: 1 1 23%;
    font-size: 14px;
    line-height: 20px;
  }
}
.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
