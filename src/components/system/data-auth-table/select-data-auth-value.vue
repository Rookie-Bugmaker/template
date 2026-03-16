<template>
  <a-select
    :value="value"
    @change="handleChangValue"
    mode="multiple"
    :max-tag-count="1"
    style="width: 100%"
    allow-clear
    :size="size"
    v-bind="$attrs"
    option-label-prop="label"
    :dropdown-match-select-width="false"
    :get-popup-container="getPopupContainer"
  >
    <a-select-option
      v-for="item in state.valueList"
      :key="item.id"
      :value="item.id"
      :label="item.code"
      :description="item.desc"
    >
      <span>{{ item.code }}</span>
      <span style="float: right; color: rgb(180 180 180); margin-left: 10px">{{ item.desc }}</span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { getValueSetListAccordingToProfileId } from '@/api/system/profile/index';
import type { ValueSetItem } from '@/api/system/profile/index';
export default defineComponent({
  name: 'SelectProfile',
  props: {
    //值v-model:value
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    profileId: {
      type: String,
      default: '',
    },
    // 大小 small middle large
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      valueList: [] as ValueSetItem[],
    });

    const getValueList = (profileId: string): void => {
      state.loading = true;
      getValueSetListAccordingToProfileId({ profileId })
        .then(({ success, result }) => {
          if (success && result) {
            state.valueList = result;
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
      () => props.profileId,
      (n, o) => {
        if (n !== o) {
          if (n) {
            getValueList(n);
          } else {
            state.valueList = [];
          }
        }
      },
      { immediate: true },
    );

    const handleChangValue = (val: string[]) => {
      emit(
        'update:value',
        val.map(m => {
          const target = state.valueList.find(f => f.id === m);
          return { authValue: target.id, authValueDesc: target.desc };
        }),
      );
    };

    const getPopupContainer = () => document.body;

    return {
      state,
      handleChangValue,
      getPopupContainer,
    };
  },
});
</script>

<style lang="less" scoped></style>
