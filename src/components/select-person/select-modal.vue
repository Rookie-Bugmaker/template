<template>
  <yl-modal
    :open="open"
    title="人员选择"
    centered
    :width="multiple ? 720 : 400"
    @cancel="$emit('cancel')"
    @ok="$emit('ok', keys, rows)"
  >
    <template #footer>
      <a-space v-show="multiple">
        <yl-button act-type="cancel" @click="$emit('cancel')"></yl-button>
        <yl-button act-type="save" @click="$emit('ok', keys, rows)"></yl-button>
      </a-space>
    </template>
    <a-row>
      <a-col :span="multiple ? 14 : 24">
        <a-input-search
          v-model:value="keyword"
          placeholder="请输入人员姓名或工号"
          enter-button
          @search="reload"
        />
        <yl-table
          row-key="personId"
          :columns="columns"
          size="small"
          :pagination="{ ...state.pagination, simple: true }"
          :data-source="state.dataSource"
          :loading="state.loading"
          hide-toolbar
          :row-selection="{
            selectedRowKeys: keys,
            type: multiple ? 'checkbox' : 'radio',
            onChange: handleChange,
          }"
          :scroll="{ y: 360 }"
          @change="handleTableChange"
          :customRow="customRow"
        ></yl-table>
      </a-col>
      <a-col flex="1" v-if="multiple">
        <a-row>
          <a-col flex="1" style="justify-content: center; display: flex; align-items: center">
            已选择{{ keys.length }}
          </a-col>
          <a-col flex="1">
            <a-popconfirm title="确定清空选择吗?" @confirm="(keys = []), (rows = [])">
              <a-button type="primary" danger>清空已选择</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
        <div style="max-height: 400px; overflow: auto; padding: 10px">
          <a-tag
            v-for="item in rows"
            :key="item.personId"
            style="padding: 5px 10px; margin-top: 10px"
            @close="clearPerson(item.personId)"
            closable
          >
            {{ item.fullName || item.personName }}
          </a-tag>
        </div>
      </a-col>
    </a-row>
  </yl-modal>
</template>
<script lang="ts">
import type { ColumnType } from 'ant-design-vue/lib/table';
import type { PropType } from 'vue';
import { defineComponent, reactive, ref, watch } from 'vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import type { PersonItem, PersonParams } from '@/api/organization/person';
import { findPersonByPageCp } from '@/api/organization/person';
import type { Pagination } from '@/typing';
import { cloneDeep } from 'lodash';

const columns: ColumnType[] = [
  {
    title: '姓名',
    dataIndex: 'fullName',
  },
  {
    title: '工号',
    dataIndex: 'jobNo',
  },
];
export default defineComponent({
  name: 'SelectPersonModal',
  props: {
    /**是否打开弹窗 */
    open: Boolean,
    /**多选 */
    multiple: Boolean,
    /**当前值 */
    personValue: Array as PropType<string[]>,
    /**当前数据 */
    personRows: Array as PropType<PersonItem[]>,
    /**自定义查询参数 */
    extraQueryParams: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { expose, emit }) {
    const keys = ref<string[]>([]);
    const rows = ref<PersonItem[]>([]);
    const keyword = ref<string>('');
    const queryParams = reactive({
      fullName: '',
      jobNo: '',
      disableState: 'N',
      montage: 'or',
    });
    // 列表查询参数
    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });
    const { reload, context: state } = useFetchData(
      params => findPersonByPageCp(Object.assign(params, props.extraQueryParams) as PersonParams),
      fetchDataContext,
    );
    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      state.page = page;
      state.pageSize = pageSize;
    };
    expose({ reload });

    // 单击选中行
    const customRow = record => {
      return {
        onClick: () => {
          if (record.personId) {
            if (props.multiple) {
              const index = keys.value.findIndex(id => id == record.personId);
              if (index == -1) {
                keys.value.push(record.personId);
                rows.value.push(record);
              } else {
                keys.value.splice(index, 1);
                rows.value.splice(index, 1);
              }
            } else {
              keys.value = [record.personId];
              rows.value = [record];
              emit('ok', keys.value, rows.value);
            }
          }
        },
      };
    };
    // 勾选切换
    const handleChange = (ks: string[], rs: PersonItem[]) => {
      if (!props.multiple) {
        return emit('ok', ks, rs);
      }
      const otherPageKeys = keys.value.filter(
        item => state.dataSource.findIndex(i => i.personId == item) == -1,
      );
      keys.value = [...otherPageKeys, ...ks];
      const otherPageRows = rows.value.filter(
        item => state.dataSource.findIndex(i => i.personId == item.personId) == -1,
      );
      rows.value = [...otherPageRows, ...rs];
    };
    // 删除一个勾选
    const clearPerson = (personId: string) => {
      keys.value = keys.value.filter(f => f != personId);
      rows.value = rows.value.filter(f => f.personId != personId);
    };
    watch(keyword, value => {
      queryParams.fullName = value;
      queryParams.jobNo = value;
    });
    watch(
      () => state.dataSource,
      data => {
        for (const item of data) {
          item.personId = item.personId.toString();
        }
      },
    );
    watch(
      () => props.open,
      open => {
        if (open) {
          keys.value = cloneDeep(props.personValue);
          rows.value = cloneDeep(props.personRows);
        }
      },
      { immediate: true },
    );

    watch(
      () => props.extraQueryParams,
      () => {
        reload();
      },
      { deep: true },
    );
    return {
      keys,
      rows,
      state,
      keyword,
      columns,
      reload,
      customRow,
      clearPerson,
      handleChange,
      handleTableChange,
    };
  },
});
</script>
