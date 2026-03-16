<template>
  <yl-modal
    :open="open"
    :title="title"
    centered
    :width="720"
    @cancel="$emit('cancel')"
    @ok="confirmSelect"
  >
    <template #footer>
      <a-space v-show="multiple">
        <yl-button act-type="cancel" @click="$emit('cancel')"></yl-button>
        <yl-button act-type="save" @click="confirmSelect"></yl-button>
      </a-space>
    </template>
    <a-row style="width: 100%; padding-top: 8px">
      <a-col :span="13" style="margin-right: 8px">
        <a-input-search
          v-model:value="keyword"
          placeholder="请输入用户名或用户描述"
          enter-button
          allow-clear
          @search="reload"
          :disabled="!!designatedUserIds"
          style="margin-bottom: 8px"
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
            selectedRowKeys: rows?.map(m => m.userId) || [],
            type: multiple ? 'checkbox' : 'radio',
            onChange: handleChange,
            getCheckboxProps: () => {
              return {
                disabled: readonly,
              };
            },
          }"
          :scroll="{ y: 360 }"
          @change="handleTableChange"
          :customRow="customRow"
        ></yl-table>
      </a-col>
      <a-col flex="1">
        <a-alert
          show-icon
          :message="
            maxSelectNum
              ? `已选择${rows.length}（最多选择${maxSelectNum}）`
              : `已选择${rows.length}`
          "
          :type="null !== maxSelectNum && rows.length > maxSelectNum ? 'warning' : 'info'"
        >
          <template #action>
            <a-popconfirm title="确定清空选择吗?" @confirm="clearUser">
              <a-button v-show="rows.length > 0 && !readonly" type="primary" size="small" danger>
                清空已选择
              </a-button>
            </a-popconfirm>
          </template>
        </a-alert>
        <div style="max-height: 460px; overflow: auto">
          <a-list item-layout="horizontal" :data-source="rows">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <delete-outlined v-if="!readonly" @click="removeUser(item.userId)" />
                </template>
                <a-list-item-meta :description="item.userName">
                  <template #title>
                    <span>{{ item.userDescription ?? item.userName }}</span>
                  </template>
                  <template #avatar>
                    <a-avatar
                      size="large"
                      :style="{ backgroundColor: '#3296fa', verticalAlign: 'middle' }"
                    >
                      {{ item.userDescription ?? item.userName }}
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-col>
    </a-row>
  </yl-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import type { ColumnType } from 'ant-design-vue/lib/table';
import { useFetchData, wrap } from '@/utils/hooks/useFetchData';
import type { UserItem } from '@/api/system/user';
import { findUserByPageCp, findByUserIds } from '@/api/system/user';
import type { Pagination } from '@/typing';
import { isArray } from 'lodash';
import { message } from 'ant-design-vue';
import { useUserState } from './hooks/useUserState';

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
    open: {
      type: Boolean,
      default: false,
    },
    /**弹窗标题 */
    title: {
      type: String,
      default: '用户选择',
    },
    /**多选 */
    multiple: {
      type: Boolean,
      default: false,
    },
    //最大选择用户数
    maxSelectNum: {
      type: Number,
      default: null,
    },
    //指定用户可选列表
    designatedUserIds: {
      type: Array as PropType<string | string[]>,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { expose, emit }) {
    const rows = ref<UserItem[]>([]);

    //有别的地方单独引用了此组件，所以需要使用默认值
    const { selectedRows, setSelectedRows } = useUserState() ?? {
      selectedRows: ref<UserItem[]>([]),
      setSelectedRows: (rows: UserItem[]) => {
        selectedRows.value = rows;
      },
    };

    watch(
      () => selectedRows.value,
      () => {
        rows.value = [...selectedRows.value];
      },
      {
        immediate: true,
      },
    );
    const keyword = ref<string>('');
    const queryParams = reactive({
      userName: '',
      userDescription: '',
      disableState: 'N',
      montage: 'or',
    });
    watch(keyword, value => {
      queryParams.userDescription = value;
      queryParams.userName = value;
    });

    // 列表查询参数
    const fetchDataContext = reactive({
      stripe: false,
      requestParams: queryParams,
    });
    const dUserIds = computed(() => props.designatedUserIds);
    const ids = isArray(dUserIds.value) ? dUserIds.value.join(',') : dUserIds.value;
    const req = ids ? wrap(() => findByUserIds(ids)) : findUserByPageCp;
    const { reload, context: state } = useFetchData(req as any, fetchDataContext);
    const handleTableChange = ({ current: page, pageSize }: Pagination) => {
      state.page = page;
      state.pageSize = pageSize;
    };
    expose({ reload });

    watch(
      () => state.dataSource,
      data => {
        for (const item of data) {
          item.userId = item.userId.toString();
          item.userDescription = item.userDescription ?? item.userName;
        }
      },
    );

    //确认选择
    const confirmSelect = () => {
      if (null !== props.maxSelectNum && rows.value.length > props.maxSelectNum) {
        message.warning(`最多选择${props.maxSelectNum}个用户`);
      } else {
        setSelectedRows([...rows.value]);
        emit('ok', rows.value);
      }
    };

    // 单击选中行
    const customRow = record => {
      return {
        onClick: () => {
          if (record.userId && !props.readonly) {
            if (!props.multiple) {
              rows.value = [record];
              confirmSelect();
            } else {
              const index = rows.value.findIndex(item => item.userId == record.userId);
              if (index == -1) {
                rows.value.push(record);
              } else {
                rows.value.splice(index, 1);
              }
            }
          }
        },
      };
    };

    // 勾选切换
    const handleChange = (_ks: string[], rs: UserItem[]) => {
      if (!props.multiple) {
        rows.value = [...rs];
        confirmSelect();
      } else {
        const otherPageRows = rows.value.filter(
          item => state.dataSource.findIndex(i => i.userId == item.userId) == -1,
        );
        rows.value = [...otherPageRows, ...rs];
      }
    };

    // 删除一个勾选
    const removeUser = (userId: string) => {
      rows.value = rows.value.filter(f => f.userId != userId);
      if (!props.multiple) {
        confirmSelect();
      }
    };

    // 删除全部勾选
    const clearUser = () => {
      rows.value = [];
      if (!props.multiple) {
        confirmSelect();
      }
    };

    return {
      selectedRows,
      rows,
      state,
      keyword,
      columns,
      reload,
      customRow,
      removeUser,
      clearUser,
      handleChange,
      handleTableChange,
      confirmSelect,
    };
  },
});
</script>
