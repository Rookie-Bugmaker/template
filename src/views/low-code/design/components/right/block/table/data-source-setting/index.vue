<template>
  <a-drawer
    :open="open"
    title="表格-数据源设置"
    :width="1160"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <a-row type="flex" :gutter="[8, 0]">
      <a-col flex="220px" style="height: 100%">
        <a-card title="数据源" size="small" :bordered="false">
          <a-form :model="tableConfig.dataSource" layout="vertical">
            <a-form-item label="查询-数据源类型">
              <a-radio-group
                v-model:value="tableConfig.dataSource.type"
                button-style="solid"
                size="default"
              >
                <a-radio-button value="table">表结构</a-radio-button>
                <a-radio-button value="view">自定义SQL</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="查询-数据源">
              <data-source-popedit
                v-model:value="tableConfig.dataSource.objectId"
                :data-source-type="tableConfig.dataSource.type"
                :allow-cross-group="true"
                size="middle"
              />
            </a-form-item>
            <a-form-item label="编辑/删除-数据源">
              <data-source-popedit
                v-model:value="tableConfig.dataSource.dataObjectId"
                data-source-type="table"
                :allow-cross-group="true"
                size="middle"
              />
            </a-form-item>
            <a-form-item label="编辑/删除-数据源-主键">
              <a-input
                v-model:value="tableConfig.dataSource.dataObjectPrimaryKey"
                size="middle"
                :disabled="true"
              />
            </a-form-item>
            <a-form-item label="增删改-前后置增强">
              <a-input
                v-model:value="tableConfig.dataSource.beanName"
                size="middle"
                placeholder="beanName"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col flex="auto" style="height: 100%">
        <a-card title="列与数据源字段关系" size="small" :bordered="false">
          <a-table
            :columns="columns"
            :data-source="tableConfig.dataSource.mappingRelations"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'uid'">
                <span>
                  {{ tableConfig.columns.find(f => f.uid === record[column.dataIndex])?.title }}
                </span>
              </template>
              <!-- <template v-else-if="column.dataIndex === 'type'">
                <a-select v-model:value="record[column.dataIndex]" allow-clear style="width: 100%">
                  <a-select-option value="default">数据绑定</a-select-option>
                </a-select>
              </template> -->
              <template v-else-if="column.dataIndex === 'viewField'">
                <data-source-field-selector
                  v-model:value="record[column.dataIndex]"
                  :field-list="state.objectFieldList"
                  @change="v => handleChangeViewField(v, record)"
                />
              </template>
              <template v-else-if="column.dataIndex === 'editField'">
                <data-source-field-selector
                  v-model:value="record[column.dataIndex]"
                  :field-list="state.dataObjectFieldList"
                  @change="v => handleChangeEditField(v, record.uid)"
                />
              </template>
              <template v-else-if="column.dataIndex === 'defaultValueType'">
                <a-select
                  v-model:value="record[column.dataIndex]"
                  allow-clear
                  style="width: 100%"
                  @change="() => (record['defaultValue'] = null)"
                >
                  <a-select-option value="string">字符</a-select-option>
                  <a-select-option value="number">数字</a-select-option>
                  <a-select-option value="date">日期</a-select-option>
                  <a-select-option value="currentUser">用户信息</a-select-option>
                  <a-select-option value="computed">计算值</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'defaultValue'">
                <default-value-config
                  v-model:value="record[column.dataIndex]"
                  :default-value-type="record['defaultValueType']"
                />
              </template>
            </template>
          </a-table>
        </a-card>

        <a-card title="排序设置" size="small" :bordered="false" style="margin-top: 15px">
          <template #extra>
            <a-button type="primary" size="small" @click="addSort">新增</a-button>
          </template>
          <a-table
            :columns="sortTableColumns"
            :data-source="tableConfig.dataSource.sort"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'field'">
                <data-source-field-selector
                  v-model:value="record[column.dataIndex]"
                  :field-list="state.objectFieldList"
                />
              </template>
              <template v-else-if="column.dataIndex === 'type'">
                <a-select v-model:value="record[column.dataIndex]" style="width: 100%">
                  <a-select-option value="asc">升序</a-select-option>
                  <a-select-option value="desc">降序</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'nulls'">
                <a-select v-model:value="record[column.dataIndex]" style="width: 100%">
                  <a-select-option value="none">不处理</a-select-option>
                  <a-select-option value="first">在最前</a-select-option>
                  <a-select-option value="last">在最后</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <a-button type="link" @click="removeSort(index)">删除</a-button>
              </template>
            </template>
          </a-table>
        </a-card>

        <a-card title="数据源过滤条件" size="small" :bordered="false" style="margin-top: 15px">
          <block-filter-config :config="config" />
        </a-card>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';
