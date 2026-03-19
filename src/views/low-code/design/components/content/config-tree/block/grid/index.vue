<template>
  <block-wrapper :is-selected="designerState.currentConfig?.uid === config.uid" :style="styles">
    <a-row
      class="designer-grid"
      :align="config?.options.align"
      :justify="config?.options.justify"
      :gutter="config?.options.gutter"
      :wrap="config?.options.wrap"
    >
      <slot><a-col :span="24">请添加栅格</a-col></slot>
    </a-row>
  </block-wrapper>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import BlockWrapper from '../../common/block-wrapper.vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { isString } from 'lodash';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const designerState = inject(designerStateInjectKey);

    const styles = computed(() => {
      const h = props.config?.options?.height;
      if (h) {
        if (isString(h)) {
          return { height: h };
        }
        return { height: `${h}px` };
      }
      return {};
    });

    return {
      designerState,
      styles,
    };
  },
  components: {
    BlockWrapper,
  },
});
</script>

<style lang="less" scoped>
.designer-grid {
  z-index: 4;
  background: #fff;
  margin-bottom: 12px;
  padding: 6px;
  border-radius: 8px;
}
</style>
