<template>
  <a-tree-select
    :value="plainOptions?.[0]?.value"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :multiple="config.options.multiple"
    tree-default-expand-all
    style="width: 100%"
    :tree-data="plainOptions"
    :field-names="{
      children: 'children',
      label: 'label',
      value: 'value',
    }"
  ></a-tree-select>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const plainOptions = computed(() => {
      const cgf = props.config;
      const defaultOptions = [
        { label: '树选项1', value: '1', uid: '1' },
        { label: '树选项2', value: '2', uid: '2' },
      ];
      if (cgf.options.optionsType == 'fixed') {
        return cgf.options.options.length ? cgf.options.options : defaultOptions;
      } else {
        return defaultOptions;
      }
    });

    return { plainOptions };
  },
});
</script>

<style lang="less" scoped></style>
