<template>
  <div class="items">
    <group-wrapper title="块">
      <group-item
        v-for="item in blockConfigs"
        :key="item.type"
        :config="item"
        group-name="block"
      ></group-item>
    </group-wrapper>
    <group-wrapper title="常用控件">
      <group-item
        v-for="item in itemConfigs.filter(f => f.group == WidgetGroupType.Common)"
        :key="item.type"
        :config="item"
        group-name="field"
      ></group-item>
    </group-wrapper>
    <group-wrapper title="高级控件">
      <group-item
        v-for="item in itemConfigs.filter(f => f.group == WidgetGroupType.Advanced)"
        :key="item.type"
        :config="item"
        group-name="field"
      ></group-item>
    </group-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GroupWrapper from './group-wrapper.vue';
import GroupItem from './group-item.vue';
import {
  WidgetType,
  WidgetGroupType,
  BlockType,
  defaultConfig,
} from '@/views/low-code/design/typing/index';

export default defineComponent({
  name: 'Items',
  setup() {
    const itemConfigs = Object.values(WidgetType)
      .filter(f => defaultConfig[f])
      .map(m => {
        return defaultConfig[m];
      });

    const blockConfigs = Object.values(BlockType)
      .filter(f => defaultConfig[f] && f !== BlockType.TabPane && f !== BlockType.GridCol)
      .map(m => {
        return defaultConfig[m];
      });

    return { WidgetType, WidgetGroupType, BlockType, defaultConfig, itemConfigs, blockConfigs };
  },
  components: {
    GroupWrapper,
    GroupItem,
  },
});
</script>

<style lang="less" scoped>
.items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}
</style>
