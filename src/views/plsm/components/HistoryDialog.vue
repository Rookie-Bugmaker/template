<template>
  <a-modal v-model:open="open" title="序列号历史凭证" :width="980" :footer="null">
    <a-typography-paragraph type="secondary">
      序列号：{{ serial }} / 物料号：{{ material }}。创建日期为来源凭证创建时间，缺失时留空。
    </a-typography-paragraph>
    <a-descriptions :column="3" size="small" class="archive-summary">
      <a-descriptions-item label="制造商编码">
        {{ manufacturing('producer_code') }}
      </a-descriptions-item>
      <a-descriptions-item label="制造商描述">
        {{ manufacturing('producer_name') }}
      </a-descriptions-item>
      <a-descriptions-item label="制造日期">
        {{ manufacturing('produced_date') }}
      </a-descriptions-item>
    </a-descriptions>
    <a-alert v-if="error" :message="error" type="error" show-icon />
    <a-table
      :columns="columns"
      :data-source="rows"
      row-key="id"
      :loading="loading"
      :pagination="{ current: page, pageSize: size, total, showSizeChanger: true }"
      :scroll="{ x: 850 }"
      @change="changePage"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { history, errorText } from '@/api/plsm';
import type { PlsmRow } from '@/api/plsm';
import type { TablePaginationConfig } from 'ant-design-vue';

const open = ref(false);
const serial = ref('');
const material = ref('');
const rows = ref<PlsmRow[]>([]);
const page = ref(1);
const size = ref(20);
const total = ref(0);
const loading = ref(false);
const error = ref('');
const selected = ref<PlsmRow>();
let sequence = 0;
const columns = [
  { title: '凭证编码', dataIndex: 'serial_detail_code', width: 220 },
  { title: '订单编码', dataIndex: 'order_code', width: 200 },
  { title: '订单类型（原值）', dataIndex: 'order_type', width: 160 },
  { title: '来源创建日期', dataIndex: 'source_create_time', width: 200 },
  { title: '状态（原值）', dataIndex: 'status', width: 100 },
];

/** 快速切换记录时只接受最后一次请求，防止上一物料历史覆盖当前弹窗。 */
async function load() {
  const current = ++sequence;
  loading.value = true;
  error.value = '';
  rows.value = [];
  try {
    const result = await history(serial.value, material.value, page.value, size.value);
    if (current === sequence) {
      rows.value = result.records;
      total.value = result.total;
    }
  } catch (e) {
    if (current === sequence) {
      error.value = errorText(e);
    }
  } finally {
    if (current === sequence) {
      loading.value = false;
    }
  }
}

function show(row: PlsmRow) {
  if (!row.serial_number || !row.matnr) {
    return;
  }
  serial.value = row.serial_number;
  selected.value = { ...row };
  material.value = row.matnr;
  page.value = 1;
  total.value = 0;
  open.value = true;
  load();
}

function changePage(pagination: TablePaginationConfig) {
  page.value = pagination.current || 1;
  size.value = pagination.pageSize || 20;
  load();
}
defineExpose({ show });

function manufacturing(field: string) {
  const status = selected.value?.s_status ?? selected.value?.status;
  if (status === '0') {
    return '无生效档案';
  }
  return selected.value?.[field] || '未维护';
}
</script>

<style scoped>
.archive-summary {
  margin-bottom: 16px;
}
</style>
