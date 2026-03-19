<template>
  <a-col
    class="designer-grid-col"
    v-bind="$attrs"
    :span="config.options.span"
    :offset="config.options.offset"
    :pull="config.options.pull"
    :push="config.options.push"
  >
    <drag-container
      class="grid-col-drop-area"
      behaviour="move"
      group-name="block"
      :get-child-payload="index => config.children?.[index]"
      @drop="e => handleDrop(e, config.uid)"
      :drop-placeholder="true"
    >
      <slot>
        <div class="grid-col-drop-area-placeholder">请将块拖入此处</div>
      </slot>
    </drag-container>
  </a-col>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { PropType } from 'vue';
import { Container as DragContainer } from '@/components/draggable';
import { moveBlok } from '@/views/low-code/design/utils/index';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: 'DGridCol',
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

    return { handleDrop, designerState };
  },
  components: {
    DragContainer,
  },
});
</script>

<style lang="less" scoped>
.designer-grid-col {
  height: 100%;
  //   z-index: 4;
  .grid-col-drop-area {
    position: relative;
    min-height: 120px;
    .grid-col-drop-area-placeholder {
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