import DataSourcePopedit from '../../../common/data-source-popedit.vue';
import DataSourceFieldSelector from '../../../common/data-source-field-selector.vue';
import { TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY } from '@/views/low-code/design/keys';

import DefaultValueConfig from '../../../common/default-value-config.vue';
import BlockFilterConfig from '../../../common/block-filter-config.vue';

const columns = [
  {
    title: '列',
    dataIndex: 'uid',
    key: 'uid',
  },
  /* {
    title: '关系类型',
    dataIndex: 'type',
    key: 'type',
  }, */
  {
    title: '显示字段',
    dataIndex: 'viewField',
    key: 'viewField',
  },
  {
    title: '编辑字段',
    dataIndex: 'editField',
    key: 'editField',
  },
  /*{
    title: '编辑字段类型',
    dataIndex: 'editFieldType',
    key: 'editFieldType',
  },*/
  {
    title: '默认值类型',
    dataIndex: 'defaultValueType',
    key: 'defaultValueType',
    width: 120,
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 120,
  },
];

const sortTableColumns = [
  {
    title: '排序字段',
    dataIndex: 'field',
    key: 'field',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 140,
  },
  {
    title: '空值位置',
    dataIndex: 'nulls',
    key: 'nulls',
    width: 140,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 90,
  },
];

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
    const state = reactive({
      objectFieldList: [],
      dataObjectFieldList: [],
    });

    const tableConfig = computed(() => props.config);

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
      () => props.config.dataSource.objectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList(props.config.dataSource.type, n);
          state.objectFieldList = fieldList;
        }
      },
      { immediate: true },
    );

    watch(
      () => props.config.dataSource.dataObjectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList('table', n);
          state.dataObjectFieldList = fieldList;
          tableConfig.value.dataSource.dataObjectPrimaryKey = fieldList.find(
            f => f.primaryKey === 'Y',
          )?.fieldCode;
        }
      },
      { immediate: true },
    );

    const buildMappingRelations = () => {
      const newMappingRelations = tableConfig.value.columns
        .filter(f => ![TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY].includes(f.dataIndex))
        .map(m => {
          const defaultItem = {
            uid: m.uid,
            type: '',
            viewField: '',
            editField: '',
            editFieldType: '',
            defaultValueType: '',
            defaultValue: '',
          };
          const target = tableConfig.value.dataSource.mappingRelations.find(i => i.uid === m.uid);
          if (target) {
            Object.assign(defaultItem, target);
          }
          return defaultItem;
        });

      tableConfig.value.dataSource.mappingRelations = newMappingRelations;
    };

    watch(
      () => props.open,
      (n, o) => {
        if (n === true && n !== o) {
          buildMappingRelations();
        }
      },
    );

    const handleChangeViewField = (val: string, record: any) => {
      if (!record.editField) {
        const target = state.dataObjectFieldList.find(f => f.fieldCode === val);
        if (target) {
          record.editField = val;
          handleChangeEditField(val, record.uid);
        }
      }
    };

    const handleChangeEditField = (val: string, uid: string) => {
      const editTarget = tableConfig.value.dataSource.mappingRelations.find(f => f.uid === uid);
      if (!val && editTarget) {
        editTarget.editFieldType = null;
        return;
      }
      const itemData = state.dataObjectFieldList.find(f => f.fieldCode === val);
      if (itemData) {
        editTarget.editFieldType = itemData.fieldType;
      }
    };

    const addSort = () => {
      if (!tableConfig.value.dataSource.sort) {
        tableConfig.value.dataSource.sort = [];
      }
      tableConfig.value.dataSource.sort.push({
        field: '',
        type: 'desc',
        nulls: 'none',
      });
    };

    const removeSort = (index: number) => {
      tableConfig.value.dataSource.sort.splice(index, 1);
    };

    return {
      columns,
      state,
      tableConfig,
      closeDrawer,
      handleChangeViewField,
      handleChangeEditField,

      sortTableColumns,
      addSort,
      removeSort,
    };
  },
  components: {
    DataSourcePopedit,
    DataSourceFieldSelector,
    DefaultValueConfig,
    BlockFilterConfig,
  },
});
</script>

<style lang="less" scoped></style>
