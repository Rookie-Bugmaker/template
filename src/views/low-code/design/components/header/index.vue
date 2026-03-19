<template>
  <div class="designer-header">
    <div class="left-wrapper">
      <div class="title-wrapper">
        <div class="info-wrapper">
          <span class="application-title">
            <icon
              v-if="designerState.applicationInfo?.applicationIcon"
              :name="designerState.applicationInfo?.applicationIcon"
            ></icon>
            {{ designerState.applicationInfo?.applicationName }}
          </span>
          <span class="group-title">{{ designerState.groupInfo?.groupName }}</span>
        </div>
        <a-divider type="vertical" />
        <div class="icon">
          <icon
            v-if="designerState.pageInfo?.pageIcon"
            :name="designerState.pageInfo?.pageIcon"
            :size="22"
          ></icon>
        </div>
        <div class="page-title">{{ designerState.pageInfo?.pageName }}</div>
        <a-divider type="vertical" />
        <div class="dropdown-wrapper">
          <a-dropdown style="width: 100%">
            <a class="ant-dropdown-link" @click.prevent>
              {{
                designerState?.config?.configTrees?.find(
                  f => f.uid === designerState.currentConfigTreeId,
                )?.name
              }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-sub-menu
                  v-for="item in designerState.config?.configTrees || []"
                  :key="item.uid"
                  @click="handleClickPageItem(item.uid)"
                >
                  <template #title>
                    <span>{{ item.name }}</span>
                    <a-tag
                      v-if="item.uid === designerState.config.mainConfigTreeId"
                      color="blue"
                      style="margin-left: 5px"
                    >
                      主页面
                    </a-tag>
                  </template>
                  <a-menu-item
                    :disabled="item.uid === designerState.config.mainConfigTreeId"
                    @click="handleChangeMainPage(item.uid)"
                  >
                    <div style="width: 100px">设为主页面</div>
                  </a-menu-item>
                  <a-menu-item @click="handleOpenEditPageInfo(item.uid, item.name)">
                    <div>修改信息</div>
                  </a-menu-item>
                  <a-menu-item
                    :disabled="item.uid === designerState.config.mainConfigTreeId"
                    @click="handleDeletePage(item.uid)"
                  >
                    <div>删除页面</div>
                  </a-menu-item>
                </a-sub-menu>
                <a-menu-divider />
                <a-menu-item @click="handleOpenEditPageInfo(null, null)">
                  <span style="vertical-align: baseline; margin-right: 5px">新增页面</span>
                  <plus-circle-outlined />
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <a-space>
        <!-- <a-button type="dashed" @click="$emit('preview')">预览</a-button> -->
        <a-button type="primary" @click="$emit('save')">保存</a-button>
        <a-button @click="$emit('release')">发布</a-button>
      </a-space>
    </div>
  </div>
  <yl-modal
    v-model:open="state.open"
    :title="`${state.pageUid ? '修改' : '新增'}页面`"
    @ok="handleConfirmEditPageInfo"
    @cancel="state.open = false"
  >
    <a-form-item label="页面名称" :required="true">
      <a-input v-model:value.trim="state.pageName" placeholder="请输入页面名称"></a-input>
    </a-form-item>
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { generateKey } from '@/views/low-code/design/utils/key';
import { defaultRootConfig } from '@/views/low-code/design/typing/index';
import { cloneDeep } from 'lodash';

export default defineComponent({
  name: 'DesignerHeader',
  emits: ['preview', 'save', 'release'],
  setup() {
    const designerState = inject(designerStateInjectKey);

    const state = reactive({
      open: false,
      pageUid: null,
      pageName: '',
    });

    const handleChangeMainPage = (uid: string) => {
      designerState.config.mainConfigTreeId = uid;
    };

    const handleDeletePage = (uid: string) => {
      Modal.confirm({
        title: '删除页面',
        content: '是否删除页面？',
        centered: true,
        onOk: () => {
          designerState.config?.configTrees.splice(
            designerState.config?.configTrees.findIndex(f => f.uid == uid),
            1,
          );
          designerState.config.currentConfig = null;
        },
      });
    };

    const handleOpenEditPageInfo = (uid: string, name: string) => {
      state.open = true;
      state.pageUid = uid;
      state.pageName = name;
    };

    const handleConfirmEditPageInfo = () => {
      if (!state.pageName) {
        message.warning('请输入页面名称');
        return;
      }
      if (!state.pageUid) {
        const config = cloneDeep(defaultRootConfig);
        config.uid = generateKey();
        config.name = state.pageName;
        designerState.config?.configTrees?.push(config);
        designerState.currentConfig = null;
        designerState.currentConfigTreeId = config.uid;
      } else {
        const targetPage = designerState.config?.configTrees?.find(f => f.uid == state.pageUid);
        targetPage.name = state.pageName;
      }
      state.open = false;
    };

    const handleClickPageItem = (uid: string) => {
      const targetPage = designerState.config?.configTrees?.find(f => f.uid == uid);
      if (targetPage) {
        designerState.currentConfigTreeId = targetPage.uid;
        designerState.currentConfig = null;
      }
    };

    return {
      designerState,
      state,
      handleChangeMainPage,
      handleDeletePage,
      handleOpenEditPageInfo,
      handleConfirmEditPageInfo,
      handleClickPageItem,
    };
  },
});
</script>

<style lang="less" scoped>
.designer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .left-wrapper {
    display: flex;
    align-items: center;

    .title-wrapper {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
        font-size: 22px;
      }
      .page-title {
        font-weight: bold;
        font-size: 17px;
      }
      .info-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 120px;
        padding: 5px 11px;
        background-color: #e9e9e9;
        border-radius: 5px;
        .application-title {
          font-weight: bold;
          font-size: 14px;
          line-height: 19px;
        }
        .group-title {
          width: 100%;
          color: #8d8d8d;
          font-size: 12px;
          line-height: 16px;
          text-align: right;
        }
      }
    }
  }
}
</style>
