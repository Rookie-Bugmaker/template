<template>
  <a-select
    :value="plainOptions?.[0]?.value"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :mode="config.options.mode"
    :max-tag-count="config.options.maxTagCount"
    style="width: 100%"
  >
    <a-select-option v-for="item in plainOptions" :key="item.uid" :value="item.value">
      <span>{{ item.label }}</span>
      <span v-if="config.options.showDescription" style="float: right; color: rgb(180 180 180)">
        {{ item.desc }}
      </span>
    </a-select-option>
  </a-select>
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
        { label: '选项1', desc: '提示1', value: '1', uid: '1' },
        { label: '选项2', desc: '提示2', value: '2', uid: '2' },
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
