<template>
  <a-tab-pane class="designer-tab-pane" force-render v-bind="$attrs" :style="styles">
    <drag-container
      class="tab-pane-drop-area"
      behaviour="move"
      group-name="block"
      :get-child-payload="index => config.children?.[index]"
      @drop="e => handleDrop(e, config.uid)"
      :drop-placeholder="true"
    >
      <slot>
        <div class="tab-pane-drop-area-placeholder">请将块拖入此处</div>
      </slot>
    </drag-container>
  </a-tab-pane>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import type { PropType } from 'vue';
import { Container as DragContainer } from '@/components/draggable';
import { moveBlok } from '@/views/low-code/design/utils/index';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: 'DTabPane',
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
    const handleDrop = (e, dropBlockId) => {
      moveBlok(e, dropBlockId, props.blockMap);
    };

    const designerState = inject(designerStateInjectKey);

    const styles = computed(() => {
      const h = props.config?.options?.height;
      if (h) {
        return { height: `${h}px` };
      }
      return {};
    });

    return { handleDrop, designerState, styles };
  },
  components: {
    DragContainer,
  },
});
</script>

<style lang="less" scoped>
.designer-tab-pane {
  //   z-index: 4;
  .tab-pane-drop-area {
    position: relative;
    min-height: 120px;
    .tab-pane-drop-area-placeholder {
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
