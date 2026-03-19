<template>
  <popup-edit
    ref="popupEditRef"
    :value="value"
    @update:value="v => $emit('update:value', v === undefined ? null : v)"
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :multiple="config.options.multiple"
    :options="popupEditOptions"
    @bring="handleBring"
  ></popup-edit>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import PopupEdit from '@/components/popup-edit/index.vue';
import { queryByPage, queryById, queryByIds } from '@/api/low-code/parser';
import type { Options } from '@/components/popup-edit/typing';
import { injectParserState } from '@/views/low-code/parser/hooks/useParserState';
import { getFilter, getWatchDepends } from '@/views/low-code/parser/utils/filter';
import { getParams } from '@/views/low-code/parser/utils/params';

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
    const parserState = injectParserState();

    const popupEditRef = ref(null);

    const reloadModalTableData = () => {
      popupEditRef?.value?.reloadModalTable?.();
    };

    onMounted(() => {
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
              //理论上新值为空，旧值不为空，可以直接清空值并置空列表数据，不用再次查询，但是为了避免出现依赖条件为非必要条件的情况（即使缺乏依赖条件，但过滤出来的数据不为空），所以每次都去重新查询
              //2023-08-01:弹出框初始化的时候不会去加载表格数据,不会像select那样，初始化加载一次，depend值获取到了又加载一次，两个异步加载先后顺序导致异常，所以这里直接触发重新查询即可
              //(而且弹出框每次打开弹窗都会重新加载数据，都是最新数据，不会有问题)
              flag = 2;
            }
          }
        });
        if (flag == 1) {
          reloadModalTableData();
        } else if (flag == 2) {
          emit('update:value', null);
          reloadModalTableData();
        }
      });
    });

    //只能在setup内调用getParams，因为使用了store的数据，写在popupEditOptions会获取不到store数据，也没有动态关联数据，只有用户信息和一些写死的值
    const customParams = getParams(
      props.config.options.dataSource.params,
      props.params?.parentParams,
    );

    const queryConfig = {
      pageId: '',
      objectId: props.config.options.dataSource.objectId,
      type: props.config.options.dataSource.type,
      primaryKey: props.config.options.valueField,
    };

    //根据单选或多选构建根据id获取数据接口
    const queryApi = props.config.options.multiple
      ? queryByIds(queryConfig)
      : queryById(queryConfig);

    const popupEditOptions: Options = {
      valueField: props.config.options.valueField,
      textField: props.config.options.textField,
      modalTitle: props.config.options.modalTitle,
      modalWidth: parseInt(props.config.options.modalWidth),
      searchFormFields: props.config.options.searchFormFields,
      tableColumns: props.config.options.tableColumns,
      getDataById: params => queryApi(params as string, customParams),
      getDataByPage: (params: any) => {
        const pageParams = {
          pageId: '',
          //functionId?: string;
          objectId: props.config.options.dataSource.objectId as string,
          type: props.config.options.dataSource.type as string,
          fuzzyQuery: {
            fields: [],
            value: '',
          },
          params: customParams,
          filter: {
            logic: 'and',
            filters: [],
          },
          sort:
            props.config?.options?.dataSource?.sort?.filter(f => f.field && f.type && f.nulls) ||
            [],
          page: params.page as number,
          pageSize: params.pageSize as number,
        };
        const searchFormFileds = props.config.options.searchFormFields
          ?.map(m => m.field)
          .filter(x => x);
        //弹出框查询参数
        pageParams.filter.filters = Object.keys(params)
          .filter(f => searchFormFileds.includes(f) && params[f]) //是查询表单参数且有值的情况下，才构建查询filter
          .map(m => {
            return {
              field: m,
              operator: 'contains',
              value: params[m],
            };
          });
        //配置的过滤条件
        if (props.config.options.dataSource.filter) {
          pageParams.filter.filters.push(
            getFilter(
              props.config.options.dataSource.filter,
              parserState?.block,
              parserState?.blockConfig,
              props.params?.parentParams,
            ),
          );
          /* pageParams.filter.filters.push(
            ...getFilter(props.config.options.dataSource.filter, parserState?.block).filters[0]
              .filters,
          ); */
        }
        return queryByPage(pageParams as any);
      },
    };

    const handleBring = (val, dataItem) => {
      if (props.config.options.valueField && props.config.options.brings?.length) {
        if (val) {
          emit('bring', dataItem, props.config.options.brings, !!props.config.options.multiple);
        } else {
          emit('bring', null, props.config.options.brings, !!props.config.options.multiple);
        }
      }
    };

    return { popupEditRef, popupEditOptions, handleBring };
  },
  components: {
    PopupEdit,
  },
});
</script>

<style lang="less" scoped></style>
