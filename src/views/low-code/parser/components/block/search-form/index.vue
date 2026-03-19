<template>
  <div class="ant-pro-table-search">
    <a-form
      class="designer-form"
      :layout="config.options.layout"
      :labelAlign="config.options.labelAlign"
      :labelCol="{
        span: config.options.itemRatio[0],
      }"
      :wrapperCol="{
        span: config.options.itemRatio[1],
      }"
    >
      <a-row :gutter="config.options.gutter">
        <template v-for="formItem in config.fieldList" :key="formItem.uid">
          <a-col
            v-if="formItem.layout?.frontCol"
            :span="colSpan * formItem.layout.frontCol"
            v-show="!itemHiddenCondition(formItem, parserState.data[searchFormKey][formItem.field])"
          ></a-col>
          <a-col
            :span="formItem.layout?.colspan ? colSpan * formItem.layout.colspan : colSpan"
            v-show="!itemHiddenCondition(formItem, parserState.data[searchFormKey][formItem.field])"
          >
            <a-form-item
              :label="renderLabel(formItem.label, formItem.textFunc)"
              v-bind="validateInfos[formItem.field]"
              :labelCol="
                formItem.layout?.itemRatio
                  ? {
                      span: formItem.layout?.itemRatio?.[0],
                    }
                  : null
              "
              :wrapperCol="
                formItem.layout?.itemRatio
                  ? {
                      span: formItem.layout?.itemRatio?.[1],
                    }
                  : null
              "
            >
              <widget
                v-if="
                  [WidgetType.Input].includes(formItem.type) &&
                  formItem?.options?.allowSpaces !== true
                "
                :config="formItem"
                v-model:value.trim="parserState.data[searchFormKey][formItem.field]"
                @bring="handleWidgetBring"
                :disabled="formItem?.options?.disabled || disabledObj[formItem.field]"
                :rowData="parserState.data[searchFormKey]"
                @change="
                  handleItemChange(formItem, parserState.data[searchFormKey][formItem.field])
                "
              />
              <widget
                v-else
                :config="formItem"
                v-model:value="parserState.data[searchFormKey][formItem.field]"
                @bring="handleWidgetBring"
                :disabled="formItem?.options?.disabled || disabledObj[formItem.field]"
                :rowData="parserState.data[searchFormKey]"
                @change="
                  handleItemChange(formItem, parserState.data[searchFormKey][formItem.field])
                "
              />
            </a-form-item>
          </a-col>
          <a-col
            v-if="formItem.layout?.rearCol"
            :span="colSpan * formItem.layout.rearCol"
            v-show="!itemHiddenCondition(formItem, parserState.data[searchFormKey][formItem.field])"
          ></a-col>
        </template>
        <a-col flex="auto">
          <a-form-item :wrapper-col="24" class="search-form-query-item">
            <a-space>
              <yl-button
                act-type="search"
                html-type="submit"
                @click="handleClickSearch"
              ></yl-button>
              <yl-button act-type="reset" @click="resetFields"></yl-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="config.options.gutter">
        <a-col :span="24">
          <a-form-item :wrapper-col="24" class="search-form-query-item">
            <a-space>
              <yl-button
                act-type="search"
                html-type="submit"
                @click="handleClickSearch"
              ></yl-button>
              <yl-button act-type="reset" @click="resetFields"></yl-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row> -->
    </a-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  inject,
  nextTick,
  watchEffect,
  onUnmounted,
} from 'vue';
import type { PropType } from 'vue';
import { Form, message } from 'ant-design-vue';
import Widget from '../../widget/index.vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { BlockType, WidgetType } from '@/views/low-code/design/typing/index';
import { useLocales } from '@/views/low-code/parser/hooks/useLocales';
import useCurrentUser from '@/views/low-code/parser/hooks/useCurrentUser';
import { cloneDeep } from 'lodash';
import { getDateStringByCode } from '@/views/low-code/parser/utils/date';
import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';

