<template>
  <page-container>
    <a-spin :spinning="state.loading">
      <div
        class="body rounded-2 mb1"
        :style="{ padding: '10px 10px', backgroundColor: '#ffffff', height: '100%' }"
      >
        <a-form layout="horizontal">
          <a-row :gutter="16" type="flex" justify="start">
            <a-col :xs="24" :sm="24" :md="6">
              <a-form-item>
                <a-input-search
                  v-model:value="queryParams.applicationName"
                  placeholder="请输入业务能力中心"
                  allow-clear
                  @search="onSearch"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="15">
              <a-form-item>
                <a-button
                  type="primary"
                  @click="
                    () => {
                      editModal.model = null;
                      editModal.open = true;
                    }
                  "
                >
                  <plus-outlined />
                  创建业务能力中心
                </a-button>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="3">
              <a-form-item>
                <a-dropdown :trigger="['click']">
                  <span class="ant-dropdown-link" @click.prevent>
                    {{ appStatus }}
                    <down-outlined />
                  </span>
                  <template #overlay>
                    <a-menu @click="queryStatus">
                      <a-menu-item key="null">全部状态</a-menu-item>
                      <a-menu-item key="1">已启用</a-menu-item>
                      <a-menu-item key="0">已禁用</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-row :gutter="[24, 24]" style="margin: 0" v-if="state.dataSource.length > 0">
          <a-col :span="6" v-for="item in state.dataSource" :key="item.applicationId">
            <div @click="gotoLowCode(item)">
              <a-card hoverable style="width: 100%" size="small">
                <template #actions>
                  <a-tag v-if="enableFlagMap[item.state]" :color="enableFlagMap[item.state]?.color">
                    {{ enableFlagMap[item.state]?.content }}
                  </a-tag>
                  <a-dropdown :trigger="['click']" @click.stop>
                    <a class="ant-dropdown-link" @click.prevent>
                      <ellipsis-outlined key="ellipsis" />
                    </a>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="editApp(item)">编辑</a-menu-item>
                        <a-menu-item @click="showDeleteConfirm(item)" :disabled="item.state == 1">
                          删除
                        </a-menu-item>
                        <a-menu-item @click="changeStatus(item)" v-if="item.state == 1">
                          禁用
                        </a-menu-item>
                        <a-menu-item @click="changeStatus(item)" v-else-if="item.state == 0">
                          启用
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>
                <a-card-meta :title="item.applicationName">
                  <template #avatar>
                    <icon :name="item.applicationIcon" :size="40" />
                    <!-- <a-image class="antd-image" :src="item.file?.url" :width="50" :height="50" :preview="true"></a-image> -->
                  </template>
                </a-card-meta>
                <p class="description">
                  {{ item.applicationDesc }}
                </p>
              </a-card>
            </div>
          </a-col>
        </a-row>
        <a-empty :image="simpleImage" v-else />
      </div>
    </a-spin>
    <edit-modal
      :model="editModal.model"
      :open="editModal.open"
      @cancel="
        () => {
          editModal.open = false;
        }
      "
      @ok="
        () => {
          editModal.open = false;
          reload();
        }
      "
    />
  </page-container>
</template>

<script lang="ts">
import { defineComponent, createVNode, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { getAppList, deleteById, updateApp } from '@/api/low-code/application/index';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, Empty } from 'ant-design-vue';
import EditModal from './edit-modal.vue';
import type { MenuProps } from 'ant-design-vue';
import type { ApplicationItem, ApplicationOperationParams } from '@/api/low-code/application';

export default defineComponent({
  name: 'ApplicationList',
  setup() {
    const { t } = useI18n();
    const queryParams = reactive({
      state: null,
      applicationName: '',
    });

    const enableFlagMap = {
      0: { color: 'error', content: '已禁用' },
      1: { color: 'success', content: '已启用' },
    };
    const accountStatusOptions = [
      { label: '全部状态', value: null },
      { label: '已禁用', value: 0 },
      { label: '已启用', value: 1 },
    ];
    const fetchDataContext = reactive({
      page: 1,
      pageSize: 0,
      stripe: false,
      requestParams: queryParams,
    });
    const { reload, context: state } = useFetchData(getAppList, fetchDataContext);

    // const handleTableChange = ({ current: page, pageSize }: Pagination) => {
    //   fetchDataContext.page = page;
    //   fetchDataContext.pageSize = pageSize;
    // };

    // edit
    const editModal = reactive({
      open: false,
      model: null,
    });
    const editApp = (record: object) => {
      editModal.open = true;
      editModal.model = {
        ...record,
      };
    };
    // delete
    const showDeleteConfirm = (row: ApplicationItem) => {
      Modal.confirm({
        title: '是否确定删除该业务能力中心?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除业务能力中心则表单、数据源及数据等也都将一并删除，且无法还原，请谨慎操作！',
        centered: true,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          state.loading = true;
          deleteById(row.applicationId)
            .then(res => {
              state.loading = false;
              if (res.success) {
                reload();
                message.success(res.message);
              } else {
                message.error(res.message);
              }
            })
            .catch(err => {
              state.loading = false;
              message.error(err);
            });
        },
      });
    };

    // 禁用/启用
    const changeStatus = (row: ApplicationOperationParams) => {
      delete row.language;
      row.state = row.state === 0 ? 1 : 0;
      state.loading = true;
      updateApp(row)
        .then(res => {
          state.loading = false;
          if (res.success) {
            reload();
            message.success(res.message);
          } else {
            message.error(res.message);
          }
        })
        .catch(err => {
          state.loading = false;
          message.error(err);
        });
    };
    const onSearch = () => {
      reload();
    };
    const appStatus = ref<string>('全部状态');
    const queryStatus: MenuProps['onClick'] = ({ key }) => {
      if (key == 'null') {
        queryParams.state = '';
        appStatus.value = '全部状态';
        reload();
      }
      accountStatusOptions.forEach(i => {
        if (i.value == key) {
          appStatus.value = i.label;
          queryParams.state = key;
          reload();
        }
      });
    };

    const gotoLowCode = item => {
      window.open(`/low-code-application/${item.applicationId}`);
    };

    return {
      state,
      queryParams,
      enableFlagMap,
      accountStatusOptions,
      editModal,
      appStatus,
      t,
      reload,
      showDeleteConfirm,
      gotoLowCode,
      editApp,
      changeStatus,
      onSearch,
      queryStatus,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  components: {
    EditModal,
  },
});
</script>

<style scoped>
:deep(.ant-card-body) {
  padding-bottom: 3px;
}
:deep(.ant-card-body .ant-row) {
  margin: 0;
}
:deep(.ant-card-meta-title) {
  display: -webkit-box;
  height: 60px;
  overflow: hidden;
  font-size: 20px;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
:deep(.ant-card-bordered) {
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  overflow: hidden;
}
:deep(.ant-card-actions) {
  border-radius: 0 0 20px 20px;
}
.ant-card-meta {
  margin: 0;
}
.description {
  display: -webkit-box;
  width: 100%;
  height: 40px;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
/* .ant-avatar {
  width: 5rem;
  height: 5rem;
} */
/* .icon {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: rgb(211, 212, 213);
  border-radius: 50%;
} */
</style>
