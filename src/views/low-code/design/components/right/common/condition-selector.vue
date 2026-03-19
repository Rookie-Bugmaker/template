<template>
  <a-row>
    <a-col flex="auto">
      <a-select
        :value="value"
        @update:value="v => $emit('update:value', v)"
        :dropdown-match-select-width="false"
        :get-popup-container="getPopupContainer"
        allow-clear
        :size="size"
        v-bind="$attrs"
        style="width: 100%"
        placeholder="不控制"
      >
        <a-select-option
          v-for="item in designerState?.config?.conditions || []"
          :key="item.uid"
          :value="item.uid"
          :label="item.name"
        >
          <span>{{ item.name }}</span>
        </a-select-option>
      </a-select>
    </a-col>
    <a-col flex="25px" style="display: flex; justify-content: center">
      <plus-circle-outlined v-if="!value" style="cursor: pointer" @click.stop="addCondition" />
      <form-outlined v-else style="cursor: pointer" @click.stop="edit(value)" />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';

import useConditions from '@/views/low-code/design/hooks/useConditions';

export default defineComponent({
  name: 'ConditionSeletor',
  props: {
    value: {
      type: String,
      default: null,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
  },
  emits: ['update:value'],
  setup(_props, { emit }) {
    const designerState = inject(designerStateInjectKey);
    const getPopupContainer = () => document.body;

    const { add, edit } = useConditions();
    const addCondition = () => {
      const key = add();
      emit('update:value', key);
    };

    return {
      designerState,
      getPopupContainer,
      add,
      edit,
      addCondition,
    };
  },
});
</script>

<style lang="less" scoped></style>
