<template>
  <select-value-set
    v-if="config.options.parentValue"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :code="config.options.setCode"
    :multiple="config.options.multiple"
    :maxTagCount="config.options.maxTagCount"
    :code-value="config.options.codeValue"
    :parent-code-value="config.options.parentCodeValue"
    :parent-value="parentValue"
    :excludes="config.options.excludes"
    :includes="config.options.includes"
    :disabledOptions="config.options.disabledOptions"
    @bring="handleBring"
  />
  <select-value-set
    v-else
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :code="config.options.setCode"
    :multiple="config.options.multiple"
    :maxTagCount="config.options.maxTagCount"
    :code-value="config.options.codeValue"
    :excludes="config.options.excludes"
    :includes="config.options.includes"
    :disabledOptions="config.options.disabledOptions"
    @bring="handleBring"
  />
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import SelectValueSet from '@/components/select-value-set/index.vue';
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
  emits: ['bring'],
  setup(props, { emit }) {
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

    const handleBring = (val, dataItem) => {
      //暂不支持带出配置，brings一直为空数组，写在这里防止后续程序报错
      if (props.config.options.brings?.length) {
        if (val) {
          emit('bring', dataItem, props.config.options.brings, props.config.options.multiple);
        } else {
          emit('bring', null, props.config.options.brings, props.config.options.multiple);
        }
      }
    };

    return { parentValue, handleBring };
  },
  components: {
    SelectValueSet,
  },
});
</script>

<style lang="less" scoped></style>
