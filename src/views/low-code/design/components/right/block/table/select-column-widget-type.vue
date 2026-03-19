<template>
  <a-select
    :value="value"
    @change="handleChange"
    v-bind="$attrs"
    :dropdown-match-select-width="false"
    :get-popup-container="getPopupContainer"
  >
    <a-select-option v-for="item in widgets" :key="item.type" :value="item.type">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { WidgetType, defaultConfig } from '@/views/low-code/design/typing/index';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: String,
      default: 'input',
    },
  },
  emits: ['update:value', 'change'],
  setup(_props, { emit }) {
    const widgets = Object.values(WidgetType)
      .filter(f => defaultConfig[f] && f !== WidgetType.Button)
      .map(m => {
        return defaultConfig[m];
      });

    const handleChange = (val: string) => {
      emit('update:value', val);
      emit('change', val);
    };

    const getPopupContainer = () => document.body;

    return { widgets, handleChange, getPopupContainer };
  },
});
</script>

<style lang="less" scoped></style>
