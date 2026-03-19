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
        <body-cell-renderer
          :text="text"
          :record="record"
          :index="index"
          :column="column"
          v-model:conversionMap="conversionMap"
        />
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
          v-if="config.workflow?.enabled"
          :config="config"
          :record="record"
          @handle="reload"
        />
        <template v-if="config.editable.enabled">
          <template v-if="config.editable.edit.enabled">
            <!-- <widget :config="editButtonConfig" @click="editRow(record)" /> -->
            <yl-button
              act-type="edit-inline"
              @click="editRow(record)"
              :disabled="itemDisabledCondition(config.editable.edit, null, record)"
            ></yl-button>
          </template>
          <template v-if="config.editable.remove.enabled">
            <template v-if="config.editable.remove.confirm.enabled">
              <!-- <a-popconfirm
                :title="
                  config.editable.remove.confirm.title
                    ? config.editable.remove.confirm.title
                    : '确定删除？'
                "
                @confirm="removeRow(record)"
              >
                <widget :config="removeButtonConfig" />
              </a-popconfirm> -->
              <yl-button
                act-type="remove-inline"
                confirm
                @click="removeRow(record)"
                :disabled="
                  isInWorkflowProcess(record) ||
                  itemDisabledCondition(config.editable.remove, null, record)
                "
              ></yl-button>
            </template>
            <template v-else>
              <!-- <widget :config="removeButtonConfig" @click="removeRow(record)" /> -->
              <yl-button
                act-type="remove-inline"
                @click="removeRow(record)"
                :disabled="
                  isInWorkflowProcess(record) ||
                  itemDisabledCondition(config.editable.remove, null, record)
                "
              ></yl-button>
            </template>
          </template>
        </template>
      </template>
    </template>
  </yl-table>
  <d-modal
    v-model:open="editModalState.open"
    :title="config.editable.popup.title"
    :width="config.editable.popup.width"
    :confirmLoading="childPageLoading"
    @ok="handleClickModalOk"
    @cancel="reload"
    :okButtonProps="{
      disabled: isInWorkflowProcessModal,
    }"
    :maximizable="{ default: !!config.editable.popup.defaultMaximize }"
  >
    <child-page
      ref="childPageRef"
      :config="childPageConfig"
      :params="
        relation
          ? {
              primaryKey: editModalState.primaryKey,
              [relation.childKey]: parentKeyValue,
              parentParams: editModalState.parentParams,
            }
          : {
              primaryKey: editModalState.primaryKey,
              parentParams: editModalState.parentParams,
            }
      "
    />
  </d-modal>
</template>

<script lang="ts" setup>
//因为循环引用，template中类型获取不到（看着不爽:(），所以这里使用了setup语法糖
import {
  computed,
  reactive,
  ref,
  watch,
  toRefs,
  inject,
  defineAsyncComponent,
  nextTick,
} from 'vue';
import type { PropType } from 'vue';
import { uuid } from '@/utils/unique-key-util';
import { message } from 'ant-design-vue';
import { isFunction, cloneDeep } from 'lodash';
import { MainType } from '@/views/low-code/design/typing/index';
import { TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY } from '@/views/low-code/design/keys';
import { MY_CUSTOM_SHOW_INDEX_KEY } from '@/utils/hooks/useTableColumn';
import Widget from '../../widget/index.vue';
import DModal from '../../common/modal.vue';
import BodyCellRenderer from './body-cell-renderer.vue';
import { useCud } from '@/views/low-code/parser/hooks/useCud';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import WorkflowButton from './workflow-button.vue';
import { getProcessStatus } from '@/api/workflow/instance/index';
import { disabledChildPage, onlyEditChildPage } from '@/views/low-code/parser/utils/disable-view';
import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';

import { getFilterValue } from '@/views/low-code/parser/utils/filter';
import { findByUserIds } from '@/api/system/user';

//循环引用，需要终点（异步引入，表示不是必需的，可作为终点）
const ChildPage = defineAsyncComponent(() => import('@/views/low-code/parser/components/page.vue'));

const props = defineProps({
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
});
const emit = defineEmits(['reload']);

const parserState = inject(parserStateInjectKey);

const parentKeyValue = computed(() =>
  props.relation
    ? parserState.data[props.relation.parentDataKey]?.[props.relation.parentKey]
    : null,
);

const editModalState = reactive({
  open: false,
  primaryKey: '',
  parentParams: {},
});

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
    props.config?.columns?.filter(s => s?.bodyCellSlot?.options?.presets?.type === 'user-info') ||
    [];
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
      //获取流程状态
      getProcessStatusList(n);
      userInfoList(n);
    }
  },
  { immediate: true },
);

