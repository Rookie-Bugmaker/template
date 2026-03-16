<template>
  <a-card v-if="type === 'card'">
    <slot />
  </a-card>
  <div v-else><slot /></div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

type TableWrapperType = 'card' | 'default';

export default defineComponent({
  name: 'TableWrapper',
  props: {
    type: {
      type: String as PropType<TableWrapperType>,
      default: 'card',
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
