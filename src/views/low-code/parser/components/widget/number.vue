<template>
  <a-input-number
    :disabled="config.options.disabled"
    :size="config.options.size"
    :controls="config.options.controls"
    :max="config.options.max"
    :min="config.options.min"
    :step="config.options.step || 1"
    :precision="config.options.precision || 0"
    :placeholder="config.options.placeholder"
    :formatter="config.options.formatter ? fomatter : undefined"
    :parser="config.options.parser ? parser : undefined"
    style="width: 100%"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const fomatter = value => {
      return eval(props.config.options.formatter)(value);
    };

    const parser = value => {
      return eval(props.config.options.parser)(value);
    };
    return { fomatter, parser };
  },
});
</script>

<style lang="less" scoped></style>
