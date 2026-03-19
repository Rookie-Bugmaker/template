<template>
  <a-select
    :value="value"
    @update:value="v => $emit('update:value', v)"
    style="width: 100%"
    allow-clear
    :dropdown-match-select-width="false"
    v-bind="$attrs"
    mode="multiple"
    :maxTagCount="1"
    option-label-prop="label"
    :getPopupContainer="getContainer"
    :filterOption="handleFilterOption"
  >
    <a-select-option
      v-for="item in state.valueList"
      :key="item.vsId"
      :value="item.vsCode"
      :label="item.vsName"
      :code="item.vsCode"
    >
      <span>{{ item.vsName }}</span>
      <span style="float: right; margin-left: 10px; color: rgb(180 180 180)">
        {{ item.vsCode }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import type { RenderDOMFunc } from 'ant-design-vue/lib/vc-select/BaseSelect';
import type { PropType } from 'vue';
import { findNoRootByCode } from '@/api/system/value-set';
import type { ValueSetItem } from '@/api/system/value-set';
import { toUpper } from 'lodash';

export default defineComponent({
  name: 'SelectValueSet',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    //值集编码
    code: {
      type: String,
    },
    getContainer: {
      type: Function as PropType<RenderDOMFunc>,
      default: () => document.body,
    },
  },
  emits: ['update:value'],
  setup(props) {
    const state = reactive({
      loading: false,
      valueList: [] as ValueSetItem[],
    });

    const getValueList = (code: string): void => {
      state.loading = true;
      findNoRootByCode(code)
        .then(({ success, result }) => {
          if (success && result) {
            state.valueList = result || [];
          } else {
            state.valueList = [];
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    watch(
      () => props.code,
      n => {
        if (n) {
          getValueList(n);
        } else {
          state.valueList = [];
        }
      },
      { immediate: true },
    );

    const handleFilterOption = (inputValue: string, option: any) => {
      if (['', undefined, null].includes(inputValue)) {
        return true;
      } else {
        return (
          (option.label && toUpper(option.label)?.includes(toUpper(inputValue))) ||
          (option.code && toUpper(option.code)?.includes(toUpper(inputValue)))
        );
      }
    };

    return {
      state,
      handleFilterOption,
    };
  },
});
</script>

<style lang="less" scoped></style>
