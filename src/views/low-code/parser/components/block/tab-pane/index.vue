<template>
  <a-tab-pane class="designer-tab-pane" force-render v-bind="$attrs" :style="styles">
    <slot />
  </a-tab-pane>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';

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
    const styles = computed(() => {
      const h = props.config?.options?.height;
      if (h) {
        return { height: `${h}px` };
      }
      return {};
    });

    return { styles };
  },
  components: {},
});
</script>

<style lang="less" scoped></style>
