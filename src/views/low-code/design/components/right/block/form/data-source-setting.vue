span
<template>
  <a-drawer
    :open="open"
    title="表单-数据源设置"
    :width="960"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <a-row type="flex" :gutter="[8, 0]">
      <a-col flex="220px" style="height: 100%">
        <a-card title="数据源" size="small" :bordered="false">
          <a-form :model="formConfig.dataSource" layout="vertical">
            <a-form-item label="编辑-数据源">
              <data-source-popedit
                v-model:value="formConfig.dataSource.dataObjectId"
                :allow-cross-group="true"
                data-source-type="table"
                size="middle"
              />
            </a-form-item>
            <a-form-item label="编辑-数据源-主键">
              <a-input
                v-model:value="formConfig.dataSource.dataObjectPrimaryKey"
                size="middle"
                :disabled="true"
              />
            </a-form-item>
            <a-form-item label="增删改-前后置增强">
              <a-input
                v-model:value="formConfig.dataSource.beanName"
                size="middle"
                placeholder="beanName"
              />
            </a-form-item>
            <a-divider />
            <a-form-item label="查询-数据源类型">
              <a-radio-group
                v-model:value="formConfig.dataSource.type"
                button-style="solid"
                size="default"
              >
                <a-radio-button value="table">表结构</a-radio-button>
                <a-radio-button value="view">自定义SQL</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="查询-数据源"
              tooltip="查询数据源非必填；选择后，会使用查询数据源进行查询，可通过自定义SQL实现绕过组织及业务实体的部分限制（注：需将编辑数据源的字段都查询出来）"
            >
              <data-source-popedit
                v-model:value="formConfig.dataSource.objectId"
                :data-source-type="formConfig.dataSource.type"
                :allow-cross-group="true"
                size="middle"
                allow-clear
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col flex="auto" style="height: 100%">
        <a-card title="控件与数据源字段关系" size="small" :bordered="false">
          <a-table
            :columns="columns"
            :data-source="formConfig.dataSource.mappingRelations"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'uid'">
                <span>
                  {{
                    getLocaleMessage(
                      formConfig.fieldList.find(f => f.uid === record[column.dataIndex])?.label,
                    )
                  }}
                </span>
              </template>
              <!-- <template v-else-if="column.dataIndex === 'type'">
                <a-select v-model:value="record[column.dataIndex]" allow-clear style="width: 100%">
                  <a-select-option value="default">数据绑定</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'viewField'">
                <data-source-field-selector
                  v-model:value="record[column.dataIndex]"
                  :field-list="state.objectFieldList"
                  @change="v => handleChangeViewField(v, record)"
                />
              </template> -->
              <template v-else-if="column.dataIndex === 'editField'">
                <data-source-field-selector
                  v-model:value="record[column.dataIndex]"
                  :field-list="
                    formConfig.dataSource.objectId
                      ? state.objectFieldList
                      : state.dataObjectFieldList
                  "
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
import DataSourcePopedit from '../../common/data-source-popedit.vue';
import DataSourceFieldSelector from '../../common/data-source-field-selector.vue';
import { useLocales } from '@/views/low-code/design/hooks/useLocales';
import { WidgetType } from '@/views/low-code/design/typing/typing';

import DefaultValueConfig from '../../common/default-value-config.vue';
import BlockFilterConfig from '../../common/block-filter-config.vue';

const columns = [
  {
    title: '控件',
    dataIndex: 'uid',
    key: 'uid',
  },
  /* {
      title: '关系类型',
      dataIndex: 'type',
      key: 'type',
    }, */
  /*  {
    title: '显示字段',
    dataIndex: 'viewField',
    key: 'viewField',
  }, */
  {
    title: '编辑字段',
    dataIndex: 'editField',
    key: 'editField',
  },
  /*{
      title: '编辑字段类型',
      dataIndex: 'editFieldType',
      key: 'editFieldType',
    }, */
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

    const formConfig = computed(() => props.config);

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
          formConfig.value.dataSource.dataObjectPrimaryKey = fieldList.find(
            f => f.primaryKey === 'Y',
          )?.fieldCode;
        }
      },
      { immediate: true },
    );

    const buildMappingRelations = () => {
      const newMappingRelations = formConfig.value.fieldList
        .filter(f => ![WidgetType.Button].includes(f.type))
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
          const target = formConfig.value.dataSource.mappingRelations.find(i => i.uid === m.uid);
          if (target) {
            Object.assign(defaultItem, target);
          }
          return defaultItem;
        });

      formConfig.value.dataSource.mappingRelations = newMappingRelations;
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
      const editTarget = formConfig.value.dataSource.mappingRelations.find(f => f.uid === uid);
      if (!val && editTarget) {
        editTarget.editFieldType = null;
        return;
      }
      const itemData = state.dataObjectFieldList.find(f => f.fieldCode === val);
      if (itemData) {
        editTarget.editFieldType = itemData.fieldType;
      }
    };

    const { getLocaleMessage } = useLocales();

    return {
      columns,
      state,
      formConfig,
      closeDrawer,
      handleChangeViewField,
      handleChangeEditField,
      getLocaleMessage,
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
