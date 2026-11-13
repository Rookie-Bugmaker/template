<template>
  <div class="plsm-page">
    <a-card title="实车序列号查询" :bordered="false">
      <template #extra><a-tag color="blue">全项目查询</a-tag></template>
      <a-form :model="form" layout="vertical" @finish="search">
        <div class="filters">
          <a-form-item v-for="field in fields" :key="field.key" :label="field.label">
            <a-input
              v-model:value="form[field.key]"
              allow-clear
              :maxlength="128"
              :placeholder="field.placeholder || '精确查询'"
            />
          </a-form-item>
        </div>
        <a-space wrap>
          <a-button type="primary" html-type="submit" :loading="loading">查询</a-button>
          <a-button @click="reset">重置</a-button>
          <a-button :loading="exporting" :disabled="!hasResult || loading" @click="download">
            导出查询结果
          </a-button>
          <a-switch
            v-model:checked="form.showInvalid"
            checked-children="展示失效/作废"
            un-checked-children="隐藏失效/作废"
            @change="search"
          />
        </a-space>
      </a-form>
    </a-card>
    <a-alert v-if="error" type="error" :message="error" show-icon />
    <a-alert v-if="warning" type="warning" :message="warning" show-icon />
    <a-card :bordered="false" title="实车记录">
      <template #extra>
        <span class="hint">上车、下车均展示；缺少生效档案时保留实车记录</span>
      </template>
      <a-table
        :data-source="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :scroll="{ x: 3800 }"
        :pagination="{
          current: page,
          pageSize: size,
          total,
          showSizeChanger: true,
          showTotal: n => `共 ${n} 条`,
        }"
        @change="changePage"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'history'">
            <a-button
              type="link"
              size="small"
              :disabled="!record.serial_number"
              @click="historyDialog?.show(record)"
            >
              查看历史
            </a-button>
          </template>
          <template v-else-if="column.key === 'state'">
            <a-space direction="vertical" :size="2">
              <a-tag :color="effectiveColor(record.h_status)">
                规划：{{ effective(record.h_status) }}
              </a-tag>
              <a-tag :color="effectiveColor(record.d_status)">
                位置：{{ effective(record.d_status) }}
              </a-tag>
              <a-tag :color="vehicleColor(record.v_status)">
                实车：{{ vehicleState(record.v_status) }}
              </a-tag>
            </a-space>
          </template>
          <template
            v-else-if="['producer_code', 'producer_name', 'produced_date'].includes(column.key)"
          >
            <span v-if="record.s_status !== '1'" class="hint">
              {{ record.archive_message || '未维护' }}
            </span>
            <template v-else>{{ text || '未维护' }}</template>
          </template>
          <template v-else>{{ text || '—' }}</template>
        </template>
      </a-table>
    </a-card>
    <history-dialog ref="historyDialog" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import { errorText, exportVehicles, queryPage } from '@/api/plsm';
import type { PlsmQuery, PlsmRow } from '@/api/plsm';
import HistoryDialog from '../components/HistoryDialog.vue';
import { effectiveColor, vehicleColor } from '../status';

defineOptions({ components: { HistoryDialog } });

const defaults = (): PlsmQuery => ({ plant: '2000', showInvalid: false });
const form = reactive<PlsmQuery>(defaults());
const fields: {
  key: Exclude<keyof PlsmQuery, 'showInvalid'>;
  label: string;
  placeholder?: string;
}[] = [
  { key: 'projectCode', label: '项目编码' },
  { key: 'configurationType', label: '编组形式' },
  { key: 'model', label: '车型（必填）' },
  { key: 'trainCode', label: '车组编号（必填）' },
  { key: 'vehicleNo', label: '车辆号' },
  { key: 'hmatnr', label: '主物料号' },
  { key: 'wbscode', label: 'WBS（新造）' },
  { key: 'plant', label: '主数据工厂', placeholder: '默认2000，可修改' },
];
// 三个识别字段放在最左侧并固定，横向滚动时仍能核对当前实车对应的序列号和物料。
const columns = [
  ...[
    ['serial_number', '序列号'],
    ['matnr', '物料号'],
    ['material_name', '物料名称'],
  ].map(([dataIndex, title]) => ({
    dataIndex,
    title,
    key: dataIndex,
    width: 180,
    fixed: 'left' as const,
  })),
  ...[
    ['project_code', '项目号'],
    ['production_code', '产品编号'],
    ['configuration_type', '编组'],
    ['model', '车型'],
    ['train_code', '车组编号'],
    ['vehicle_no', '车辆号'],
    ['car_sort', '车辆序号'],
    ['location', '位置号'],
    ['location_desc', '位置描述'],
    ['wbscode', 'WBS编码'],
    ['supplier_code', '检修商编码'],
    ['h_matnr', '主件物料'],
    ['belong_system', '所属系统'],
    ['lru', 'LRU'],
    ['triple_part', '三方物流件'],
    ['instead_group', '替换分组'],
  ].map(([dataIndex, title]) => ({ dataIndex, title, key: dataIndex, width: 160 })),
  ...[
    ['producer_code', '制造商编码'],
    ['producer_name', '制造商描述'],
    ['produced_date', '制造日期'],
  ].map(([dataIndex, title]) => ({ dataIndex, title, key: dataIndex, width: 160 })),
  { title: '状态', key: 'state', width: 140 },
  { title: '操作', key: 'history', width: 100, fixed: 'right' as const },
];
const rows = ref<PlsmRow[]>([]);
const page = ref(1);
const size = ref(20);
const total = ref(0);
const loading = ref(false);
const exporting = ref(false);
const error = ref('');
const warning = ref('');
const hasResult = ref(false);
const historyDialog = ref<{ show: (row: PlsmRow) => void }>();
let applied = defaults();
let sequence = 0;
const effective = (status?: string) =>
  ({ '0': '失效', '1': '生效' }[status || ''] || status || '未提供');
const vehicleState = (status?: string) =>
  ({ '0': '上车', '1': '下车', '2': '作废' }[status || ''] || status || '未提供');

/** 分页和导出使用最后一次提交的筛选快照，编辑尚未查询的输入不会改变已展示结果的范围。 */
async function load() {
  const current = ++sequence;
  loading.value = true;
  error.value = '';
  warning.value = '';
  hasResult.value = false;
  rows.value = [];
  try {
    const result = await queryPage('vehicles', applied, page.value, size.value);
    if (current === sequence) {
      rows.value = result.records;
      total.value = result.total;
      warning.value = result.warning || '';
      hasResult.value = true;
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
function search() {
  if (!form.model?.trim() || !form.trainCode?.trim()) {
    error.value = '请填写车型和车组编号后查询';
    return;
  }
  applied = { ...form };
  page.value = 1;
  load();
}
function reset() {
  Object.keys(form).forEach(key => delete form[key]);
  Object.assign(form, defaults());
  ++sequence;
  rows.value = [];
  total.value = 0;
  loading.value = false;
  hasResult.value = false;
  error.value = '';
  warning.value = '';
}
function changePage(pagination: TablePaginationConfig) {
  page.value = pagination.current || 1;
  size.value = pagination.pageSize || 20;
  load();
}
async function download() {
  exporting.value = true;
  error.value = '';
  try {
    await exportVehicles(applied);
  } catch (e) {
    error.value = errorText(e);
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped>
.plsm-page {
  display: grid;
  gap: 16px;
  padding: 16px;
  min-width: 0;
}
.plsm-page > * {
  min-width: 0;
}
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0 16px;
}
.hint {
  color: #737d8c;
  font-size: 12px;
}
</style>
