<template>
  <select-dept
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :company-id="parentValue"
  />
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import SelectDept from '@/components/select-dept/index.vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { BlockType } from '@/views/low-code/parser/typing/index';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const parserState = inject(parserStateInjectKey);

    const parentValue = computed(() => {
      if (props.config?.options?.parentValue) {
        const block = props.config.options.parentValue?.block;
        const field = props.config.options.parentValue?.field;
        //查询块的值通过控件id绑定，其他数据块通过数据源的字段绑定
        const key =
          parserState.blockConfig.get(block)?.type === BlockType.SearchForm
            ? `widget_${field}`
            : field;

        return parserState.block?.get(block)?.getModel?.()?.[key] || null;
      } else {
        return null;
      }
    });
    return {
      parentValue,
    };
  },
  components: {
    SelectDept,
  },
});
</script>

<style lang="less" scoped></style>
