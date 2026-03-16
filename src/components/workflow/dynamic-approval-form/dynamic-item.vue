<template>
  <a-form-item :label="config.label" v-show="!hidden">
    <a-input
      v-if="config.type === 'input'"
      v-bind="$attrs"
      :value="value"
      @update:value="v => $emit('update:value', v)"
    ></a-input>
    <a-textarea
      v-else-if="config.type === 'textarea'"
      v-bind="$attrs"
      :value="value"
      @update:value="v => $emit('update:value', v)"
      :rows="4"
    />
    <a-checkbox
      v-else-if="config.type === 'checkbox'"
      v-bind="$attrs"
      :checked="value === 'Y'"
      @update:checked="v => $emit('update:value', v ? 'Y' : 'N')"
    ></a-checkbox>
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import type { PropType } from 'vue';
import type { DynamicApprovalFormItem } from '@/api/workflow/template/typing';

export default defineComponent({
  name: 'DynamicItem',
  props: {
    config: {
      type: Object as PropType<DynamicApprovalFormItem>,
      required: true,
    },
    value: {
      type: [String, Number],
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup() {
    const state = reactive({});
    return {
      state,
    };
  },
});
</script>

<style lang="less" scoped></style>
