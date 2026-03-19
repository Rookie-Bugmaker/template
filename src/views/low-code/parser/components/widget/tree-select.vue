<template>
  <a-tree-select
    :value="value"
    @update:value="v => $emit('update:value', v === undefined ? null : v)"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :multiple="config.options.multiple"
    tree-default-expand-all
    style="width: 100%"
    :tree-data="treeData"
    :field-names="{
      children: 'children',
      label: config.options?.textField || 'label',
      value: config.options?.valueField || 'value',
    }"
    :get-popup-container="getPopupContainer"
    :dropdown-match-select-width="false"
  ></a-tree-select>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, watchEffect } from 'vue';
import { queryByList, queryById } from '@/api/low-code/parser';
import type { QueryObjectType, QueryFilterLogic } from '@/api/low-code/parser';
import { injectParserState } from '@/views/low-code/parser/hooks/useParserState';
import {
  getFilter,
  getWatchDepends,
  hasNullFilterValue,
} from '@/views/low-code/parser/utils/filter';
import { getParams } from '@/views/low-code/parser/utils/params';
import { arrayToTree } from '@/utils/tree-util';
import { isArray } from 'lodash';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    value: {
      type: [String, Number, Array],
      default: null,
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
  emits: ['update:value'],
  setup(props, { emit }) {
    const plainData = ref([]);
    const treeData = ref([]);

    const parserState = injectParserState();

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
      }
    };

    const setParams = () => {
      queryParams.params = getParams(
        props.config.options.dataSource.params,
        props.params?.parentParams,
      );
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
          plainData.value.push(result);
        }
      });
    };

    //如果value有值且不在列表中找不到对应的值的行数据的话，说明该选项被禁用或有其他条件显示查询不出来，应调用按id查询。并把结果集加载到值列表中，使输入框中的描述正常显示，但是值列表里面的选项不能再次选
    //选择此方案是因为value的值可能在初始化时获取不到,切加载列表可能为异步，不能一开始把value值作为过滤条件filter通过or一起查询出来，所以要分步处理,再调一次queryById
    //要排除一下，固定值集不需处理
    watchEffect(() => {
      if (
        props.value &&
        !plainData.value.find(f => f[props.config.options.valueField] === props.value) &&
        props.config.options.optionsType !== 'fixed'
      ) {
        if (isArray(props.value)) {
          console.warn('TODO:暂未支持数组');
        } else {
          setResultById(props.value);
        }
      }
    });

    const getData = () => {
      if (props.config.options.optionsType == 'fixed') {
        treeData.value = props.config.options?.options || [];
      } else {
        setFilter();
        //filter里面的条件都作为必要条件，如果有一个为空，直接将结果集置空
        if (hasNullFilterValue(queryParams.filter)) {
          //免去多余查询，有可能有多个查询（异步），一个返回是空集合（filter里面的条件值为空），一个返回集合不为空（filter里面的条件值不为空），被空集合覆盖了
          plainData.value = [];
        } else {
          setParams();
          queryByList(queryParams).then(({ success, result }) => {
            if (success && result) {
              //如果现有值列表中，有id对应的数据；且新返回的结果集里面没有有id对应的数据，则将keyData加入到值列表中
              const keyData = plainData.value.find(f => f.isKeyData === true);
              if (
                keyData &&
                !result.find(f => f[props.config.options.valueField] === props.value)
              ) {
                result.push(keyData);
              }
              plainData.value = result;

              const valueKey = props.config.options.valueField;
              // const textKey = props.config.options.textField;
              const parentKey = props.config.options.parentField;
              let data = [];
              if (props.config.options.limit === 'leaf') {
                data = result.map(m => {
                  const hasChildren = result.some(s => m[valueKey] === s[parentKey]);
                  const isRoot = m[parentKey] === null;
                  return Object.assign(m, { disabled: hasChildren || isRoot || m.isKeyData });
                });
              } else if (props.config.options.limit === 'notRoot') {
                data = result.map(m => {
                  const isRoot = m[parentKey] === null;
                  return Object.assign(m, { disabled: isRoot || m.isKeyData });
                });
              } else if (props.config.options.limit === 'none') {
                data = result.map(m => {
                  return Object.assign(m, { disabled: m.isKeyData });
                });
              }
              treeData.value = arrayToTree(data, {
                key: valueKey,
                parentKey: parentKey,
              });
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

    const getPopupContainer = () => document.body;

    return { plainData, treeData, getPopupContainer };
  },
});
</script>

<style lang="less" scoped></style>
