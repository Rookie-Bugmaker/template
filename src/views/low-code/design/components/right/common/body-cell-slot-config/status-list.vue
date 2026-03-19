<template>
  <a-form-item label="值为数字（默认为字符）">
    <a-switch
      v-model:checked="designerState.currentConfig.bodyCellSlot.options.presets.statusValueType"
      checked-children="是"
      un-checked-children="否"
      checked-value="number"
      un-checked-value="string"
      size="small"
    />
  </a-form-item>
  <div class="list-title">
    <div class="title">标签</div>
    <div class="title">值</div>
    <div class="title">颜色</div>
  </div>
  <sort-list @move="move">
    <a-alert
      v-if="designerState.currentConfig.bodyCellSlot.options.presets.statusList.length === 0"
      message="不添加状态列表，则使用默认状态列表（Y/有效，N/无效）"
      type="info"
      show-icon
      style="margin-bottom: 10px"
    />
    <sort-item
      v-for="item in designerState.currentConfig.bodyCellSlot.options.presets.statusList"
      :key="item.uid"
    >
      <a-input v-model:value="item.text" size="small" class="input-item"></a-input>
      <a-input-number
        v-if="designerState.currentConfig.bodyCellSlot.options.presets.statusValueType === 'number'"
        v-model:value="item.value"
        size="small"
        class="input-item"
      ></a-input-number>
      <a-input v-else v-model:value="item.value" size="small" class="input-item"></a-input>
      <a-select
        v-model:value="item.color"
        size="small"
        :dropdown-match-select-width="false"
        :get-popup-container="getPopupContainer"
        class="input-item"
      >
        <a-select-option v-for="item in colors" :key="item.value" :value="item.value">
          <a-badge :color="item.value" :text="item.text" />
        </a-select-option>
      </a-select>
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
import SortList from '../sort-list.vue';
import SortItem from '../sort-item.vue';
import { generateKey } from '@/views/low-code/design/utils/key';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: '',
  setup() {
    const designerState = inject(designerStateInjectKey);

    const move = ({ removedIndex, addedIndex }) => {
      const newOptions =
        designerState.currentConfig.bodyCellSlot.options.presets.statusList.slice();
      const optionItem = newOptions[removedIndex];
      newOptions.splice(removedIndex, 1);
      if (addedIndex === 0) {
        newOptions.unshift(optionItem);
      } else {
        newOptions.splice(addedIndex, 0, optionItem);
      }
      designerState.currentConfig.bodyCellSlot.options.presets.statusList = newOptions;
    };

    const add = () => {
      const newItem = {
        text: '状态',
        value: '1',
        uid: generateKey(),
      };
      designerState.currentConfig.bodyCellSlot.options.presets.statusList.push(newItem);
    };

    const remove = (columnUid: string) => {
      const removeIndex =
        designerState.currentConfig.bodyCellSlot.options.presets.statusList.findIndex(
          f => f.uid == columnUid,
        );
      designerState.currentConfig.bodyCellSlot.options.presets.statusList.splice(removeIndex, 1);
    };

    const getPopupContainer = () => document.body;

    const colors = [
      { value: 'pink', text: '粉色' },
      { value: 'magenta', text: '洋红色' },
      { value: 'red', text: '红色' },
      { value: 'volcano', text: '火山色' },
      { value: 'orange', text: '橙色' },
      { value: 'gold', text: '金色' },
      { value: 'lime', text: '绿黄色' },
      { value: 'green', text: '绿色' },
      { value: 'cyan', text: '青色' },
      { value: 'blue', text: '蓝色' },
      { value: 'geekblue', text: '极客蓝' },
      { value: 'purple', text: '紫色' },
    ];

    return {
      designerState,
      move,
      add,
      remove,
      getPopupContainer,
      colors,
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
    flex: 0 0 38%;
    font-size: 14px;
    line-height: 20px;
  }
}

.input-item {
  flex: 0 0 30%;
}

.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
