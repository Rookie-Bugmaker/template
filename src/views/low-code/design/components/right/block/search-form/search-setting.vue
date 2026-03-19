<template>
  <a-drawer
    :open="open"
    title="查询-数据源设置"
    :width="960"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <a-row type="flex" :gutter="[8, 8]" :wrap="true">
      <a-col :span="24">
        <a-card title="数据源" size="small" :bordered="false">
          <a-form :model="searchConfig.searchSetting">
            <a-form-item label="查询-数据源类型">
              <a-radio-group
                v-model:value="searchConfig.searchSetting.type"
                button-style="solid"
                size="default"
              >
                <a-radio-button value="table">表结构</a-radio-button>
                <a-radio-button value="view">自定义SQL</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="查询-数据源">
              <data-source-popedit
                v-model:value="searchConfig.searchSetting.objectId"
                :data-source-type="searchConfig.searchSetting.type"
                :allow-cross-group="true"
                size="middle"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card title="控件与数据源字段关系" size="small" :bordered="false">
          <a-table
            :columns="columns"
            :data-source="searchConfig.searchSetting.mappingRelations"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'uid'">
                <span>
                  {{
                    getLocaleMessage(
                      searchConfig.fieldList.find(f => f.uid === record[column.dataIndex as string])
                        ?.label,
                    )
                  }}
                </span>
              </template>
              <template v-else-if="column.dataIndex === 'isCustomParam'">
                <a-switch
                  v-model:checked="record[column.dataIndex]"
                  checked-children="是"
                  un-checked-children="否"
                  @change="
                    () => {
                      record.operator = null;
                      record.viewField = null;
                      record.viewFieldType = null;
                    }
                  "
                />
              </template>
              <template v-else-if="column.dataIndex === 'viewField'">
                <data-source-field-selector
                  v-model:value="record[column.dataIndex]"
                  :field-list="state.objectFieldList"
                  @change="v => handleChangeViewField(v, record)"
                  :disabled="record.isCustomParam"
                />
              </template>
              <template v-else-if="column.dataIndex === 'operator'">
                <a-select
                  v-model:value="record[column.dataIndex]"
                  allow-clear
                  style="width: 100%"
                  :dropdown-match-select-width="false"
                  :disabled="record.isCustomParam"
                >
                  <a-select-option
                    v-for="item in record.viewFieldType
                      ? OPERATOR_LIST.filter(f => f.type.includes(record.viewFieldType))
                      : []"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
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
                  <a-select-option value="func">函数</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'defaultValue'">
                <default-value-config
                  v-model:value="record[column.dataIndex]"
                  :default-value-type="record['defaultValueType']"
                  :isSearchFrom="true"
                />
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card title="数据源动态参数列表" size="small" :bordered="false">
          <a-table
            :columns="paramsTableColumns"
            :data-source="searchConfig.searchSetting.params"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'uid'">
                <a-select
                  v-model:value="record[column.dataIndex]"
                  :dropdown-match-select-width="false"
                  placeholder="控件"
                  style="width: 100%"
                >
                  <a-select-option
                    v-for="item in searchConfig.searchSetting.mappingRelations?.filter(
                      f => f.isCustomParam,
                    )"
                    :key="item.uid"
                    :value="item.uid"
                  >
                    <span>
                      {{
                        getLocaleMessage(
                          searchConfig.fieldList.find(f => f.uid === item.uid)?.label,
                        )
                      }}
                    </span>
                  </a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.dataIndex === 'type'">
                <a-select
                  v-model:value="record[column.dataIndex]"
                  :dropdown-match-select-width="false"
                  placeholder="参数类型"
                  style="width: 100%"
                >
                  <a-select-option value="varchar2">字符串</a-select-option>
                  <a-select-option value="number">数字</a-select-option>
                  <a-select-option value="date">日期</a-select-option>
                </a-select>
              </template>
            </template>
          </a-table>
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
import { FieldType, OPERATOR_LIST } from '@/views/low-code/design/typing/index';
import { useLocales } from '@/views/low-code/design/hooks/useLocales';

import DefaultValueConfig from '../../common/default-value-config.vue';
import { uniq } from 'lodash';

const columns = [
  {
    title: '控件',
    dataIndex: 'uid',
    key: 'uid',
  },
  {
    title: '动态参数',
    dataIndex: 'isCustomParam',
    key: 'isCustomParam',
    width: 90,
  },
  {
    title: '查询字段',
    dataIndex: 'viewField',
    key: 'viewField',
  },
  /* {
    title: '查询字段',
    dataIndex: 'viewFieldType',
    key: 'viewFieldType',
  }, */
  {
    title: '查询关系',
    dataIndex: 'operator',
    key: 'operator',
    width: 130,
  },
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

const paramsTableColumns = [
  {
    title: '动态参数名',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '绑定控件',
    dataIndex: 'uid',
    key: 'uid',
  },
  {
    title: '值类型',
    dataIndex: 'type',
    key: 'type',
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
    });

    const searchConfig = computed(() => props.config);

    const closeDrawer = () => {
      emit('update:open', false);
    };

    const buildParams = (paramArr: string[]) => {
      const newParams = paramArr?.map(key => {
        const defaultItem = {
          key,
          uid: '',
          type: '',
          value: null,
        };
        const target = searchConfig.value.searchSetting.params?.find(i => i.key === key);
        if (target) {
          Object.assign(defaultItem, target);
        }
        return defaultItem;
      });

      searchConfig.value.searchSetting.params = newParams;
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
          //设置自定义查询条件（view才有）
          buildParams(
            uniq(
              result.sqlParamList?.map(m => m.paramCode).filter(key => key.startsWith('params.')) ||
                [],
            ),
          );

          return result.fieldList;
        }
      }
      return [];
    };

    watch(
      () => props.config.searchSetting.objectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList(props.config.searchSetting.type, n);
          state.objectFieldList = fieldList;
        }
      },
      { immediate: true },
    );

    const buildMappingRelations = () => {
      const newMappingRelations = searchConfig.value.fieldList.map(m => {
        const defaultItem = {
          uid: m.uid,
          operator: '',
          viewField: '',
          viewFieldType: '',
          defaultValueType: '',
          defaultValue: '',
          isCustomParam: false,
        };
        const target = searchConfig.value.searchSetting.mappingRelations.find(i => i.uid === m.uid);
        if (target) {
          Object.assign(defaultItem, target);
        }
        return defaultItem;
      });

      searchConfig.value.searchSetting.mappingRelations = newMappingRelations;
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
      if (val) {
        const target = state.objectFieldList.find(f => f.fieldCode === val);
        if (target) {
          record.viewFieldType = target.fieldType;
        }
      } else {
        record.viewFieldType = null;
      }
      record.operator = null;
    };

    const { getLocaleMessage } = useLocales();

    return {
      FieldType,
      OPERATOR_LIST,
      columns,
      paramsTableColumns,
      state,
      searchConfig,
      closeDrawer,
      handleChangeViewField,
      getLocaleMessage,
    };
  },
  components: {
    DataSourcePopedit,
    DataSourceFieldSelector,
    DefaultValueConfig,
  },
});
</script>

<style lang="less" scoped></style>
