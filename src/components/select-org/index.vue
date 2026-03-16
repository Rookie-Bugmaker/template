<template>
  <a-select
    :value="realValue"
    @update:value="handleUpdateValue"
    style="width: 100%"
    allow-clear
    :size="size"
    :dropdown-match-select-width="false"
    v-bind="$attrs"
    :mode="multiple ? 'multiple' : null"
    :maxTagCount="maxTagCount"
    :option-label-prop="multiple ? 'label' : null"
    :getPopupContainer="getContainer"
    :filterOption="handleFilterOption"
  >
    <a-select-option
      v-for="item in displayOrgList"
      :key="item.orgId"
      :value="codeValue ? item.orgCode : item.orgId"
      :label="item.orgName"
      :code="item.orgCode"
      :style="{ display: item.orgStatus == 'N' ? 'none' : '' }"
    >
      <span>{{ item.orgName }}</span>
      <span v-if="showCode" style="float: right; margin-left: 10px; color: rgb(180 180 180)">
        {{ item.orgCode }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import type { RenderDOMFunc } from 'ant-design-vue/lib/vc-select/BaseSelect';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { findOrgByCurrentRole } from '@/api/system/org';
import type { OrgItem } from '@/api/system/org';
import { toUpper } from 'lodash';

export default defineComponent({
  name: 'SelectValueSet',
  props: {
    //值v-model:value
    value: {
      type: String,
      default: '',
    },
    //下拉选择中是否显示编码
    showCode: {
      type: Boolean,
      default: true,
    },
    // 大小 small middle large
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    //最多显示多少个 tag
    maxTagCount: {
      type: Number,
      default: 1,
    },
    getContainer: {
      type: Function as PropType<RenderDOMFunc>,
      default: () => document.body,
    },
    //true:使用orgCode作为value值,false:使用orgId作为value值
    codeValue: {
      type: Boolean,
      default: false,
    },
    //仅包括的值集值编码
    includes: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    //需排除的值集值编码
    excludes: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['update:value', 'getOptions'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      orgList: [] as OrgItem[],
    });

    const getOrgList = (): void => {
      state.loading = true;
      findOrgByCurrentRole()
        .then(({ success, result }) => {
          if (success && result) {
            state.orgList = result || [];
          } else {
            state.orgList = [];
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    getOrgList();

    const realValue = computed(() => {
      if (props.multiple) {
        return props.value ? props.value.split(',') : [];
      } else {
        return props.value;
      }
    });

    const handleUpdateValue = (v: string | string[]) => {
      if (props.multiple) {
        emit('update:value', v?.length ? (v as string[]).join(',') : null);
      } else {
        emit('update:value', v === '' || v === undefined ? null : v);
      }
    };

    //显示的列表
    const displayOrgList = computed(() => {
      let list = state.orgList;
      //过滤排除和包含的组织编码
      if (props.includes?.length) {
        list = list.filter(f => props.includes.includes(f.orgCode));
      }
      if (props.excludes?.length) {
        list = list.filter(f => !props.excludes.includes(f.orgCode));
      }
      emit('getOptions', list);
      return list;
    });

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
      realValue,
      handleUpdateValue,
      displayOrgList,
      handleFilterOption,
    };
  },
});
</script>

<style lang="less" scoped></style>
