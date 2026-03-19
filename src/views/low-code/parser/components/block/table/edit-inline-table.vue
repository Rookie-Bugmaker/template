<template>
  <yl-table
    row-key="editRowKey"
    v-bind="$attrs"
    :data-source="tableDataSource"
    :loading="loading || state.loading"
    @reload="$emit('reload')"
  >
    <template #extraLeft>
      <slot name="extraLeft" />
    </template>
    <template #extraRight>
      <slot name="extraRight" />
    </template>
    <template #headerCell="{ title, column }">
      <template v-if="column.options?.required">
        <span class="header-cell-required">{{ renderTitle(title, column?.textFunc) }}</span>
      </template>
      <template v-else>
        <span>{{ renderTitle(title, column?.textFunc) }}</span>
      </template>
    </template>
    <template #bodyCell="{ text, record, index, column }">
      <template
        v-if="
          ![MY_CUSTOM_SHOW_INDEX_KEY, TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY].includes(
            column.dataIndex,
          )
        "
      >
        <template v-if="editableData[editingKey] && editingKey == record.editRowKey">
          <template v-if="config.editable.enabled && config.editable.mode === 'inline'">
            <a-form-item v-bind="validateInfos[column.editDataIndex]" style="margin-top: 24px">
              <widget
                v-if="
                  [WidgetType.Input].includes(column.type) && column?.options?.allowSpaces !== true
                "
                :config="column"
                v-model:value.trim="editableData[editingKey][column.editDataIndex]"
                :is-create="isCreate"
                :disabled="
                  column?.options?.disabled ||
                  (column?.options?.unmodifiable === true && !isCreate) ||
                  itemDisabledCondition(column, editableData[editingKey][column.editDataIndex])
                "
                @bring="handleWidgetBring"
                :params="params"
                @change="handleItemChange(column, editableData[editingKey][column.editDataIndex])"
              />
              <widget
                v-else
                :config="column"
                v-model:value="editableData[editingKey][column.editDataIndex]"
                :is-create="isCreate"
                :disabled="
                  column?.options?.disabled ||
                  (column?.options?.unmodifiable === true && !isCreate) ||
                  itemDisabledCondition(column, editableData[editingKey][column.editDataIndex])
                "
                @bring="handleWidgetBring"
                :params="params"
                @change="handleItemChange(column, editableData[editingKey][column.editDataIndex])"
              />
            </a-form-item>
          </template>
        </template>
        <template v-else>
          <body-cell-renderer
            :text="text"
            :record="record"
            :index="index"
            :column="column"
            v-model:conversionMap="conversionMap"
          />
        </template>
      </template>
      <template v-else-if="column.dataIndex === TABLE_COLUMN_ACTION_KEY">
        <widget
          v-for="item in column.items.filter(
            f => ![MainType.TableEdit, MainType.TableRemove].includes(f.mainType),
          )"
          :key="item.uid"
          :config="item"
          :row-data="record"
        />
        <workflow-button
          v-if="
            config.workflow?.enabled &&
            !(editableData[editingKey] && editingKey == record.editRowKey)
          "
          :config="config"
          :record="record"
          @handle="reload"
        />
        <template v-if="config.editable.enabled">
          <template v-if="config.editable.edit.enabled">
            <template v-if="editableData[editingKey] && editingKey == record.editRowKey">
              <yl-button act-type="save-inline" @click="saveRow(record.editRowKey)"></yl-button>
              <yl-button
                act-type="cancel-inline"
                confirm
                @click="cancelEditRow(record.editRowKey)"
              ></yl-button>
            </template>
            <template v-else>
              <yl-button
                act-type="edit-inline"
                @click="editRow(record.editRowKey)"
                :disabled="
                  (!inWorkflowProcessEditable && isInWorkflowProcess(record)) ||
                  itemDisabledCondition(config.editable.edit, null, record)
                "
              ></yl-button>
            </template>
          </template>
        </template>
        <template
          v-if="
            config.editable.enabled &&
            config.editable.remove.enabled &&
            !(editableData[editingKey] && editingKey == record.editRowKey)
          "
        >
          <template v-if="config.editable.remove.confirm.enabled">
            <yl-button
              act-type="remove-inline"
              confirm
              @click="removeRow(record.editRowKey)"
              :disabled="
                isInWorkflowProcess(record) ||
                itemDisabledCondition(config.editable.remove, null, record)
              "
            ></yl-button>
          </template>
          <template v-else>
            <yl-button
              act-type="remove-inline"
              @click="removeRow(record.editRowKey)"
              :disabled="
                isInWorkflowProcess(record) ||
                itemDisabledCondition(config.editable.remove, null, record)
              "
            ></yl-button>
          </template>
        </template>
      </template>
    </template>
  </yl-table>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  computed,
  reactive,
  ref,
  toRaw,
  watch,
  toRefs,
  nextTick,
  watchEffect,
  onUnmounted,
} from 'vue';
import type { PropType, UnwrapRef } from 'vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { uuid } from '@/utils/unique-key-util';
import { message, Modal, Form } from 'ant-design-vue';
import { cloneDeep, isFunction } from 'lodash';
import { MainType, WidgetType } from '@/views/low-code/design/typing/index';
import { TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY } from '@/views/low-code/design/keys';
import { MY_CUSTOM_SHOW_INDEX_KEY } from '@/utils/hooks/useTableColumn';
import Widget from '../../widget/index.vue';
import BodyCellRenderer from './body-cell-renderer.vue';
import { useCud } from '@/views/low-code/parser/hooks/useCud';
import WorkflowButton from './workflow-button.vue';
import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';
import useCurrentUser from '@/views/low-code/parser/hooks/useCurrentUser';
import { getDateStringByCode } from '@/views/low-code/parser/utils/date';
import { getProcessStatus } from '@/api/workflow/instance/index';
import { findByUserIds } from '@/api/system/user';

