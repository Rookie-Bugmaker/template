<template>
  <block-wrapper :is-selected="designerState.currentConfig?.uid === config.uid">
    <a-tabs
      v-if="config.children?.length"
      class="designer-tabs"
      :size="config?.options.size"
      :type="config?.options.type"
      :centered="config?.options.centered"
      :tabBarGutter="config?.options.tabBarGutter"
      :tabPosition="config?.options.tabPosition"
    >
      <slot />
    </a-tabs>
    <a-tabs
      v-else
      class="designer-tabs"
      :size="config?.options.size"
      :type="config?.options.type"
      :centered="config?.options.centered"
      :tabBarGutter="config?.options.tabBarGutter"
      :tabPosition="config?.options.tabPosition"
    >
      <a-tab-pane tab="请添加选项卡">请添加选项卡</a-tab-pane>
    </a-tabs>
  </block-wrapper>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import type { PropType } from 'vue';
import BlockWrapper from '../../common/block-wrapper.vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
  },
  setup(props) {
    const designerState = inject(designerStateInjectKey);

    const activeKey = ref(props.config.children?.[0]?.uid);

    return {
      designerState,
      activeKey,
    };
  },
  components: {
    BlockWrapper,
  },
});
</script>

<style lang="less" scoped>
.designer-tabs {
  z-index: 4;
  background: #fff;
}
</style>
