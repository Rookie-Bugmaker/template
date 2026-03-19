<template>
  <div class="logic-title">
    <span v-if="index === 0" class="title">满足以下条件时</span>
    <span v-else class="title">{{ value === LogicType.AND ? '且满足' : '或满足' }}</span>

    <div class="logic-right" v-if="index === 0">
      <span style="margin-right: 8px">组间逻辑</span>
      <a-switch
        :checked="value"
        @change="checked => $emit('update:value', checked)"
        checked-value="and"
        un-checked-value="or"
        checked-children="且"
        un-checked-children="或"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { LogicType } from '@/api/workflow/template/typing';

export default defineComponent({
  name: 'LogicTitle',
  props: {
    value: {
      type: String as PropType<LogicType>,
      default: LogicType.AND,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:value'],
  setup() {
    return { LogicType };
  },
});
</script>

<style lang="less" scoped>
.logic-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  margin: 0 0 10px;
  padding: 0 5px;
  color: #646a73;
  line-height: 30px;
  .logic-right {
    display: flex;
    align-items: baseline;
    & > span {
      margin-right: 10px;
    }
  }
}
</style>