const primaryKey = computed(() => props.config.dataSource.dataObjectPrimaryKey);

/* const editButtonConfig = computed(() => {
  return props.config.columns
    .find(f => f.dataIndex === TABLE_COLUMN_ACTION_KEY)?.items.find(f => f.mainType === MainType.TableEdit);
}); */

/* const removeButtonConfig = computed(() => {
  return props.config.columns
    .find(f => f.dataIndex === TABLE_COLUMN_ACTION_KEY)?.items.find(f => f.mainType === MainType.TableRemove);
}); */

const state = reactive({
  loading: false,
});

const reload = () => {
  emit('reload');
};

const { remove } = useCud(props.config);

const removeRow = (record: any) => {
  state.loading = true;
  remove(record)
    .then((res: any) => {
      if (res.success) {
        message.success('删除成功');
        reload();
      } else {
        message.error(res.message);
      }
    })
    .finally(() => {
      state.loading = false;
    });
};

const setParentParams = () => {
  const parentParamList =
    props.config?.editable?.popup?.params?.map(({ key, valueType, value }) => {
      return {
        key,
        value: getFilterValue({
          valueType,
          value,
          blockRefMap: parserState?.block,
          blockConfigMap: parserState?.blockConfig,
        }),
      };
    }) || [];
  editModalState.parentParams = parentParamList.reduce((a, b) => {
    a[b.key] = b.value;
    return a;
  }, {});
};

const addRow = () => {
  editModalState.open = true;
  editModalState.primaryKey = '';
  setParentParams();
};

const editRow = (record: any) => {
  editModalState.open = true;
  editModalState.primaryKey = record[primaryKey.value];
  setParentParams();
};

const childPageRef = ref(null);
const childPageLoading = ref(false);

const beforeSaveEvent = props.config?.editable?.beforeSaveEvent;
const afterSaveEvent = props.config?.editable?.afterSaveEvent;

const beforeSaveFunc = eval(`(async function bsf (type, state, eh){${beforeSaveEvent}})`);
const afterSaveFunc = eval(`(async function asf (type, state, eh){${afterSaveEvent}})`);

const eh = useEventHandler();

const handleClickModalOk = async () => {
  childPageLoading.value = true;
  const isCreate = childPageRef.value?.isCreate();
  const type = isCreate ? 'insert' : 'update';

  const br = await beforeSaveFunc(type, parserState, eh);
  if (br === false) {
    childPageLoading.value = false;
    return;
  }

  const result = await childPageRef.value?.savePageData();

  //等待重新渲染，防止后面的方法拿不到ref
  await nextTick();

  const ar = await afterSaveFunc(type, parserState, eh);
  if (ar === false) {
    childPageLoading.value = false;
    return;
  }

  childPageLoading.value = false;
  if (props.config?.editable?.popup?.closeAfterSave && result) {
    editModalState.open = false;
    reload();
  }
};

const isInWorkflowProcess = (rowData: any) => {
  return rowData?.['PROCESS_INSTANCE_ID'];
};

const isInWorkflowProcessModal = computed(() => {
  const rowData = tableDataSource.value?.find(
    f => f[primaryKey.value] === editModalState.primaryKey,
  );
  return rowData?.['PROCESS_INSTANCE_ID'];
});

const childPageConfig = computed(() => {
  const childConfig = parserState.configTrees.find(
    f => f.uid === props.config.editable.popup.configTreeId,
  );

  if (isInWorkflowProcessModal.value) {
    const copyChildConfig = cloneDeep(childConfig);
    //流程审批界面（非普通编辑界面）中仍可编辑，仅编辑，不能删除新增（处理人节点）
    const inWorkflowProcessEditable = props.config.inWorkflowProcessEditable || false;
    copyChildConfig.children = inWorkflowProcessEditable
      ? onlyEditChildPage(copyChildConfig.children)
      : disabledChildPage(copyChildConfig.children);
    return copyChildConfig;
  } else {
    return childConfig;
  }
});

//值转换map，用于列上的值转换成描述，key是列表代码，value是转换列表（例如：值集id或code转换成对应的描述的列表）
const conversionMap = reactive({});

const itemDisabledCondition = (config, value, record) => {
  const condition =
    config.options?.disabledCondition &&
    parserState?.conditions?.find(f => f.uid === config.options?.disabledCondition);
  if (condition) {
    const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
    return f(value, record, parserState, eh);
  } else {
    return false;
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

defineExpose({
  addRow,
});
</script>

<style lang="less" scoped></style>
