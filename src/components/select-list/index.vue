<template>
  <a-select
    style="width: 100%"
    v-bind="$attrs"
    allow-clear
    :filter-option="filterOption"
    :dropdown-match-select-width="dropdownMatchSelectWidth"
    :mode="multiple ? 'multiple' : null"
    :value="value"
    @update:value="handleUpdateValue"
  >
    <a-select-option
      v-for="item in rawOptions"
      :key="item[curListOptions.fieldNames.value || 'value']"
      :value="item[curListOptions.fieldNames.value || 'value']"
      :label="item[curListOptions.fieldNames.label || 'label']"
      :description="item[curListOptions.fieldNames.description || 'description']"
    >
      <span>{{ item[curListOptions.fieldNames.label || 'label'] }}</span>
      <span
        v-if="curListOptions.showDesc"
        style="float: right; color: rgb(180 180 180); margin-left: 8px"
      >
        {{ item[curListOptions.fieldNames.description || 'description'] }}
      </span>
    </a-select-option>
    <template #suffixIcon v-if="loading"><loading-outlined /></template>
  </a-select>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect, watch, toRaw, onUnmounted } from 'vue';
import { toUpper, isObject, isArray, isEqual } from 'lodash';
import { useFetchList } from '@/utils/hooks/useFetchList';
import type { Options } from '@/utils/hooks/useFetchList';
import type { SelectValue } from 'ant-design-vue/es/select/index';

type ListOptions<T = any, P = any> = {
  fetchApi: (params?: any) => Promise<T>;
  queryParams?: P;
  autoFetch?: boolean;
  validateParams?: (params: P) => Promise<boolean> | boolean;
  convertData?: Options<any>['convertData'];
  childrenRoot?: string;
  options?: any[];
  showDesc?: boolean;
  noEffect?: boolean;
  fieldNames?: object;
};

type Props = {
  listOptions: ListOptions;
  dropdownMatchSelectWidth?: boolean | number;
  multiple: boolean;
  value: SelectValue;
};

const props = withDefaults(defineProps<Props>(), {
  dropdownMatchSelectWidth: false,
  multiple: false,
});

const emit = defineEmits(['fetch-callback', 'update:value']);

const initListOptions = () => ({
  fetchApi: null,
  queryParams: undefined,
  autoFetch: true,
  validateParams: undefined,
  convertData: undefined,
  childrenRoot: null,
  options: [],
  showDesc: true,
  fieldNames: {
    value: 'value',
    label: 'label',
    description: 'description',
  },
  /**禁用副作用 */
  noEffect: false,
});

const curListOptions = reactive(initListOptions());

const stopWatch = watchEffect(() => {
  Object.assign(curListOptions, props.listOptions);
});

onUnmounted(() => {
  stopWatch();
});

const rawOptions = computed(() => {
  if (!curListOptions?.fetchApi) {
    return curListOptions?.options || [];
  } else {
    return list.value;
  }
});

const { list, loading, reload } = useFetchList(curListOptions.fetchApi, {
  autoFetch: curListOptions.autoFetch,
  params: curListOptions.queryParams,
  onValidateParams:
    curListOptions?.validateParams &&
    (async (params, next) => {
      const valid = await curListOptions.validateParams(params);
      if (!valid) {
        list.value = [];
      } else {
        next();
      }
    }),
  convertData: curListOptions.convertData,
  onSuccess: () => {
    emit('fetch-callback', rawOptions.value);
  },
});

const handleUpdateValue = (v: SelectValue) => {
  if (isArray(v)) {
    emit('update:value', v?.length ? v : []);
  } else {
    emit('update:value', v === '' || v === undefined ? null : v);
  }
};

if (!curListOptions.noEffect) {
  watch(
    () => toRaw(curListOptions.queryParams),
    async (n, o) => {
      if (curListOptions?.validateParams) {
        //需要校验的参数，说明存在必填参数
        const isObj = isObject(curListOptions.queryParams);
        if (isObj) {
          //如果是对象参数
          const oldValid = await curListOptions.validateParams(o);
          //如果旧值校验通过，且有变化时，直接清空值
          if (oldValid) {
            handleUpdateValue(null);
          }
        } else {
          //如果参数是普通值，且旧值存在，有变化的时候，直接清空值
          if (o && n !== o) {
            handleUpdateValue(null);
          }
        }
      } else {
        //不需要检验的参数，说明不存在必填参数，有变化就更新值
        if (isEqual(n, o)) {
          handleUpdateValue(null);
        }
      }
    },
    {
      deep: true,
    },
  );
}

//搜索数据
const filterOption = (inputValue: string, option: any) => {
  if (['', undefined, null].includes(inputValue)) {
    return true;
  } else {
    return (
      (option.label && toUpper(option.label)?.includes(toUpper(inputValue))) ||
      (option.description && toUpper(option.description)?.includes(toUpper(inputValue)))
    );
  }
};

defineExpose({
  reload,
});
</script>

<style lang="less" scoped></style>
