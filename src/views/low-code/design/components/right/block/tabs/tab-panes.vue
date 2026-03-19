<template>
  <div class="list-title">
    <div class="title">页签</div>
    <div class="title">标题函数</div>
    <div class="title" style="padding-left: 10px">高度</div>
  </div>
  <sort-list @move="move">
    <sort-item v-for="item in tabsConfig.children" :key="item.uid">
      <a-input
        v-model:value="item.options.title"
        size="small"
        style="margin-right: 5px; width: 33%"
      ></a-input>
      <func-input
        v-model:value="item.options.titleFunc"
        size="small"
        title="函数"
        argsTips="title, state"
        placeholder="请输入函数体，页签会作为默认值显示，函数体返回的内容会动态替换页签文本内容"
        style="margin-right: 5px; width: 30%"
      />
      <a-input-number
        v-model:value="item.options.height"
        size="small"
        :min="0"
        style="width: 30%"
      ></a-input-number>
      <template #action>
        <a-space>
          <delete-outlined
            v-if="item.mainType !== MainType.TableCreate"
            class="action-icon"
            @click="remove(item.uid)"
          />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加页签</a-button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import SortList from '../../common/sort-list.vue';
import SortItem from '../../common/sort-item.vue';
import FuncInput from '../../common/func-input.vue';
import { MainType, tabPaneConfig } from '@/views/low-code/design/typing/index';
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
    const tabsConfig = computed(() => {
      return props.config;
    });

    const move = ({ removedIndex, addedIndex }) => {
      const copyItems = tabsConfig.value.children.slice();
      const moveItem = copyItems[removedIndex];
      copyItems.splice(removedIndex, 1);
      if (addedIndex === 0) {
        copyItems.unshift(moveItem);
      } else {
        copyItems.splice(addedIndex, 0, moveItem);
      }
      tabsConfig.value.children = copyItems;
    };

    const add = () => {
      const newItem = cloneDeep(tabPaneConfig);
      const key = generateKey();
      newItem['uid'] = key;
      tabsConfig.value.children.push(newItem);
    };

    const remove = (uid: string) => {
      const removeIndex = tabsConfig.value.children.findIndex(f => f.uid == uid);
      tabsConfig.value.children.splice(removeIndex, 1);
    };

    return { MainType, tabsConfig, move, add, remove };
  },
  components: {
    SortList,
    SortItem,
    FuncInput,
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
    flex: 1 1 30%;
    font-size: 14px;
    line-height: 20px;
  }
}
.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
