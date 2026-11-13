<template>
  <div class="plsm-page">
    <a-card title="序列号物料档案" :bordered="false">
      <template #extra>
        <a-button v-if="canMaintain" type="primary" @click="edit()">登记档案</a-button>
      </template>
      <a-form :model="form" layout="inline" @finish="search">
        <a-form-item label="序列号">
          <a-input v-model:value="form.serialNumber" allow-clear :maxlength="128" />
        </a-form-item>
        <a-form-item label="物料号">
          <a-input v-model:value="form.matnr" allow-clear :maxlength="64" />
        </a-form-item>
        <a-form-item label="档案状态">
          <a-select
            v-model:value="form.status"
            allow-clear
            placeholder="全部"
            style="width: 120px"
            :options="[
              { value: '1', label: '生效' },
              { value: '0', label: '失效' },
            ]"
          />
        </a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" :loading="loading">查询</a-button>
          <a-button @click="reset">重置</a-button>
        </a-space>
      </a-form>
    </a-card>
    <a-alert v-if="error" type="error" :message="error" show-icon />
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="rows"
        row-key="id"
        :loading="loading"
        :scroll="{ x: 1250 }"
        :pagination="{ current: page, pageSize: size, total, showSizeChanger: true }"
        @change="changePage"
      >
        <template #bodyCell="{ column, record, text }">
          <a-tag v-if="column.key === 'status'" :color="effectiveColor(text)">
            {{ text === '1' ? '生效' : text === '0' ? '失效' : text || '未提供' }}
          </a-tag>
          <a-space v-else-if="column.key === 'action'">
            <a-button
              type="link"
              size="small"
              :disabled="!record.serial_number"
              @click="historyDialog?.show(record)"
            >
              历史
            </a-button>
            <a-button
              v-if="canMaintain && record.status === '1'"
              type="link"
              size="small"
              @click="edit(record)"
            >
              修改
            </a-button>
            <a-popconfirm
              v-if="canMaintain"
              :title="
                record.status === '1' ? '确认将档案置为失效？' : '确认恢复生效？本次仅修改状态。'
              "
              @confirm="changeStatus(record)"
            >
              <a-button type="link" size="small" :disabled="saving">
                {{ record.status === '1' ? '失效' : '恢复' }}
              </a-button>
            </a-popconfirm>
          </a-space>
          <template
            v-else-if="
              record.status === '0' &&
              ['producer_code', 'producer_name', 'produced_date'].includes(column.key)
            "
          >
            无生效档案
          </template>
          <template v-else>{{ text || '未维护' }}</template>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:open="editing"
      :title="command.id ? '修改制造信息' : '登记序列号物料档案'"
      :confirm-loading="saving"
      @ok="save"
    >
      <a-alert v-if="editError" type="error" :message="editError" show-icon />
      <a-alert
        type="info"
        message="序列号和物料号创建后不可更改；空白制造字段保留原值。新档案默认生效。"
        show-icon
        class="notice"
      />
      <a-form layout="vertical">
        <a-form-item label="序列号" required>
          <a-input v-model:value="command.serialNumber" :disabled="!!command.id" :maxlength="128" />
        </a-form-item>
        <a-form-item label="物料号" required>
          <a-input v-model:value="command.matnr" :disabled="!!command.id" :maxlength="64" />
        </a-form-item>
        <a-form-item label="制造商编码">
          <a-input v-model:value="command.producerCode" :maxlength="64" />
        </a-form-item>
        <a-form-item label="制造商描述">
          <a-input v-model:value="command.producerName" :maxlength="200" />
        </a-form-item>
        <a-form-item label="制造日期">
          <a-date-picker
            v-model:value="command.producedDate"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <history-dialog ref="historyDialog" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import { queryPage, saveArchive, permissions, errorText } from '@/api/plsm';
import type { ArchiveCommand, PlsmQuery, PlsmRow } from '@/api/plsm';
import HistoryDialog from '../components/HistoryDialog.vue';
import { effectiveColor } from '../status';

defineOptions({ components: { HistoryDialog } });

const form = reactive<PlsmQuery>({});
const rows = ref<PlsmRow[]>([]);
const page = ref(1);
const size = ref(20);
const total = ref(0);
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const editError = ref('');
const editing = ref(false);
const canMaintain = ref(false);
const command = ref<ArchiveCommand>({ serialNumber: '', matnr: '' });
const historyDialog = ref<{ show: (row: PlsmRow) => void }>();
let applied: PlsmQuery = {};
let sequence = 0;
const columns = [
  ...[
    ['serial_number', '序列号'],
    ['matnr', '物料号'],
    ['producer_code', '制造商编码'],
    ['producer_name', '制造商描述'],
    ['produced_date', '制造日期'],
    ['status', '档案状态'],
  ].map(([dataIndex, title]) => ({ dataIndex, title, key: dataIndex, width: 170 })),
  { title: '操作', key: 'action', width: 230, fixed: 'right' as const },
];

async function load() {
  const current = ++sequence;
  loading.value = true;
  error.value = '';
  rows.value = [];
  try {
    const result = await queryPage('archives', applied, page.value, size.value);
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
function search() {
  applied = { ...form };
  page.value = 1;
  load();
}
function reset() {
  form.serialNumber = '';
  form.matnr = '';
  form.status = undefined;
  search();
}
function changePage(pagination: TablePaginationConfig) {
  page.value = pagination.current || 1;
  size.value = pagination.pageSize || 20;
  load();
}
function edit(row?: PlsmRow) {
  command.value = row
    ? {
        id: row.id,
        revision: row.revision,
        serialNumber: row.serial_number || '',
        matnr: row.matnr || '',
        producerCode: row.producer_code,
        producerName: row.producer_name,
        producedDate: row.produced_date?.slice(0, 10),
      }
    : { serialNumber: '', matnr: '' };
  editError.value = '';
  editing.value = true;
}
async function save() {
  if (saving.value) {
    return;
  }
  if (!command.value.serialNumber.trim() || !command.value.matnr.trim()) {
    editError.value = '请填写序列号和物料号';
    return;
  }
  saving.value = true;
  editError.value = '';
  try {
    await saveArchive(command.value);
    editing.value = false;
    message.success('档案已保存');
    await load();
  } catch (e) {
    editError.value = errorText(e);
  } finally {
    saving.value = false;
  }
}
/** 恢复只发送状态，不夹带页面里旧的制造信息；后端还会重新校验当前状态与版本。 */
async function changeStatus(row: PlsmRow) {
  if (saving.value) {
    return;
  }
  saving.value = true;
  try {
    await saveArchive({
      id: row.id,
      revision: row.revision,
      serialNumber: row.serial_number || '',
      matnr: row.matnr || '',
      status: row.status === '1' ? '0' : '1',
    });
    message.success('档案状态已更新');
    await load();
  } catch (e) {
    error.value = errorText(e);
  } finally {
    saving.value = false;
  }
}
onMounted(async () => {
  search();
  // 仅用于展示；每个写接口仍由后端实时鉴权，权限查询失败时默认无维护按钮。
  try {
    canMaintain.value = (await permissions()).canMaintainArchive;
  } catch (e) {
    error.value = errorText(e);
  }
});
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
.notice {
  margin: 12px 0;
}
</style>
