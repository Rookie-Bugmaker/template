<template>
  <a-tabs
    class="designer-tabs"
    :size="config?.options.size"
    :type="config?.options.type"
    :centered="config?.options.centered"
    :tabBarGutter="config?.options.tabBarGutter"
    :tabPosition="config?.options.tabPosition"
  >
    <slot />
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

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
    const activeKey = ref(props.config.children?.[0]?.uid);

    return {
      activeKey,
    };
  },
  components: {},
});
</script>

<style lang="less" scoped>
.designer-tabs {
  margin-bottom: 12px;
  padding: 12px 5px 0px;
  background: #fff;
}
</style>
