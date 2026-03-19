<template>
  <a-row
    class="designer-grid"
    :align="config?.options.align"
    :justify="config?.options.justify"
    :gutter="config?.options.gutter"
    :wrap="config?.options.wrap"
    :style="styles"
  >
    <slot></slot>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
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
    return { styles };
  },
  components: {},
});
</script>

<style lang="less" scoped>
.designer-grid {
  z-index: 4;
  background: #fff;
  margin-bottom: 12px;
  padding: 12px 6px;
  border-radius: 8px;
}
</style>
