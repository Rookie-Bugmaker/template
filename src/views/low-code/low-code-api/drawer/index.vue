<template>
  <a-button :size="props.size" type="link" @click="() => showDrawer()">查看</a-button>
  <a-drawer v-model:open="open" :width="600" title="参数列表" placement="right">
    <a-table :dataSource="props.list" :columns="columns" size="small">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'required'">
          <a-tag v-if="record.required" color="#f50">必填</a-tag>
          <a-tag v-else color="#2db7f5">非必填</a-tag>
        </template>
      </template>
    </a-table>
  </a-drawer>
</template>

<script setup lang="ts">
import type { Parameter } from '@/api/low-code/low-code-api/index';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { ref } from 'vue';

type Props = {
  list: Array<Parameter>;
  record?: any;
  column?: any;
  show?: boolean;
  size?: SizeType;
};

const props = withDefaults(defineProps<Props>(), {
  list: null,
  show: false,
  size: 'small',
});

const columns = [
  {
    title: '参数名称',
    dataIndex: 'parameter',
    key: 'parameter',
  },
  {
    title: '是否必填',
    dataIndex: 'required',
    key: 'required',
  },
  {
    title: '参数描述',
    dataIndex: 'description',
    key: 'description',
  },
];

const open = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};
</script>

<style lang="less" scoped></style>
