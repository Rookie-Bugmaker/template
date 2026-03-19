<template>
  <a-drawer
    :open="open"
    title="数据源过滤条件设置"
    :width="800"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <template v-if="designerState.currentConfig?.options?.dataSource">
      <template
        v-for="(item, index) in designerState.currentConfig?.options?.dataSource?.filter?.filters"
        :key="index"
      >
        <logic-title
          v-model:value="designerState.currentConfig.options.dataSource.filter.logic"
          :index="index"
        />
        <group-wrapper :title="`条件组${index + 1}`" style="margin-bottom: 8px">
          <template #extra>
            <span style="margin-right: 10px">组内逻辑</span>
            <a-switch
              v-model:checked="item.logic"
              checked-value="and"
              un-checked-value="or"
              checked-children="且"
              un-checked-children="或"
            />
            <delete-outlined
              style="margin-left: 20px"
              @click="
                () => designerState.currentConfig.options.dataSource.filter.filters.splice(index, 1)
              "
            />
          </template>
          <div v-for="(cItem, cIndex) in item.filters" :key="cIndex">
            <logic-sub-title
              :value="item.logic"
              :index="cIndex"
              @remove-filter="() => item.filters.splice(cIndex, 1)"
            />

            <data-source-field-selector
              v-model:value="cItem.field"
              :fieldList="state.fieldList"
              @change="
                v => (cItem.type = state.fieldList.find(f => f.fieldCode === v)?.fieldType || null)
              "
              style="width: 25%"
              placeholder="数据源字段"
            ></data-source-field-selector>
            <a-select
              v-model:value="cItem.operator"
              allow-clear
              :dropdown-match-select-width="false"
              style="width: 15%"
              placeholder="关联条件"
            >
              <a-select-option
                v-for="item in cItem.type
                  ? OPERATOR_LIST.filter(f => f.type.includes(cItem.type))
                  : []"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
            <a-select
              v-model:value="cItem.valueType"
              :dropdown-match-select-width="false"
              style="width: 15%"
              placeholder="值类型"
              @change="v => handleChangeValueType(v, cItem)"
            >
              <a-select-option value="string">字符串</a-select-option>
              <a-select-option value="number">数字</a-select-option>
              <a-select-option value="block">块字段</a-select-option>
              <a-select-option value="currentUser">用户信息</a-select-option>
              <a-select-option value="parentParams">父页面参数</a-select-option>
            </a-select>
            <block-field-selector
              v-if="cItem.valueType === 'block'"
              v-model:value="cItem.value"
              style="width: 35%"
              placeholder="请选择值字段"
            />
            <a-input-number
              v-else-if="cItem.valueType === 'number'"
              v-model:value="cItem.value"
              style="width: 35%"
              placeholder="请输入数字值"
            ></a-input-number>
            <a-select
              v-else-if="cItem.valueType === 'currentUser'"
              v-model:value="cItem.value"
              allow-clear
              style="width: 35%"
              :dropdown-match-select-width="false"
            >
              <a-select-option value="userId">当前用户ID</a-select-option>
              <a-select-option value="roleId">当前角色ID</a-select-option>
              <a-select-option value="orgId">当前数据组织ID</a-select-option>
            </a-select>
            <a-input
              v-else-if="cItem.valueType === 'parentParams'"
              v-model:value="cItem.value"
              allow-clear
              style="width: 35%"
              placeholder="请输入父页面参数键"
            ></a-input>
            <a-input
              v-else
              v-model:value="cItem.value"
              allow-clear
              style="width: 35%"
              placeholder="请输入字符值"
            ></a-input>
            <a-tooltip
              placement="topLeft"
              title="必须的条件，当值为空时不会触发查询;可选的条件，当值为空时仍会触发查询"
            >
              <a-switch
                v-model:checked="cItem.optional"
                checked-children="可选"
                un-checked-children="必须"
                style="width: 8%; margin: 0 1%"
              />
            </a-tooltip>
          </div>
          <a-button type="link" style="padding: 0" @click="addFilter(item.filters)">
            <template #icon><plus-outlined /></template>
            添加条件
          </a-button>
        </group-wrapper>
      </template>
      <a-button type="dashed" block @click="addGroup">
        <template #icon><plus-outlined /></template>
        添加条件组
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, inject } from 'vue';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';
import DataSourceFieldSelector from '../data-source-field-selector.vue';
import { useLocales } from '@/views/low-code/design/hooks/useLocales';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { FieldType, OPERATOR_LIST } from '@/views/low-code/design/typing/index';

import GroupWrapper from './group-wrapper.vue';
import LogicTitle from './logic-title.vue';
import LogicSubTitle from './logic-sub-title.vue';
import BlockFieldSelector from './block-field-selector.vue';

export default defineComponent({
  name: '',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  emit: ['update:open'],
  setup(props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    const state = reactive({
      fieldList: [],
    });

    const closeDrawer = () => {
      emit('update:open', false);
    };

    const getFieldList = async (type: string, objectId: string) => {
      if (type === 'table') {
        const { success, result } = await getTableById(objectId);
        if (success && result) {
          return result.fieldList;
        }
      }
      if (type === 'view') {
        const { success, result } = await getViewById(objectId);
        if (success && result) {
          return result.fieldList;
        }
      }
      return [];
    };

    watch(
      () => props.config.options.dataSource.objectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList(props.config.options.dataSource.type, n);
          state.fieldList = fieldList;
        }
      },
      { immediate: true },
    );

    const addGroup = () => {
      //版本差异,缺少属性,旧版本没有filter这个属性
      if (!designerState.currentConfig.options.dataSource?.filter) {
        designerState.currentConfig.options.dataSource['filter'] = {
          logic: 'and',
          filters: [],
        };
      }
      designerState.currentConfig.options.dataSource.filter.filters.push({
        logic: 'and',
        filters: [],
      });
    };

    const addFilter = (filters: any[]) => {
      filters.push({
        field: null,
        type: null,
        operator: null,
        valueType: 'string',
        value: null,
        optional: false,
      });
    };

    const handleChangeValueType = (v, cItem: any) => {
      if (v === 'block') {
        cItem.value = { block: null, field: null };
      } else {
        cItem.value = null;
      }
    };

    const { getLocaleMessage } = useLocales();

    return {
      FieldType,
      OPERATOR_LIST,
      designerState,
      state,
      closeDrawer,
      getLocaleMessage,
      addGroup,
      addFilter,
      handleChangeValueType,
    };
  },
  components: {
    DataSourceFieldSelector,
    GroupWrapper,
    LogicTitle,
    LogicSubTitle,
    BlockFieldSelector,
  },
});
</script>

<style lang="less" scoped></style>
