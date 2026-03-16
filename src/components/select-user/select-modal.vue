<template>
  <yl-modal
    :open="open"
    title="用户选择"
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
          placeholder="请输入用户名或用户描述"
          enter-button
          @search="reload"
        />
        <yl-table
          row-key="userId"
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
          <a-tooltip v-for="item in rows" :key="item.userId" :title="item.userName">
            <a-tag
              style="padding: 5px 10px; margin-top: 10px"
              @close="clearUser(item.userId)"
              closable
            >
              {{ item.userDescription || item.userName }}
            </a-tag>
          </a-tooltip>
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
import type { UserItem, UserParams } from '@/api/system/user';
import { findUserByPageCp } from '@/api/system/user';
import type { Pagination } from '@/typing';
import { cloneDeep } from 'lodash';

const columns: ColumnType[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '描述',
    dataIndex: 'userDescription',
  },
];
export default defineComponent({
  name: 'SelectUserModal',
  props: {
    /**是否打开弹窗 */
    open: Boolean,
    /**多选 */
    multiple: Boolean,
    /**当前值 */
    userValue: Array as PropType<string[]>,
    /**当前数据 */
    userRows: Array as PropType<UserItem[]>,
    /**自定义查询参数 */
    extraQueryParams: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { expose, emit }) {
    const keys = ref<string[]>([]);
    const rows = ref<UserItem[]>([]);
    const keyword = ref<string>('');
    const queryParams = reactive({
      userName: '',
      userDescription: '',
      disableState: 'N',
      montage: 'or',
    });
    // 列表查询参数
    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });
    const { reload, context: state } = useFetchData(
      params => findUserByPageCp(Object.assign(params, props.extraQueryParams) as UserParams),
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
          if (record.userId) {
            if (props.multiple) {
              const index = keys.value.findIndex(id => id == record.userId);
              if (index == -1) {
                keys.value.push(record.userId);
                rows.value.push(record);
              } else {
                keys.value.splice(index, 1);
                rows.value.splice(index, 1);
              }
            } else {
              keys.value = [record.userId];
              rows.value = [record];
              emit('ok', keys.value, rows.value);
            }
          }
        },
      };
    };
    // 勾选切换
    const handleChange = (ks: string[], rs: UserItem[]) => {
      if (!props.multiple) {
        return emit('ok', ks, rs);
      }
      const otherPageKeys = keys.value.filter(
        item => state.dataSource.findIndex(i => i.userId == item) == -1,
      );
      keys.value = [...otherPageKeys, ...ks];
      const otherPageRows = rows.value.filter(
        item => state.dataSource.findIndex(i => i.userId == item.userId) == -1,
      );
      rows.value = [...otherPageRows, ...rs];
    };
    // 删除一个勾选
    const clearUser = (userId: string) => {
      keys.value = keys.value.filter(f => f != userId);
      rows.value = rows.value.filter(f => f.userId != userId);
    };
    watch(keyword, value => {
      queryParams.userDescription = value;
      queryParams.userName = value;
    });
    watch(
      () => state.dataSource,
      data => {
        for (const item of data) {
          item.userId = item.userId.toString();
          item.userDescription = item.userDescription ?? item.userName;
        }
      },
    );
    watch(
      () => props.open,
      open => {
        if (open) {
          keys.value = cloneDeep(props.userValue);
          rows.value = cloneDeep(props.userRows);
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
      clearUser,
      handleChange,
      handleTableChange,
    };
  },
});
</script>
