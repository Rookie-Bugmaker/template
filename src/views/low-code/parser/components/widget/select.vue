<template>
  <a-select
    :value="currentValue"
    @update:value="handleUpdateValue"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :mode="config.options.mode"
    :max-tag-count="config.options.maxTagCount"
    :get-popup-container="getPopupContainer"
    :dropdown-match-select-width="false"
    :filterOption="handleFilterOption"
  >
    <a-select-option
      v-for="item in plainOptions"
      :key="item.uid"
      :value="item[config.options.valueField || 'value']"
      :label="item[config.options.textField || 'label']"
      :desc="item[config.options.descriptionField || 'desc']"
      :style="{ display: item['isKeyData'] ? 'none' : '' }"
    >
      <span>{{ item[config.options.textField || 'label'] }}</span>
      <span
        v-if="config.options.showDescription"
        style="float: right; margin-left: 8px; color: rgb(180 180 180)"
      >
        {{ item[config.options.descriptionField || 'desc'] }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, onMounted, watch, computed } from 'vue';
import { queryByList, queryById, queryByIds } from '@/api/low-code/parser';
import type { QueryObjectType, QueryFilterLogic } from '@/api/low-code/parser';
import { injectParserState } from '@/views/low-code/parser/hooks/useParserState';
import {
  getFilter,
  getWatchDepends,
  hasNullFilterValue,
} from '@/views/low-code/parser/utils/filter';
import { getParams } from '@/views/low-code/parser/utils/params';
import { isArray, isEqual, toUpper, isString, isNumber } from 'lodash';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    //是否是新增状态
    isCreate: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
      default: () => {
        return {
          primarykey: '',
          parentParams: {},
        };
      },
    },
  },
  emits: ['update:value', 'bring'],
  setup(props, { emit }) {
    const plainOptions = ref([]);

    const parserState = injectParserState();

    const currentValue = computed(() => {
      //mode有值说明是多选
      if (props.config.options.mode) {
        if (isString(props.value)) {
          return props.value ? props.value.split(',') : [];
        } else {
          return isNumber(props.value) ? [props.value] : [];
        }
      } else {
        return props.value;
      }
    });

    const handleUpdateValue = v => {
      //mode有值说明是多选
      if (!!props.config.options.mode && isArray(v)) {
        emit('update:value', v?.join(',') ?? null);
      } else {
        emit('update:value', v === undefined ? null : v);
      }
    };

    const queryParams = {
      pageId: '',
      //functionId?: string;
      objectId: props.config.options.dataSource.objectId as string,
      type: props.config.options.dataSource.type as QueryObjectType,
      fuzzyQuery: {
        fields: [],
        value: '',
      },
      params: [],
      filter: {
        logic: 'and' as QueryFilterLogic,
        filters: [],
      },
      sort:
        props.config?.options?.dataSource?.sort?.filter(f => f.field && f.type && f.nulls) || [],
    };

    const setFilter = () => {
      if (props.config.options.dataSource.filter) {
        queryParams.filter = getFilter(
          props.config.options.dataSource.filter,
          parserState?.block,
          parserState?.blockConfig,
          props.params?.parentParams,
        );
        /* queryParams.filter.filters = getFilter(
          props.config.options.dataSource.filter,
          parserState?.block,
        ).filters[0].filters; */
      }
    };

    const setParams = () => {
      queryParams.params = getParams(
        props.config.options.dataSource.params,
        props.params?.parentParams,
      );
    };

    const convertResultValueFieldType = (result: any) => {
      const valueField = props.config.options.valueField;
      if (isArray(result)) {
        return result.map(r => {
          return convertResultValueFieldType(r);
        });
      } else {
        result[valueField] = String(result[valueField]);
        return result;
      }
    };

    //根据id查询数据
    const setResultById = (id: string | number) => {
      queryById({
        pageId: '',
        objectId: props.config.options.dataSource.objectId,
        type: props.config.options.dataSource.type,
        primaryKey: props.config.options.valueField,
      })(id).then(({ success, result }) => {
        if (success && result) {
          //标识为id对应的数据，避免被后加载的列表数据覆盖
          Object.assign(result, { isKeyData: true });
          plainOptions.value.push(convertResultValueFieldType(result));
        }
      });
    };

    //根据ids查询数据
    const setResultByIds = (ids: (string | number)[]) => {
      queryByIds({
        pageId: '',
        objectId: props.config.options.dataSource.objectId,
        type: props.config.options.dataSource.type,
        primaryKey: props.config.options.valueField,
      })(ids.join(',')).then(({ success, result }) => {
        if (success && result) {
          //标识为id对应的数据，避免被后加载的列表数据覆盖
          result.forEach(r => {
            //标识为id对应的数据，避免被后加载的列表数据覆盖
            Object.assign(r, { isKeyData: true });
          });
          plainOptions.value.push(...convertResultValueFieldType(result));
        }
      });
    };

    //如果value有值且不在列表中找不到对应的值的行数据的话，说明该选项被禁用或有其他条件显示查询不出来，应调用按id查询。并把结果集加载到值列表中，使输入框中的描述正常显示，但是值列表里面的选项隐藏，不能再次选
    //选择此方案是因为value的值可能在初始化时获取不到,切加载列表可能为异步，不能一开始把value值作为过滤条件filter通过or一起查询出来，所以要分步处理,再调一次queryById
    //要排除一下，固定值集不需处理
    watchEffect(() => {
      const multiple = !!props.config.options.mode;

      const notFindIds =
        (multiple &&
          (currentValue.value as (string | number)[])?.filter(
            f => !plainOptions.value.find(o => o[props.config.options.valueField] == f),
          )) ||
        [];

      if (
        currentValue.value &&
        (multiple
          ? notFindIds?.length
          : !plainOptions.value.find(
              f => f[props.config.options.valueField] === currentValue.value,
            )) &&
        props.config.options.optionsType !== 'fixed'
      ) {
        if (isArray(currentValue.value)) {
          setResultByIds(notFindIds);
        } else {
          setResultById(currentValue.value);
        }
      }
    });

    const getData = () => {
      if (props.config.options.optionsType == 'fixed') {
        plainOptions.value = props.config.options?.options || [];
      } else {
        setFilter();
        //filter里面的条件都作为必要条件，如果有一个为空，直接将结果集置空
        if (hasNullFilterValue(queryParams.filter)) {
          //免去多余查询，有可能有多个查询（异步），一个返回是空集合（filter里面的条件值为空），一个返回集合不为空（filter里面的条件值不为空），被空集合覆盖了
          plainOptions.value = [];
        } else {
          setParams();
          queryByList(queryParams).then(({ success, result }) => {
            if (success && result) {
              //如果现有值列表中，有id对应的数据；且新返回的结果集里面没有有id对应的数据，则将keyData加入到值列表中
              const keyData = plainOptions.value.filter(f => f.isKeyData === true);
              if (
                keyData?.length &&
                !result.find(f => f[props.config.options.valueField] === props.value)
              ) {
                result.push(...keyData);
              }
              plainOptions.value = convertResultValueFieldType(result);
              //单个选项时自动选中（如果有关联条件，多层选择，只能作为最后一个选择框时使用，如果当前选择框还作为其他控件的前置条件时，会导致其他控件值清空，因为会自动选中的原因）
              //且只能在新增状态下才能自动选择，编辑不行（编辑时也自动选中的话，会导致删除字段数据，再次打开时被自动选中，导致用户迷惑）
              if (
                props.config.options?.autoSelectSingleOption === true &&
                result?.length === 1 &&
                props.isCreate
              ) {
                const v = result[0][props.config.options.valueField || 'value'];
                emit('update:value', String(v));
              }
            }
          });
        }
      }
    };

    onMounted(() => {
      getData();

      const depends = getWatchDepends(
        props.config.options.dataSource.filter,
        parserState?.block,
        parserState?.blockConfig,
      );
      watch(depends, (newArr, oldArr) => {
        let flag = 0; //0:不处理,1:仅触发查询,2：清空当前控件值并触发查询
        newArr.forEach((n, index) => {
          const o = oldArr[index];
          //如新旧两值不一样
          if (n !== o) {
            if (!o && n) {
              //旧值为空，新值不为空
              flag = 1;
            } else if ((n && o) || (!n && o)) {
              //（旧值、新值都不为空）或（新值为空，旧值不为空）
              ////理论上新值为空，旧值不为空，可以直接清空值并置空列表数据，不用再次查询，但是为了避免出现依赖条件为非必要条件的情况（即使缺乏依赖条件，但过滤出来的数据不为空），所以每次都去重新查询
              //2023-08-01:新值为空，旧值不为空，直接清空值并查询列表数据，所有filter条件都作为必要条件，有一条为空直接置空列表数据（逻辑在getData（）里面）
              flag = 2;
            }
          }
        });
        if (flag == 1) {
          getData();
        } else if (flag == 2) {
          emit('update:value', null);
          getData();
        }
      });
    });

    //不使用watchEffect的原因：避免一些多余的处理，如值的从null到undefined赋值，导致带出值被清空
    watch(
      [() => props.value, () => plainOptions.value],
      (n, o) => {
        const newValue = n[0];
        const oldValue = o[0];
        const newOptions = n[1];
        const oldOptions = o[1];

        const multiple = !!props.config.options.mode;
        //value不使用不恒等是为了避免null和undeined之间的值切换，避免多余的处理
        if (newValue != oldValue || !isEqual(newOptions, oldOptions)) {
          if (props.config.options.valueField && props.config.options.brings?.length) {
            if (newValue) {
              if (multiple) {
                const vals = isString(props.value)
                  ? props.value?.split(',') ?? []
                  : isNumber(props.value)
                  ? [props.value]
                  : [];
                const items = newOptions.filter(f =>
                  vals.some(s => s == f[props.config.options.valueField]),
                );
                emit('bring', items, props.config.options.brings, multiple);
              } else {
                const target = newOptions.find(
                  f => f[props.config.options.valueField] === newValue,
                );
                emit('bring', target, props.config.options.brings, multiple);
              }
            } else {
              //没有值就不用再去列表里查找了，直接返回null
              emit('bring', null, props.config.options.brings, multiple);
            }
          }
        }
      },
      {
        //不能使用immediate，会导致初始化获取到的数组o为空
        deep: true,
      },
    );

    /* watchEffect(() => {
      if (props.config.options.valueField && props.config.options.brings?.length) {
        if (props.value) {
          const target = plainOptions.value.find(
            f => f[props.config.options.valueField] === props.value,
          );
          emit('bring', target, props.config.options.brings);
        } else {
          //没有值就不用再去列表里查找了，直接返回null
          emit('bring', null, props.config.options.brings);
        }
      }
    }); */

    const getPopupContainer = () => document.body;

    const handleFilterOption = (inputValue: string, option: any) => {
      if (['', undefined, null].includes(inputValue)) {
        return true;
      } else {
        return (
          (option.label && toUpper(option.label)?.includes(toUpper(inputValue))) ||
          (option.desc && toUpper(option.desc)?.includes(toUpper(inputValue)))
        );
      }
    };

    return { currentValue, handleUpdateValue, plainOptions, getPopupContainer, handleFilterOption };
  },
});
</script>

<style lang="less" scoped></style>
