<template>
  <div class="logic-sub-title">
    <span v-if="index === 0" class="title">当</span>
    <span v-else class="title">{{ value === LogicType.AND ? '且' : '或' }}</span>

    <delete-outlined @click="$emit('remove-filter', index)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { LogicType } from '@/api/workflow/template/typing';

export default defineComponent({
  name: 'LogicSubTitle',
  props: {
    value: {
      type: String as PropType<LogicType>,
      default: 'and',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  emits: ['remove-filter'],
  setup() {
    return { LogicType };
  },
});
</script>

<style lang="less" scoped>
.logic-sub-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  margin: 0 0 5px;
  padding: 0 5px;
  color: #646a73;
  line-height: 25px;
}
</style>
