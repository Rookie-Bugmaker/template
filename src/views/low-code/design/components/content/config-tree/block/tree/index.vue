<template>
  <block-wrapper :is-selected="designerState.currentConfig?.uid === config.uid">
    <a-input
      v-if="config?.options.showSearch"
      style="margin-bottom: 8px"
      :placeholder="config?.options.searchPlaceholder"
      allow-clear
      readonly
    >
      <template #suffix>
        <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input>
    <a-tree
      :tree-data="treeData"
      :title="config?.options.title"
      :disabled="config?.options.disabled"
      :autoExpandParent="config?.options.autoExpandParent"
      :defaultExpandAll="config?.options.defaultExpandAll"
      :showLine="config?.options.showLine"
      :showIcon="config?.options.showIcon"
      :fieldNames="{
        key: 'key',
        title: 'title',
        children: 'children',
      }"
    ></a-tree>
  </block-wrapper>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import BlockWrapper from '../../common/block-wrapper.vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const designerState = inject(designerStateInjectKey);

    const treeData = ref([
      {
        key: '1',
        title: '节点1',
        children: [
          {
            key: '1-1',
            title: '子节点1-1',
          },
          {
            key: '1-2',
            title: '子节点1-2',
          },
        ],
      },
      {
        key: '2',
        title: '节点2',
      },
      {
        key: '3',
        title: '节点3',
        children: [
          {
            key: '3-1',
            title: '子节点3-1',
          },
        ],
      },
    ]);

    return {
      designerState,
      treeData,
    };
  },
  components: {
    BlockWrapper,
  },
});
</script>

<style lang="less" scoped>
.designer-card {
  z-index: 4;
  .card-drop-area {
    position: relative;
    min-height: 120px;
    .card-drop-area-placeholder {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #f1f1f1;
    }
  }
}
</style>