export default defineComponent({
  name: 'EditInlineTable',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
    dataSource: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    relation: {
      type: Object,
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
  emits: ['reload'],
  setup(props, { emit, expose }) {
    const parserState = inject(parserStateInjectKey);

    const state = reactive({
      loading: false,
    });
    const editingKey = ref<string>('');
    const editableData: UnwrapRef<Record<string, any>> = reactive({});

    const tableKey = `table_${props.config.uid}`;
    parserState.data[tableKey] = null;

    const { getByCurrentUser } = useCurrentUser();

    const modelData = computed(() => parserState?.data[tableKey]);

    const rulesRef = reactive({});

    props.config.columns.forEach(item => {
      //构建验证
      if (item.options?.required || item?.rules?.length) {
        rulesRef[item.editDataIndex] = [];
        if (item.options?.required) {
          rulesRef[item.editDataIndex].push({
            required: true,
            message: item.options?.requiredMessage || '此项必填',
          });
        }
        if (item?.rules?.length) {
          rulesRef[item.editDataIndex].push(
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

    //借用Form组件作为校验和显示控制
    const { clearValidate, validate, validateInfos } = Form.useForm(
      computed(() => editableData[editingKey.value]),
      rulesRef,
    );

    const parentKeyValue = computed(() =>
      props.relation
        ? parserState.data[props.relation.parentDataKey]?.[props.relation.parentKey]
        : null,
    );

    const getProcessStatusList = (data: any[]) => {
      const ids = data.map(m => m['PROCESS_INSTANCE_ID']).filter(f => f);
      if (ids.length) {
        getProcessStatus(ids.join(',')).then(({ success, result }) => {
          if (success && result) {
            conversionMap['PROCESS_INSTANCE_ID'] = result;
          }
        });
      }
    };

    const userInfoList = (data: any[]) => {
      const targetColumns =
        props.config?.columns?.filter(
          s => s?.bodyCellSlot?.options?.presets?.type === 'user-info',
        ) || [];
      const ids = targetColumns.reduce((a, b) => {
        return a.concat(data?.map(m => m?.[b.dataIndex])?.filter(f => f));
      }, []);
      if (ids?.length) {
        findByUserIds(ids.join(',')).then(res => {
          if (res.success && res.result) {
            conversionMap['USER-INFO-LIST'] = res.result;
          }
        });
      }
    };
    const { dataSource: propsDataSourceRef } = toRefs(props);

    const tableDataSource = ref([]);
    watch(
      propsDataSourceRef,
      n => {
        if (n) {
          tableDataSource.value = n.map(m => {
            return Object.assign(m, { editRowKey: uuid(32) });
          });
          editingKey.value = '';
          //获取流程状态
          getProcessStatusList(n);
          userInfoList(n);
        }
      },
      { immediate: true },
    );

    const primaryKey = computed(() => props.config.dataSource.dataObjectPrimaryKey);

    const isCreate = computed(
      () =>
        !!(editableData?.[editingKey.value] && !editableData[editingKey.value][primaryKey.value]),
    );

    const editButtonConfig = computed(() => {
      return props.config.columns
        .find(f => f.dataIndex === TABLE_COLUMN_ACTION_KEY)
        ?.items.find(f => f.mainType === MainType.TableEdit);
    });

    const removeButtonConfig = computed(() => {
      return props.config.columns
        .find(f => f.dataIndex === TABLE_COLUMN_ACTION_KEY)
        ?.items.find(f => f.mainType === MainType.TableRemove);
    });

    const reload = () => {
      emit('reload');
      editingKey.value = '';
    };

    const { insert, update, remove } = useCud(props.config);

    const submit = {
      addRow: async () => {
        state.loading = true;
        // delete data['language'];
        try {
          const res = await insert(editableData[editingKey.value]);
          if (res.success) {
            message.success('新增成功');
            reload();
          } else {
            Modal.error({
              title: '新增失败',
              content: res.message,
            });
          }
        } catch {
          message.success('系统异常');
        }
        state.loading = false;
      },
      editRow: async () => {
        state.loading = true;
        //delete data['language'];
        try {
          const res = await update(editableData[editingKey.value]);
          if (res.success) {
            message.success('修改成功');
            reload();
          } else {
            Modal.error({
              title: '修改失败',
              content: res.message,
            });
          }
        } catch {
          message.success('系统异常');
        }
        state.loading = false;
      },
      removeRow: async (record: any) => {
        state.loading = true;
        try {
          const res = await remove(record);
          if (res.success) {
            message.success('删除成功');
            reload();
          } else {
            Modal.error({
              title: '删除失败',
              content: res.message,
            });
          }
        } catch {
          message.success('系统异常');
        }
        state.loading = false;
      },
    };

    const initValues = () => {
      const newData = {
        [primaryKey.value]: null,
        editRowKey: null,
      };

      /* props.config.columns.forEach(column => {
        if (['string', 'number'].includes(column.defaultValueType)) {
          newData[column.editDataIndex] = [undefined, ''].includes(column.defaultValue)
            ? null
            : column.defaultValue;
        } else {
          newData[column.editDataIndex] = null;
        }
      }); */
      //必须要有key值才能触发校验
      props.config.columns.forEach(column => {
        const target = props.config.dataSource.mappingRelations.find(f => f.uid === column.uid);
        //若控件存在数据源设置且设置了编辑字段，则字段和字段值按数据源设置
        if (target && target.editField) {
          if (['string', 'number'].includes(target.defaultValueType)) {
            newData[target.editField] = [undefined, ''].includes(target.defaultValue)
              ? null
              : target.defaultValue;
          } else if (target.defaultValueType === 'date') {
            newData[target.editField] = getDateStringByCode(target.defaultValue);
          } else if (target.defaultValueType === 'currentUser') {
            newData[target.editField] = getByCurrentUser(target.defaultValue);
          } else {
            newData[target.editField] = null;
          }
        } else {
          //若控件在数据源中没有设置，则使用widget_uid作为数据绑定key
          if (column.uid) {
            //有uid的才设置，有些列没有uid（如序号列）
            newData[`widget_${column.uid}`] = null;
          }
        }
      });

      newData[primaryKey.value] = null;
      newData['editRowKey'] = uuid(32);

      if (props.relation) {
        newData[props.relation.childKey] = parentKeyValue.value;
      }
      return newData;
    };

    const eh = useEventHandler();

    const watchEffectStopFn = [];

    //构建计算值
    props.config.columns.forEach(column => {
      const target = props.config.dataSource.mappingRelations.find(f => f.uid === column.uid);
      const key =
        target?.editField || target?.viewField || (column.uid ? `widget_${column.uid}` : null);
      if (key && target?.defaultValueType === 'computed') {
        nextTick(() => {
          const stop = watchEffect(
            async () => {
              const f = eval(`(async function x(state,modelData,eh){${target.defaultValue}})`);

              if (editableData?.[editingKey.value]) {
                const r = await f(parserState, modelData, eh);
                editableData[editingKey.value][key] = r;
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
    });

    const addRow = () => {
      //正在修改中，调用新增，则提示先保存
      if (editingKey.value) {
        message.warning('请先保存正在编辑中的行');
        return;
      }
      const initItem = initValues();
      tableDataSource.value.unshift(initItem as any);

      editRow(initItem.editRowKey);
    };

    const editRow = (editRowKey: string) => {
      //正在修改中，调用其他行的编辑，则提示先保存
      if (editingKey.value && editingKey.value !== editRowKey) {
        message.warning('请先保存正在编辑中的行');
        return;
      }
      //清除上次校验信息
      clearValidate();
      editingKey.value = editRowKey;
      editableData[editRowKey] = cloneDeep(
        toRaw(tableDataSource.value.filter((item: any) => editRowKey === item.editRowKey)[0]),
      );

      //赋值给全局data里面的表格数据
      parserState.data[tableKey] = editableData[editRowKey];
    };

    const beforeSaveEvent = props.config?.editable?.beforeSaveEvent;
    const afterSaveEvent = props.config?.editable?.afterSaveEvent;

    const beforeSaveFunc = eval(`(async function bsf (type, state, eh){${beforeSaveEvent}})`);
    const afterSaveFunc = eval(`(async function asf (type, state, eh){${afterSaveEvent}})`);

    const saveRow = async (editRowKey: string) => {
      //Object.assign(dataSource.value.filter(item => editRowKey === item.editRowKey)[0], editableData[editRowKey]);

      try {
        await validate();

        const isCreate = !editableData[editRowKey][primaryKey.value];
        const type = isCreate ? 'insert' : 'update';

        const modelData = getModel();

        const br = await beforeSaveFunc(type, parserState, eh, modelData);
        if (br === false) {
          return;
        }
        if (isCreate) {
          await submit.addRow();
        } else {
          await submit.editRow();
        }
        const ar = await afterSaveFunc(type, parserState, eh, modelData);
        if (ar === false) {
          return;
        }
      } catch {
        message.warning('校验失败');
      }
    };

    const cancelEditRow = (editRowKey: string) => {
      //如果是新增行取消编辑，则直接删除新增行
      if (!editableData[editRowKey][primaryKey.value]) {
        const index = tableDataSource.value.findIndex((item: any) => item.editRowKey == editRowKey);
        if (index > -1) {
          tableDataSource.value.splice(index, 1);
        }
      }
      delete editableData[editRowKey];
      editingKey.value = '';
    };

    const removeRow = (editRowKey: string) => {
      //正在修改中，调用其他行的编辑，则提示先保存
      if (editingKey.value && editingKey.value !== editRowKey) {
        message.warning('请先保存正在编辑中的行');
        return;
      } else {
        //删除修改状态的行
        editingKey.value = '';
      }
      //已存在数据库中的数据
      const target = tableDataSource.value.find((item: any) => item.editRowKey === editRowKey);
      if (target?.[props.config.dataSource.dataObjectPrimaryKey]) {
        submit.removeRow(target);
      }
      //页面中新增的数据（未保存）
      const index = tableDataSource.value.findIndex((item: any) => item.editRowKey == editRowKey);
      if (index > -1) {
        tableDataSource.value.splice(index, 1);
      }
    };

    const getModel = () => {
      return parserState.data[tableKey];
    };

    const hasEditingRow = (): boolean => {
      return !!(editingKey.value && editableData[editingKey.value]);
    };

    //根据editRowKey判断是否为当前编辑行
    const isEditingRow = (editRowKey: string): boolean => {
      return !!(editRowKey === editingKey.value && editableData[editingKey.value]);
    };

    expose({
      addRow,
      getModel,
      hasEditingRow,
      isEditingRow,
      isCreate,
    });

    //带出值处理事件
    const handleWidgetBring = (dataItem, brings, multiple) => {
      if (editableData[editingKey.value]) {
        brings
          ?.filter(f => f.sourceField && f.targetWidget) //过滤掉没有完整配置的项
          ?.forEach(b => {
            const target = props.config.columns.find(f => f.uid === b.targetWidget); //这里的targetWidget是表单项的uid
            if (dataItem) {
              if (multiple) {
                editableData[editingKey.value][target.editDataIndex] = dataItem
                  .map(m => m[b.sourceField])
                  .filter(f => ![null, undefined, ''].includes(f))
                  .join(',');
              } else {
                editableData[editingKey.value][target.editDataIndex] = dataItem[b.sourceField];
              }
            } else {
              editableData[editingKey.value][target.editDataIndex] = null;
            }
          });
      }
    };

    const isInWorkflowProcess = (rowData: any) => {
      return rowData?.['PROCESS_INSTANCE_ID'];
    };

    //流程审批界面（非普通编辑界面）中仍可编辑，仅编辑，不能删除新增（处理人节点）
    const inWorkflowProcessEditable = computed(() => {
      return props.config.inWorkflowProcessEditable || false;
    });

    //值转换map，用于列上的值转换成描述，key是列表代码，value是转换列表（例如：值集id或code转换成对应的描述的列表）
    const conversionMap = reactive({});

    //按钮无法确定当前modelData,只能拿当前行record
    const itemDisabledCondition = (config, value, record = null) => {
      const condition =
        config.options?.disabledCondition &&
        parserState?.conditions?.find(f => f.uid === config.options?.disabledCondition);
      if (condition) {
        const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
        const data = record ? record : modelData;
        return f(value, data, parserState, eh);
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

    const renderTitle = (title, textFunc) => {
      const t = isFunction(title) ? title() : title;
      if (textFunc) {
        const f = eval(`(function x (text, state){${textFunc}})`);
        const r = f(t, parserState);
        return r ? r : t;
      } else {
        return t;
      }
    };

    return {
      isFunction,
      MainType,
      WidgetType,
      TABLE_COLUMN_ACTION_KEY,
      TABLE_COLUMN_ROW_INDEX_KEY,
      MY_CUSTOM_SHOW_INDEX_KEY,
      tableDataSource,
      editButtonConfig,
      removeButtonConfig,
      reload,
      state,
      editingKey,
      editableData,
      parentKeyValue,
      isCreate,
      addRow,
      editRow,
      saveRow,
      cancelEditRow,
      removeRow,
      validateInfos,
      getModel,
      hasEditingRow,
      isEditingRow,
      handleWidgetBring,
      isInWorkflowProcess,
      inWorkflowProcessEditable,
      conversionMap,
      itemDisabledCondition,
      handleItemChange,
      renderTitle,
    };
  },
  components: { Widget, BodyCellRenderer, WorkflowButton },
});
</script>
<style lang="less" scoped></style>
