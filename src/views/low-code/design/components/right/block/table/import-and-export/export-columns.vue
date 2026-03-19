<template>
  <a-drawer
    :open="open"
    title="导出数据列设置"
    :width="1160"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <a-row type="flex" :gutter="[8, 0]">
      <a-col flex="auto" style="height: 100%">
        <a-card title="导出列" size="small" :bordered="false">
          <a-table
            row-key="uid"
            :columns="columns"
            :data-source="tableConfig.importAndExport.exportColumns"
            :pagination="false"
            size="small"
            :rowSelection="{
              type: 'radio',
              selectedRowKeys: state.selectedRowKeys,
              onChange: selectedRowKeys => {
                state.selectedRowKeys = selectedRowKeys;
              },
            }"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.dataIndex === 'convertType'">
                <a-tag v-if="text" color="green">是</a-tag>
                <div v-else>-</div>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col flex="auto" style="height: 100%">
        <a-form-item label="转换类型设置">
          <a-select
            v-if="
              tableConfig.importAndExport.exportColumns.find(
                f => f.uid === state.selectedRowKeys?.[0],
              )
            "
            v-model:value="
              tableConfig.importAndExport.exportColumns.find(
                f => f.uid === state.selectedRowKeys[0],
              ).convertType
            "
            :options="[
              {
                value: 'decode',
                label: '固定值转换',
              },
              {
                value: 'user-info',
                label: '用户信息转换',
              },
            ]"
            style="width: 300px"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item
          label="用户信息转换字段"
          v-if="
            tableConfig.importAndExport.exportColumns.find(f => f.uid === state.selectedRowKeys[0])
              ?.convertType == 'user-info'
          "
        >
          <a-select
            v-model:value="
              tableConfig.importAndExport.exportColumns.find(
                f => f.uid === state.selectedRowKeys[0],
              ).userInfoField
            "
            :options="[
              {
                value: 'userDescription',
                label: '用户描述',
              },
              {
                value: 'userName',
                label: '用户名',
              },
            ]"
            style="width: 300px"
            placeholder="不设置默使用用户描述"
          ></a-select>
        </a-form-item>
        <a-card
          v-if="
            tableConfig.importAndExport.exportColumns.find(f => f.uid === state.selectedRowKeys[0])
              ?.convertType == 'decode'
          "
          title="列值转换表"
          size="small"
          :bordered="false"
        >
          <template #extra>
            <a-button
              type="primary"
              size="small"
              @click="
                () => {
                  tableConfig.importAndExport.exportColumns
                    .find(f => f.uid === state.selectedRowKeys[0])
                    ?.['decodeList']?.push({
                      value: '',
                      text: '',
                    });
                }
              "
            >
              新增行
            </a-button>
          </template>
          <a-table
            :columns="decodeListColums"
            :data-source="
              tableConfig.importAndExport.exportColumns.find(
                f => f.uid === state.selectedRowKeys[0],
              )?.['decodeList'] || []
            "
            size="small"
            :pagination="false"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'value'">
                <a-input v-model:value="record[column.dataIndex]"></a-input>
              </template>
              <template v-else-if="column.dataIndex === 'text'">
                <a-input v-model:value="record[column.dataIndex]"></a-input>
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <a-button type="link" @click="removeDecodeItem(index)">删除</a-button>
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
import { TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY } from '@/views/low-code/design/keys';

const columns = [
  {
    title: '列标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '绑定字段',
    dataIndex: 'field',
    key: 'field',
  },
  {
    title: '列值转换',
    dataIndex: 'convertType',
    key: 'convertType',
    width: 80,
  },
];

const decodeListColums = [
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '描述',
    dataIndex: 'text',
    key: 'text',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
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
      selectedRowKeys: [],
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
        }
      },
      { immediate: true },
    );

    const buildMappingRelations = () => {
      /* const newExportColumns = tableConfig.value.dataSource.mappingRelations.map(m => {
        const title = tableConfig.value.columns.find(f => f.uid === m.uid)?.title;
        const defaultItem = {
          uid: m.uid,
          field: m.viewField,
          title,
          decodeList: [],
        };
        const target = tableConfig.value.importAndExport.exportColumns.find(i => i.uid === m.uid);
        if (target) {
          //只取之前已设置的导出列转换列表，其他属性以数据源的为准
          Object.assign(defaultItem, { decodeList: target.decodeList || [] });
        }
        return defaultItem;
      }); */

      //以表格的显示列为主，去实现导出
      const newExportColumns = tableConfig.value.columns
        .filter(f => ![TABLE_COLUMN_ACTION_KEY, TABLE_COLUMN_ROW_INDEX_KEY].includes(f.dataIndex))
        .map(col => {
          const viewField = tableConfig.value.dataSource.mappingRelations.find(
            f => f.uid === col.uid,
          )?.viewField;
          const defaultItem = {
            uid: col.uid,
            field: viewField,
            title: col.title,
            convertType: 'decode', //decode | user-info
            userInfoField: '', //userDescription | userName
            decodeList: [],
          };
          const target = tableConfig.value.importAndExport.exportColumns.find(
            i => i.uid === col.uid,
          );
          if (target) {
            //只取之前已设置的导出列转换列表，其他属性以数据源的为准
            Object.assign(defaultItem, {
              convertType: target.convertType,
              decodeList: target.decodeList || [],
            });
          }
          return defaultItem;
        });

      tableConfig.value.importAndExport.exportColumns = newExportColumns;
    };

    watch(
      () => props.open,
      (n, o) => {
        if (n === true && n !== o) {
          buildMappingRelations();
        }
      },
    );

    const removeDecodeItem = (index: number) => {
      const decodeList =
        tableConfig.value.importAndExport.exportColumns.find(
          f => f.uid === state.selectedRowKeys[0],
        )?.['decodeList'] || [];
      decodeList.splice(index, 1);
    };

    return {
      columns,
      decodeListColums,
      state,
      tableConfig,
      closeDrawer,
      removeDecodeItem,
    };
  },
  components: {},
});
</script>

<style lang="less" scoped></style>
