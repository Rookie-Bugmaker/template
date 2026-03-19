<template>
  <a-select
    :value="value"
    @update:value="e => $emit('update:value', e ? e : null)"
    v-bind="$attrs"
    :dropdown-match-select-width="false"
    :get-popup-container="getPopupContainer"
    @select="handleSelect"
    allow-clear
    style="width: 100%"
  >
    <a-select-option v-for="item in fieldList" :key="item.fieldCode" :value="item.fieldCode">
      <span>{{ item.fieldCode }}</span>
      <span style="float: right; color: rgb(180 180 180)">{{ item.fieldDesc }}</span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { FiledItem } from '@/api/low-code/data-set/table';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: String,
      default: '',
    },
    fieldList: {
      type: Array as PropType<FiledItem[]>,
      default: () => [],
    },
  },
  emits: ['update:value', 'select'],
  setup(props, { emit }) {
    const handleSelect = v => {
      const target = props.fieldList.find(f => f.fieldCode === v);
      emit('select', v, target);
    };

    const getPopupContainer = () => document.body;

    return {
      handleSelect,
      getPopupContainer,
    };
  },
});
</script>
