<template>
  <a-select
    :value="internalValue"
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
    :disabled="disabled"
  >
    <template v-if="reverseSelectOption !== false">
      <a-select-option
        v-for="item in displayValueList"
        :key="item.vsId"
        :value="codeValue ? item.vsCode : item.vsId"
        :label="item.vsName"
        :code="item.vsCode"
        :style="{ display: item.vsStatus == 'N' ? 'none' : '' }"
        :disabled="disabledOptions?.includes(item.vsCode)"
      >
        <span>{{ item.vsCode }}</span>
        <span
          v-if="reverseSelectOption !== true && reverseSelectOption?.showValueName"
          style="float: right; margin-left: 10px; color: rgb(180 180 180)"
        >
          {{ item.vsName }}
        </span>
      </a-select-option>
    </template>
    <template v-else>
      <a-select-option
        v-for="item in displayValueList"
        :key="item.vsId"
        :value="codeValue ? item.vsCode : item.vsId"
        :label="item.vsName"
        :code="item.vsCode"
        :style="{ display: item.vsStatus == 'N' ? 'none' : '' }"
        :disabled="disabledOptions?.includes(item.vsCode)"
      >
        <span>{{ item.vsName }}</span>
        <span v-if="showValueCode" style="float: right; margin-left: 10px; color: rgb(180 180 180)">
          {{ item.vsCode }}
        </span>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from 'vue';
import type { RenderDOMFunc } from 'ant-design-vue/lib/vc-select/BaseSelect';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import {
  findNoRootByCode,
  findNoRootByParentLineCode,
  findNoRootByParentLineId,
} from '@/api/system/value-set';
import type { ValueSetItem } from '@/api/system/value-set';
import { toUpper } from 'lodash';

//用于判断是否有使用parentValue这个props参数（使用了这个参数，说明是子值集，加载值集和选择会受parentValue影响）
const isAbsent = Symbol('is-parent-value-absent');

//值集vsCode与vsName显示位置互换,传入true或则对象开启，对象属性showValueName控制vsName显示
type ReverseSelectOption = boolean | { showValueName: boolean };

export default defineComponent({
  name: 'SelectValueSet',
  props: {
    //值集编码
    code: {
      type: String,
    },
    //值v-model:value
    value: {
      type: String,
      default: '',
    },
    //下拉选择中是否显示值编码
    showValueCode: {
      type: Boolean,
      default: true,
    },
    //是否限制组织(Y/N)
    restrictOrg: {
      type: String,
      default: 'Y',
    },
    //值集vsCode与vsName显示位置互换,默认关闭
    reverseSelectOption: {
      type: [Boolean, Object] as PropType<ReverseSelectOption>,
      default: false,
    },
    // 大小 small middle large
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
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
    //true:使用vsCode作为value值,false:使用vsId作为value值
    codeValue: {
      type: Boolean,
      default: false,
    },
    //父值值集中的值
    parentValue: {
      type: [String, Symbol],
      default: isAbsent,
    },
    //父值值集中的值,true:使用vsCode作为value值,false:使用vsId作为value值
    parentCodeValue: {
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
    //需要禁用的值集选项的编码
    disabledOptions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    // 值列表
    valueList: {
      type: Array as PropType<ValueSetItem[]>,
      default: undefined,
    },
  },
  emits: ['update:value', 'bring'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      valueList: [] as ValueSetItem[],
    });

    const getValueList = (code: string): void => {
      state.loading = true;
      findNoRootByCode(code, props.restrictOrg)
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

    const getValueListByParentValue = (parentValue: string | symbol) => {
      if (!parentValue || parentValue === isAbsent) {
        return;
      }
      state.loading = true;
      if (props.parentCodeValue) {
        findNoRootByParentLineCode(props.code, parentValue as string, props.restrictOrg)
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
      } else {
        findNoRootByParentLineId(parentValue as string, props.code, props.restrictOrg)
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
      }
    };

    if (props.valueList === undefined) {
      //缺失parentValue参数（没有使用），说明是独立的值集，值集加载即可
      if (props.parentValue === isAbsent) {
        getValueList(props.code);
      } else {
        //使用了这个parentValue参数，说明是子值集，加载值集和选择会受parentValue影响
        getValueListByParentValue(props.parentValue);
      }
    }
    const internalValue = computed(() => {
      if (props.multiple) {
        return props.value ? props.value.split(',') : [];
      } else {
        return props.value;
      }
    });

    //显示的列表
    const displayValueList = computed(() => {
      let list = props.valueList ?? state.valueList;
      //过滤排除和包含的值集值
      if (props.includes?.length) {
        list = list.filter(f => props.includes.includes(f.vsCode));
      }
      if (props.excludes?.length) {
        list = list.filter(f => !props.excludes.includes(f.vsCode));
      }
      return list;
    });

    const handleUpdateValue = (v: string | string[]) => {
      if (props.multiple) {
        const value = v?.length ? (v as string[]).join(',') : null;
        emit('update:value', value);
      } else {
        const value = v === '' || v === undefined ? null : v;
        emit('update:value', value);
      }
    };

    /**
     * 处理带出事件
     * @param value 为props传入的value值
     */
    const handleBring = (value: string) => {
      const key = props.codeValue ? 'vsCode' : 'vsId';
      if (props.multiple) {
        //防止有包含关系的编码值，需要拆成数组比对
        const valueArr = value?.split(',') || [];
        const bring = displayValueList.value.filter(f => valueArr?.includes(f[key]));
        emit('bring', value, bring);
      } else {
        const [bring] = displayValueList.value.filter(f => f[key] === value);
        emit('bring', value, bring);
      }
    };

    watch(
      [() => props.value, () => displayValueList.value], //可能赋值时值集列表仍未查询出来，所以需要监听displayValueList
      ([value]) => {
        handleBring(value);
      },
      { immediate: true, deep: true },
    );

    watch(
      () => props.parentValue,
      (n, o) => {
        //发生改变才触发加载
        if (n != o) {
          if (!n && o) {
            //如果新值是空，且旧值不为空，说明父值做了清空操作，需要清空已选择值，并清空值列表
            handleUpdateValue(null);
            state.valueList = [];
          } else if (n && o) {
            //如果新值旧值都不为空，说明父值改变了，需要清空已选择，并重新加载值列表
            handleUpdateValue(null);
            getValueListByParentValue(n);
          } else if (n && !o) {
            //如果新值不为空，且旧值是空,说明是新选的父值，或者是初始化表单时加载的值，只需重新加载值列表，且不应清空选择
            getValueListByParentValue(n);
          }
        }
      },
      { immediate: true },
    );

    const getPopupContainer = () => document.body;

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
      internalValue,
      handleUpdateValue,
      displayValueList,
      getPopupContainer,
      handleFilterOption,
    };
  },
});
</script>

<style lang="less" scoped></style>
