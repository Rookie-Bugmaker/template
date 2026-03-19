<template>
  <div>
    <a-table
      :data-source="modelRef.fieldList"
      :columns="baseColumns"
      :pagination="false"
      :scroll="{ y: 'calc(100vh - 450px)' }"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'fieldType'">
          {{ fieldTypeMap[text] }}
        </template>
        <template v-if="column.dataIndex === 'primaryKey'">
          <a-switch
            v-model:checked="record.primaryKey"
            checked-children="是"
            un-checked-children="否"
            checkedValue="Y"
            unCheckedValue="N"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/typing';
import { useVModels } from '../../hooks/useVModels';
import type { ApiOperationParams } from '@/api/low-code/low-code-api/index';

type Props = {
  modelValue: ApiOperationParams;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
});

const baseColumns: TableColumn[] = [
  {
    title: '字段名',
    dataIndex: 'fieldCode',
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
  },
  {
    title: '是否主键',
    dataIndex: 'primaryKey',
  },
];

const fieldTypeMap = {
  STRING: '字符串',
  NUMBER: '数字',
  DATE: '日期',
  BOOLEAN: '布尔值',
};

const emit = defineEmits(['update:modelValue']);

const modelRef = useVModels(props, 'modelValue', emit);
</script>

<style lang="less" scoped></style>
