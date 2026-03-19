<template>
  <block-wrapper :is-selected="designerState.currentConfig?.uid === config.uid">
    <a-card class="designer-card" :size="config?.options.size">
      <template #title>
        <icon
          v-if="config?.options.icon"
          :name="config?.options.icon"
          style="margin-right: 8px"
        ></icon>
        <span>
          {{ config?.options.title }}
        </span>
      </template>
      <drag-container
        class="card-drop-area"
        behaviour="move"
        group-name="block"
        :get-child-payload="index => config.children?.[index]"
        @drop="e => handleDrop(e, config.uid)"
        :drop-placeholder="true"
      >
        <slot>
          <div class="card-drop-area-placeholder">请将块拖入此处</div>
        </slot>
      </drag-container>
    </a-card>
  </block-wrapper>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { PropType } from 'vue';
import BlockWrapper from '../../common/block-wrapper.vue';
import { Container as DragContainer } from '@/components/draggable';
import { moveBlok } from '@/views/low-code/design/utils/index';
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
    const handleDrop = (e, dropBlockId) => {
      moveBlok(e, dropBlockId, props.blockMap);
    };

    const designerState = inject(designerStateInjectKey);

    return {
      handleDrop,
      designerState,
    };
  },
  components: {
    BlockWrapper,
    DragContainer,
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