export default defineComponent({
  name: 'SearchForm',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
  },
  setup(props, { expose }) {
    const formConfig = computed(() => props.config);

    const colSpan = computed(() => 24 / (props.config?.options?.colNum || 2));

    /* //除去查询表单其他过滤条件的列宽后，表单剩余列宽，没有剩余就返回一整行的列宽
    const surplusColSpan = computed(() => {
      // 表单列数
      const colNum = props.config?.options?.colNum || 2;
      // 表单设置的每个列的span
      const formItemDefaultSpan = colSpan.value;
      //遍历每个表单项，获取表单每个项占的span,前占位和后占位列占的span
      const spanArr = formConfig.value.fieldList
        .map(item => {
          const colArr = [];
          //获取表单项是否跨列
          const itemColspan = item?.layout?.colspan || null;
          //如果跨列且跨列数小于等于表单设置的列数，则此表单项占的span等于跨列数*表单设置的列span ，否则等于表单设置的列span
          const realItemSpan =
            itemColspan !== null && itemColspan <= colNum
              ? itemColspan * formItemDefaultSpan
              : formItemDefaultSpan;

          //将占位列与表单项span按顺序加入到数组中

          //每个前占位数列span等于表单设置的列span
          for (let i = 0; i < item?.layout?.frontCol || 0; i++) {
            colArr.push(formItemDefaultSpan);
          }
          //表单项的span
          colArr.push(realItemSpan);
          //每个后占位数列span等于表单设置的列span
          for (let i = 0; i < item?.layout?.rearCol || 0; i++) {
            colArr.push(formItemDefaultSpan);
          }

          return colArr;
        })
        //将表单项的span和占位列的span按顺序合并成一个数组
        .reduce((a, b) => {
          return a.concat(b);
        }, []);

      //计算最后一行占用的span
      //最后一行占用span起始值是0
      let rowOccupySpan = 0;
      spanArr.forEach(e => {
        //前一项与后一项相加，不超过列span最大值24，占用span等于前一项加后一项，否则换行，占用span等于后一项
        rowOccupySpan = rowOccupySpan + e > 24 ? e : rowOccupySpan + e;
      });

      //最后一行占用的span等于24，则剩余列宽24，否则由最大span值24减去最后一行占用的span,得出剩余列宽
      return rowOccupySpan === 24 ? 24 : 24 - rowOccupySpan;
    }); */

    const parserState = inject(parserStateInjectKey);

    const searchFormKey = `searchForm_${props.config.uid}`;

    const modelData = computed(() => parserState?.data[searchFormKey]);

    const { getByCurrentUser } = useCurrentUser();

    const eh = useEventHandler();

    //获取默认值
    const getDefaultData = () => {
      //构建表单数据
      const data = {};
      //构建表单字段数据(默认值)
      props.config.fieldList.forEach(async e => {
        const target = props.config.searchSetting.mappingRelations.find(f => f.uid === e.uid);
        if (target && (target.viewField || target.isCustomParam)) {
          //查询块的控件直接通过widget_uid作为数据绑定key，因为查询块可能存在一个field绑定两个控件（比如创建时间，要大于等于，又要小于等于，所以不能通过字段来绑定）
          if (['string', 'number'].includes(target.defaultValueType)) {
            data[`widget_${e.uid}`] = [undefined, ''].includes(target.defaultValue)
              ? null
              : target.defaultValue;
          } else if (target.defaultValueType === 'date') {
            data[`widget_${e.uid}`] = getDateStringByCode(target.defaultValue);
          } else if (target.defaultValueType === 'currentUser') {
            data[`widget_${e.uid}`] = getByCurrentUser(target.defaultValue);
          } else if (target.defaultValueType === 'func') {
            // data[`widget_${e.uid}`] = r;
            //异步方式获取值的话，需要直接将值给到数据源
            const r = await eval(`(async function x(state,eh){${target.defaultValue}})`)(
              parserState,
              eh,
            );
            if (parserState.data[searchFormKey]) {
              parserState.data[searchFormKey][`widget_${e.uid}`] = r;
            }
          } else {
            data[`widget_${e.uid}`] = null;
          }
        } else {
          //若控件在数据源中没有设置，则使用widget_uid作为数据绑定key
          data[`widget_${e.uid}`] = null;
        }
      });
      return data;
    };

    if (parserState.data[searchFormKey]) {
      Object.assign(parserState.data, {
        [searchFormKey]: Object.assign(parserState.data[searchFormKey], getDefaultData()),
      });
    } else {
      parserState.data[searchFormKey] = getDefaultData();
    }

    const rulesRef = reactive({});

    //构建字段绑定关系
    props.config.fieldList.forEach(item => {
      //查询块的控件直接通过widget_uid作为数据绑定key
      item.field = `widget_${item.uid}`;

      //构建验证
      if (item.options?.required || item?.rules?.length) {
        rulesRef[item.field] = [];
        if (item.options?.required) {
          rulesRef[item.field].push({
            required: true,
            message: item.options?.requiredMessage || '此项必填',
          });
        }
        if (item?.rules?.length) {
          rulesRef[item.field].push(
            ...(item?.rules?.map(m => {
              const x = cloneDeep(m);
              if (!x.enabledPattern) {
                delete x['pattern'];
              }
              if (!x.enabledValidator) {
                delete x['validator'];
              } else {
                const f = eval(
                  `(async function x (rule, value, callback, state, modelData){${x['validator']}})`,
                );
                x['validator'] = async function v(rule, value, callback) {
                  return await f(rule, value, callback, parserState, modelData);
                };
              }
              return x;
            }) || []),
          );
        }
      }
    });

    const { /* resetFields, */ validate, validateInfos } = Form.useForm(
      // parserState.data[searchFormKey],
      computed(() => parserState.data[searchFormKey]),
      rulesRef,
    );

    //重置查询参数不使用useForm自带的resetFields，因为默认值可能是函数或者时间，如当前时间，重置查询参数应当获取最新的默认值（最新的当前时间）
    const resetFields = () => {
      Object.assign(parserState.data, {
        [searchFormKey]: Object.assign(parserState.data[searchFormKey], getDefaultData()),
      });
    };

    //获取与查询块关联的表格
    const getSearchTargets = () => {
      const searchObjectId = props.config.searchSetting.objectId;
      return (
        (Array.from(props.blockMap.values()) as any[])
          .filter(f => f.type == BlockType.Table && f.dataSource.objectId == searchObjectId)
          .map(m => m.uid) || []
      );
    };

    const handleClickSearch = () => {
      validate()
        .then(() => {
          getSearchTargets().forEach(f => {
            parserState?.block?.get(f)?.reload();
          });
        })
        .catch(() => {
          message.warning('校验失败');
        });
    };

    const { getLocaleMessage } = useLocales();

    //带出值处理事件
    const handleWidgetBring = (dataItem, brings, multiple) => {
      brings
        ?.filter(f => f.sourceField && f.targetWidget) //过滤掉没有完整配置的项
        ?.forEach(b => {
          const target = props.config.fieldList.find(f => f.uid === b.targetWidget); //这里的targetWidget是表单项的uid
          if (dataItem) {
            // parserState.data[searchFormKey][target.field] = dataItem[b.sourceField];
            if (multiple) {
              parserState.data[searchFormKey][target.field] = dataItem
                .map(m => m[b.sourceField])
                .filter(f => ![null, undefined, ''].includes(f))
                .join(',');
            } else {
              parserState.data[searchFormKey][target.field] = dataItem[b.sourceField];
            }
          } else {
            parserState.data[searchFormKey][target.field] = null;
          }
        });
    };

    const watchEffectStopFn = [];

    //先在查询表单的item禁用上试用对象这种方式，屏蔽原来的方法返回值判断禁用（itemDisabledCondition）
    const disabledObj = reactive({});

    nextTick(() => {
      props.config.fieldList.forEach(e => {
        //前面已经将全部field转换成`widget_${item.uid}`这样的形式，这里直接用field即可
        disabledObj[e.field] = false;
        const condition =
          e.options?.disabledCondition &&
          parserState?.conditions?.find(f => f.uid === e.options?.disabledCondition);
        if (condition) {
          const stop = watchEffect(
            async () => {
              const f = eval(`(async function x (value, modelData, state, eh){${condition.func}})`);

              const r = await f(
                parserState.data?.[searchFormKey]?.[e.field],
                modelData,
                parserState,
                eh,
              );
              disabledObj[e.field] = r;
            },
            {
              flush: 'post',
            },
          );

          watchEffectStopFn.push(stop);
        }
      });
    });

    onUnmounted(() => {
      //销毁时停用所有监听
      watchEffectStopFn.forEach(s => {
        s();
      });
    });

    /* const itemDisabledCondition = (config, value) => {
      const condition =
        config.options?.disabledCondition &&
        parserState?.conditions?.find(f => f.uid === config.options?.disabledCondition);
      if (condition) {
        const f = eval(`(function x (value, modelData, state){${condition.func}})`);
        return f(value, modelData, parserState)
      } else {
        return false;
      }
    }; */

    const itemHiddenCondition = (config, value) => {
      const condition =
        config.options?.hiddenCondition &&
        parserState?.conditions?.find(f => f.uid === config.options?.hiddenCondition);
      if (condition) {
        const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
        return f(value, modelData, parserState, eh);
      } else {
        return false;
      }
    };

    const handleItemChange = (config, value) => {
      const changeFunc = config.options?.changeFunc;
      if (changeFunc) {
        const f = eval(`(function x (value, modelData, state, eh){${changeFunc}})`);
        return f(value, modelData, parserState, eh);
      } else {
        return;
      }
    };

    const renderLabel = (label, textFunc) => {
      const t = getLocaleMessage(label);
      if (textFunc) {
        const f = eval(`(function x (text, modelData, state){${textFunc}})`);
        const r = f(t, modelData, parserState);
        return r ? r : t;
      } else {
        return t;
      }
    };

    const getModel = () => {
      return parserState.data[searchFormKey];
    };

    expose({ validate, getModel });

    return {
      WidgetType,
      colSpan,
      //surplusColSpan,
      formConfig,
      parserState,
      searchFormKey,
      resetFields,
      validate,
      validateInfos,
      handleClickSearch,
      getLocaleMessage,
      handleWidgetBring,
      disabledObj,
      // itemDisabledCondition,
      itemHiddenCondition,
      handleItemChange,
      renderLabel,
      getModel,
    };
  },
  components: {
    Widget,
  },
});
</script>

<style lang="less" scoped>
.designer-form {
  /*  :deep(.ant-form-item) {
    margin-bottom: 0;
    padding-bottom: 24px;
  } */
}
</style>
