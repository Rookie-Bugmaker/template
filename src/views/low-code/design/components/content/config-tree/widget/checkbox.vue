<template>
  <a-checkbox-group
    :value="plainOptions?.[0]?.value"
    :disabled="config.options.disabled"
    name="checkboxgroup"
    :size="config.options.size"
  >
    <template v-if="config.options.orientation === 'horizontal'">
      <a-checkbox v-for="item in plainOptions" :key="item.uid" :value="item.value">
        {{ item.label }}
      </a-checkbox>
    </template>
    <template v-else>
      <a-row :gutter="[12, 12]">
        <a-col v-for="item in plainOptions" :key="item.uid" :span="24">
          <a-checkbox :value="item.value">
            {{ item.label }}
          </a-checkbox>
        </a-col>
      </a-row>
    </template>
  </a-checkbox-group>
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
        { label: '选项1', value: '1', uid: '1' },
        { label: '选项2', value: '2', uid: '2' },
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
