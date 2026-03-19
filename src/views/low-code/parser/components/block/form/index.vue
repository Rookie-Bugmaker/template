<template>
  <div class="ant-pro-form">
    <a-spin :spinning="state.loading">
      <!-- <div class="ant-pro-form-toolbar">
        <a-space>
          <a-button type="primary" size="small" @click="valid()">保存</a-button>
        </a-space>
      </div> -->
      <a-form
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
              v-show="!itemHiddenCondition(formItem, parserState.data[formKey][formItem.field])"
            ></a-col>
            <a-col
              :span="formItem.layout?.colspan ? colSpan * formItem.layout.colspan : colSpan"
              v-show="!itemHiddenCondition(formItem, parserState.data[formKey][formItem.field])"
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
                <template v-if="parserState.data[formKey]">
                  <widget
                    v-if="
                      [WidgetType.Input].includes(formItem.type) &&
                      formItem?.options?.allowSpaces !== true
                    "
                    :config="formItem"
                    v-model:value.trim="parserState.data[formKey][formItem.field]"
                    :is-create="isCreate"
                    :disabled="
                      formDisabled ||
                      formItem?.options?.disabled ||
                      (formItem?.options?.unmodifiable === true && !isCreate) ||
                      itemDisabledCondition(formItem, parserState.data[formKey][formItem.field])
                    "
                    @bring="handleWidgetBring"
                    :params="params"
                    :rowData="parserState.data[formKey]"
                    @change="handleItemChange(formItem, parserState.data[formKey][formItem.field])"
                  />
                  <widget
                    v-else
                    :config="formItem"
                    v-model:value="parserState.data[formKey][formItem.field]"
                    :is-create="isCreate"
                    :disabled="
                      formDisabled ||
                      formItem?.options?.disabled ||
                      (formItem?.options?.unmodifiable === true && !isCreate) ||
                      itemDisabledCondition(formItem, parserState.data[formKey][formItem.field])
                    "
                    @bring="handleWidgetBring"
                    :params="params"
                    :rowData="parserState.data[formKey]"
                    @change="handleItemChange(formItem, parserState.data[formKey][formItem.field])"
                  />
                </template>
              </a-form-item>
            </a-col>
            <a-col
              v-if="formItem.layout?.rearCol"
              :span="colSpan * formItem.layout.rearCol"
              v-show="!itemHiddenCondition(formItem, parserState.data[formKey][formItem.field])"
            ></a-col>
          </template>
        </a-row>
      </a-form>
    </a-spin>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  reactive,
  watch,
  toRaw,
  onUnmounted,
  nextTick,
  watchEffect,
} from 'vue';
import type { PropType } from 'vue';
import { Form, Modal /* , message */ } from 'ant-design-vue';
import Widget from '../../widget/index.vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { queryById, queryByList } from '@/api/low-code/parser/index';
import { useCud } from '@/views/low-code/parser/hooks/useCud';
import { cloneDeep, isEqual } from 'lodash';
import { useLocales } from '@/views/low-code/parser/hooks/useLocales';
import { WidgetType } from '@/views/low-code/design/typing/index';
import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';
import useCurrentUser from '@/views/low-code/parser/hooks/useCurrentUser';
import { getDateStringByCode } from '@/views/low-code/parser/utils/date';
import { getFilter } from '@/views/low-code/parser/utils/filter';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
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
    //不受relation限制查询数据
    withoutRelation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const formConfig = computed(() => props.config);

    const colSpan = computed(() => 24 / (props.config?.options?.colNum || 2));

    const formDisabled = computed(() => props.config?.editable?.enabled === false);

    const parserState = inject(parserStateInjectKey);

    const primaryKey = computed(() => props.config.dataSource.dataObjectPrimaryKey);

    //const formKey = `data_${props.config.uid}`;
    //有可能多个表单绑定同一个数据源，所以后缀改用数据源ID
    const formKey = `data_${props.config.dataSource.dataObjectId}`;

    const modelData = computed(() => parserState?.data[formKey]);

    const { getByCurrentUser } = useCurrentUser();

    //获取初始化表单数据（置空的数据）
    const getInitData = () => {
      const data = {};
      //构建数据源默认值
      props.config.fieldList.forEach(e => {
        const target = props.config.dataSource.mappingRelations.find(f => f.uid === e.uid);
        //若控件存在数据源设置且设置了编辑字段，则字段和字段值按数据源设置
        if (target && target.editField) {
          data[target.editField] = null;
        } else {
          //若控件在数据源中没有设置，则使用widget_uid作为数据绑定key
          data[`widget_${e.uid}`] = null;
        }
      });
      return data;
    };

    //获取默认值
    const getDefaultData = () => {
      const data = {};
      //构建数据源默认值
      props.config.fieldList.forEach(e => {
        const target = props.config.dataSource.mappingRelations.find(f => f.uid === e.uid);
        //若控件存在数据源设置且设置了编辑字段，则字段和字段值按数据源设置
        if (target && target.editField) {
          if (['string', 'number'].includes(target.defaultValueType)) {
            data[target.editField] = [undefined, ''].includes(target.defaultValue)
              ? null
              : target.defaultValue;
          } else if (target.defaultValueType === 'date') {
            data[target.editField] = getDateStringByCode(target.defaultValue);
          } else if (target.defaultValueType === 'currentUser') {
            data[target.editField] = getByCurrentUser(target.defaultValue);
          } else {
            data[target.editField] = null;
          }
        } else {
          //若控件在数据源中没有设置，则使用widget_uid作为数据绑定key
          data[`widget_${e.uid}`] = null;
        }
      });

      data[primaryKey.value] = null;

      //页面参数赋值
      const params = cloneDeep(props.params);
      delete params['primarykey'];
      Object.assign(data, params);

      return data;
    };

    /**
     * 构建表单数据
     * @param setDefaultData 是否设置默认值（false为清空表单，true为设置默认值）
     */
    const initData = (setDefaultData: boolean) => {
      const data = setDefaultData ? getDefaultData() : getInitData();

      if (parserState.data[formKey]) {
        Object.assign(parserState.data, {
          [formKey]: Object.assign(toRaw(parserState.data[formKey]), data),
        });
      } else {
        parserState.data[formKey] = data;
      }
    };
    //需要提前初始化一次值，赋值给-parserState.data[formKey]
    //先不给默认值，因为不知道是新增还是修改（修改不用给默认值）
    initData(false);

    const eh = useEventHandler();

    const watchEffectStopFn = [];

    //构建计算值
    props.config.fieldList.forEach(e => {
      const target = props.config.dataSource.mappingRelations.find(f => f.uid === e.uid);
      const key = target?.editField ? target.editField : e.uid ? `widget_${e.uid}` : null;
      if (key && target?.defaultValueType === 'computed') {
        nextTick(() => {
          const stop = watchEffect(
            async () => {
              const f = eval(`(async function x(state,modelData,eh){${target.defaultValue}})`);

              if (parserState?.data?.[formKey]) {
                const r = await f(parserState, modelData, eh);
                parserState.data[formKey][key] = r;
              }
            },
            {
              flush: 'post',
            },
          );

          watchEffectStopFn.push(stop);
        });
      }
    });

    onUnmounted(() => {
      //销毁时停用所有监听
      watchEffectStopFn.forEach(s => {
        s();
      });
      //销毁时重置表单数据，避免有遗留数据造成影响
      //但这不是最优解，应该在初始化控件前，把控件所有相关数据源先初始化好
      parserState.data[formKey] = null;
    });

    const rulesRef = reactive({});

    props.config.fieldList.forEach(item => {
      //构建字段绑定关系
      const target = props.config.dataSource.mappingRelations.find(f => f.uid === item.uid);
      if (target && target.editField) {
        item.field = target.editField;
      } else {
        //没有设置关系则用widget_uid作为绑定字段
        item.field = `widget_${item.uid}`;
      }

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

    const { validate, validateInfos } = Form.useForm(
      //parserState.data[formKey],
      computed(() => parserState.data[formKey]),
      rulesRef,
    );

    const getDataById = async (id: string) => {
      //没有id说明是新增
      if (!id && !props.withoutRelation) {
        initData(true);
        return;
      }
      //有id说明是修改，先清空数据
      initData(false); //需要清除一下表单数据再加载，保证下次加载的数据会正确加载（弹出框）
      const ds = props.config.dataSource;
      let query;
      if (props.withoutRelation) {
        const filter = getFilter(
          ds.filter,
          parserState.block,
          parserState.blockConfig,
          props.params?.parentParams,
        );
        query = async (_id: any) => {
          const r = await queryByList({
            pageId: parserState.pageId,
            objectId: ds.objectId || ds.dataObjectId, //如果有设置查询数据源，优先以查询数据源查询
            type: ds.objectId ? ds.type : 'table', //如果有设置查询数据源，使用数据源类型，否则直接使用表类型
            params: [],
            sort: [],
            fuzzyQuery: {
              fields: [],
              value: '',
            },
            filter,
          });
          r.result = r.result[0];
          return r;
        };
      } else {
        query = queryById({
          pageId: parserState.pageId,
          objectId: ds.objectId || ds.dataObjectId, //如果有设置查询数据源，优先以查询数据源查询
          type: ds.objectId ? ds.type : 'table', //如果有设置查询数据源，使用数据源类型，否则直接使用表类型
          primaryKey: ds.dataObjectPrimaryKey,
        });
      }

      try {
        const res = await query(id);
        if (res.success) {
          if (res.result) {
            ////将初始化的表单数据与请求结果合并，然后再赋值（初始化的表单数据中含有一些请求结果数据中不存在的数据）
            //const resultData = Object.assign(getDefaultData(), res.result);
            const resultData = res.result;
            Object.assign(parserState.data, { [formKey]: resultData });
          } else {
            initData(true);
          }
        } else {
          Modal.error({
            title: '获取数据失败',
            content: res.message,
          });
        }
      } catch (err: any) {
        Modal.error({
          title: '获取数据失败',
          content: err.message,
        });
      }
    };

    //表单值会变化（清空重置等操作,不能拿表单的主键id判断），所以根据props.params.primaryKey来判断才是最正确的
    const isCreate = computed(() => !props.params?.primaryKey);

    watch(
      () => props.params,
      (n, o) => {
        if (n && !isEqual(n, o)) {
          getDataById(n.primaryKey);
        }
      },
      { immediate: true },
    );

    const state = reactive({
      loading: false,
    });

    const { insert, update } = useCud(props.config);

    const submit = () => {
      return new Promise((resolve, reject) => {
        const data = cloneDeep(parserState.data[formKey]);
        /*  validate()
          .then(() => { */
        // state.loading = true;
        if (data[primaryKey.value]) {
          update(data).then((res: any) => {
            if (res.success) {
              // message.success('修改成功');
              getDataById(data[primaryKey.value]).then(() => {
                //刷新获取数据后再结束异步事件，防止后面保存后事件调用时获取不到最新数据
                resolve({ title: '修改成功' });
              });
            } else {
              /* Modal.error({
                      title: '修改失败',
                      content: res.message,
                    }); */
              reject({ title: '修改失败', message: res.message });
            }
          });
          /*  .finally(() => {
              state.loading = false;
            }); */
        } else {
          insert(data).then((res: any) => {
            if (res.success) {
              // message.success('新增成功');
              getDataById(res.result?.value).then(() => {
                //刷新获取数据后再结束异步事件，防止后面保存后事件调用时获取不到最新数据
                resolve({ title: '新增成功' });
              });
            } else {
              /* Modal.error({
                      title: '新增失败',
                      content: res.message,
                    }); */
              reject({ title: '新增失败', message: res.message });
            }
          });
          /* .finally(() => {
              state.loading = false;
            }); */
        }
        /* })
          .catch(() => {
            message.warning('校验失败');
          }); */
      });
    };

    const getIsCreate = () => isCreate.value;

    const getModel = () => {
      return parserState.data[formKey];
    };

    expose({
      validate,
      getIsCreate,
      submit,
      getModel,
    });

    const { getLocaleMessage } = useLocales();

    //带出值处理事件
    const handleWidgetBring = (dataItem, brings, multiple) => {
      brings
        ?.filter(f => f.sourceField && f.targetWidget) //过滤掉没有完整配置的项
        ?.forEach(b => {
          const target = props.config.fieldList.find(f => f.uid === b.targetWidget); //这里的targetWidget是表单项的uid
          if (dataItem) {
            // parserState.data[formKey][target.field] = dataItem[b.sourceField];
            if (multiple) {
              parserState.data[formKey][target.field] = dataItem
                .map(m => m[b.sourceField])
                .filter(f => ![null, undefined, ''].includes(f))
                .join(',');
            } else {
              parserState.data[formKey][target.field] = dataItem[b.sourceField];
            }
          } else {
            parserState.data[formKey][target.field] = null;
          }
        });
    };

    const itemDisabledCondition = (config, value) => {
      const condition =
        config.options?.disabledCondition &&
        parserState?.conditions?.find(f => f.uid === config.options?.disabledCondition);
      if (condition) {
        const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
        return f(value, modelData, parserState, eh);
      } else {
        return false;
      }
    };

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

    return {
      WidgetType,
      colSpan,
      formDisabled,
      formKey,
      formConfig,
      parserState,
      validate,
      validateInfos,
      getIsCreate,
      isCreate,
      state,
      submit,
      getModel,
      getLocaleMessage,
      handleWidgetBring,
      itemDisabledCondition,
      itemHiddenCondition,
      handleItemChange,
      renderLabel,
    };
  },
  components: {
    Widget,
  },
});
</script>

<style lang="less" scoped>
.ant-pro-form {
  margin-bottom: 12px;
  background: #fff;
  /*  :deep(.ant-form-item) {
    margin-bottom: 0;
    padding-bottom: 24px;
  } */
  .ant-pro-form-toolbar {
    display: flex;
    justify-content: flex-end;
    height: 42px;
    padding: 0 6px;
    line-height: 42px;
  }
}
</style>
