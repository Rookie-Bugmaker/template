<template>
  <div class="designer-content">
    <config-tree
      :config="
        designerState.config?.configTrees?.find(f => f.uid === designerState.currentConfigTreeId)
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import ConfigTree from './config-tree/index.vue';

export default defineComponent({
  name: 'DesignerContent',
  setup() {
    const designerState = inject(designerStateInjectKey);
    return { designerState };
  },
  components: {
    ConfigTree,
  },
});
</script>

<style lang="less" scoped>
.designer-content {
  width: 100%;
  height: 100%;
}
</style>
