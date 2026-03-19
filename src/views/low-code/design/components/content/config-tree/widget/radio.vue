<template>
  <a-radio-group
    :value="plainOptions?.[0]?.value"
    :disabled="config.options.disabled"
    name="radioGroup"
    :size="config.options.size"
    :button-style="config.options.buttonStyle"
  >
    <template v-if="config.options.orientation === 'horizontal'">
      <component
        :is="optionComponent"
        v-for="item in plainOptions"
        :key="item.uid"
        :value="item.value"
      >
        {{ item.label }}
      </component>
    </template>
    <template v-else>
      <a-row :gutter="[12, 12]">
        <a-col v-for="item in plainOptions" :key="item.uid" :span="24">
          <component :is="optionComponent" :value="item.value">
            {{ item.label }}
          </component>
        </a-col>
      </a-row>
    </template>
  </a-radio-group>
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

    const optionComponent = computed(() => {
      const cgf = props.config;
      if (cgf.options.optionType === 'button') {
        return 'a-radio-button';
      } else {
        return 'a-radio';
      }
    });
    return { plainOptions, optionComponent };
  },
});
</script>

<style lang="less" scoped></style>
