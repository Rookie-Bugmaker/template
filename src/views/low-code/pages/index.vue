<template>
  <!-- <page-container> -->
  <a-spin :spinning="state.loading">
    <div class="ant-pro-table">
      <a-card class="body">
        <a-form layout="horizontal">
          <a-row :gutter="16" type="flex" justify="start">
            <a-col :xs="24" :sm="24" :md="5">
              <a-form-item>
                <h2>{{ groupName }}</h2>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="6">
              <a-form-item>
                <a-button type="primary" @click="handleCreatePage">
                  <template #icon>
                    <plus-outlined />
                  </template>
                </a-button>
                <a-upload
                  :showUploadList="false"
                  :customRequest="importPageConfig"
                  style="margin-left: 8px"
                >
                  <a-button title="导入">
                    <template #icon>
                      <upload-outlined />
                    </template>
                  </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-row
          ref="containerBoxRef"
          :gutter="[moveSort.horGap, 16]"
          :style="{
            display: 'grid',
            margin: '0',
            gridTemplateColumns: 'repeat(auto-fill, 240px)',
            justifyContent: 'space-evenly',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 205px)',
          }"
          v-if="state.dataSource.length > 0"
          @mousemove="enterDraggableHandler"
        >
          <a-col
            id="draggable-scroll-container"
            v-for="(item, index) in state.dataSource"
            :key="index"
          >
            <div :class="[moveSort.startIndex === index ? 'drag-start-placehodler-class' : '']">
              <drag-container
                class="form-field-drop-area"
                behaviour="move"
                orientation="horizontal"
                group-name="low-application"
                @drag-end="dropHandler"
              >
                <draggable>
                  <div
                    :id="'draggable-main-' + index"
                    :style="{ width: moveSort.draggableWidth + 'px' }"
                    @mousedown="downDraggableHandler($event, index)"
                    @click="clearMoveSort"
                  >
                    <a-dropdown placement="bottomRight" :trigger="['contextmenu']">
                      <a-card
                        hoverable
                        :style="`box-sizing: border-box;width: 100%;${
                          moveSort.enterIndex === index && moveSort.startIndex !== index
                            ? cardBorderStyle
                            : ''
                        }`"
                        size="small"
                        @dblclick.stop="goToDesigner(item.pageId, item.pageType)"
                      >
                        <template #cover>
                          <template>
                            <icon :name="item.pageIcon" :size="60" />
                          </template>
                        </template>
                        <template #actions>
                          <a-tag
                            v-if="enableFlagMap[item.enableStatus]"
                            :color="enableFlagMap[item.enableStatus]?.color"
                          >
                            {{ enableFlagMap[item.enableStatus]?.content }}
                          </a-tag>
                          <a-tag
                            v-if="releaseMap[item.releaseStatus]"
                            :color="releaseMap[item.releaseStatus]?.color"
                          >
                            {{ releaseMap[item.releaseStatus]?.content }}
                          </a-tag>
                        </template>
                      </a-card>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click.stop="editApp(item)" @mousedown.stop>
                            编辑
                          </a-menu-item>
                          <a-menu-item
                            :disabled="item.enableStatus == '1'"
                            @click.stop="showDeleteConfirm(item.pageId)"
                            @mousedown.stop
                          >
                            删除
                          </a-menu-item>
                          <!-- </a-popconfirm> -->
                          <a-menu-item @click.stop="changeStatus(item)" @mousedown.stop>
                            {{ item.enableStatus == '1' ? '禁用' : '启用' }}
                          </a-menu-item>
                          <a-menu-item @click.stop="exportPageConfig(item)" @mousedown.stop>
                            导出
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                    <span
                      style="
                        text-align: center;
                        display: inline-block;
                        width: 100%;
                        font-size: 15px;
                      "
                    >
                      {{ item.pageName }}
                    </span>
                  </div>
                </draggable>
              </drag-container>
            </div>
          </a-col>
        </a-row>
        <a-empty :image="simpleImage" v-else />
      </a-card>
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
  <!-- </page-container> -->
</template>

<script lang="ts">
import { defineComponent, reactive, inject, ref, watch, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { getPageList, deletePageById, pageResort, importPage } from '@/api/low-code/pages/index';
import { groupIdInjectKey, appIdInjectKey, createPageFlagInjectKey } from '@/layouts/low-code/keys';
import { findByGroupId } from '@/api/low-code/group/index';
import { message, Empty } from 'ant-design-vue';
import EditModal from './add-modal.vue';
import { updatePage } from '@/api/low-code/pages';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import { throttle, debounce } from 'lodash-es';
import { Service } from '@/api/typing';
import { useDownloadFile } from '@/utils/hooks/useDownloadFile';

export default defineComponent({
  name: 'pages',
  setup() {
    const { t } = useI18n();
    const groupId = inject(groupIdInjectKey);
    const appId = inject(appIdInjectKey);
    const cratePageFlag = inject(createPageFlagInjectKey);
    const groupName = ref<string>('');
    // 分组
    const lastDropResult = {
      addedIndex: null,
      removedIndex: null,
    };
    const posMap = new Map<number, any>([]);
    let scrollContainer = null;
    const moveSort = reactive({
      horGap: 32,
      draggableWidth: 240,
      startX: null,
      startY: null,
      startIndex: null,
      startElRect: null,
      scrollStartY: null,
      interX: 0,
      enterElRect: null,
      enterIndex: null,
      rightEnterStatus: null,
    });
    const queryParams = reactive({
      groupId: '',
    });

    const enableFlagMap = {
      1: { color: 'success', content: '已启用' },
      0: { color: 'error', content: '禁用' },
    };
    const releaseMap = {
      1: { color: 'success', content: '已发布' },
      0: { color: 'error', content: '待发布' },
    };
    const fetchDataContext = reactive({
      page: 1,
      pageSize: 0,
      stripe: false,
      requestParams: queryParams,
    });
    const { reload, context: state } = useFetchData(getPageList, fetchDataContext, {
      autoFetch: false,
    });

    const getGroupName = () => {
      findByGroupId(groupId.value).then(res => {
        groupName.value = res?.result?.groupName;
      });
    };

    watch(
      groupId,
      n => {
        if (n) {
          queryParams.groupId = groupId.value;
          getGroupName();
          reload();
        }
      },
      { immediate: true },
    );

    const getPosMap = () => {
      scrollContainer = document.getElementById('draggable-scroll-container');
      if (scrollContainer) {
        moveSort.scrollStartY = scrollContainer.getBoundingClientRect().y;
        // 位置数组：
        for (let i = 0; i < state.total; i++) {
          // 改变位置后索引对应id会不会变化
          const el = document.getElementById('draggable-main-' + i);
          posMap.set(i, el.getBoundingClientRect());
        }
      }
    };

    onMounted(() => {
      window.addEventListener(
        'resize',
        debounce(() => {
          getPosMap();
        }, 300),
      );
    });
    watch(
      () => state.total,
      () => {
        nextTick(() => {
          getPosMap();
        });
      },
    );
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
    const showDeleteConfirm = (pageId: string) => {
      state.loading = true;
      deletePageById(pageId)
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
    // 禁用/启用
    const changeStatus = item => {
      const data = { ...item };
      data.enableStatus == 0 ? (data.enableStatus = 1) : (data.enableStatus = 0);
      delete data.language;
      state.loading = true;
      updatePage(data)
        .then(res => {
          state.loading = false;
          if (res.success) {
            reload();
            message.success('状态修改成功!');
          } else {
            message.warning(res.message);
          }
        })
        .catch(err => {
          message.error(err.response.data.message);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    //导出页面配置
    const { download } = useDownloadFile({
      url: `${Service.LOWCODE}/page/export`,
    });
    const exportPageConfig = item => {
      const data = { ...item };
      download({ pageIds: data.pageId });
    };
    //导入页面配置
    const importPageConfig = option => {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('groupId', queryParams.groupId);
      importPage(formData).then(res => {
        if (res.code === 200) {
          message.success('页面配置导入成功');
          reload();
        } else {
          message.error(res.message);
        }
      });
    };

    // 排序操作
    const sortHandler = () => {
      const newData = [...state.dataSource];
      const page = newData[lastDropResult.removedIndex];
      newData.splice(lastDropResult.removedIndex, 1);
      newData.splice(lastDropResult.addedIndex, 0, page);
      // 立即清空
      lastDropResult.removedIndex = null;
      lastDropResult.addedIndex = null;
      state.dataSource = newData;
      const dataSort = JSON.stringify(newData.map(i => ({ pageId: i.pageId })));
      state.loading = true;
      pageResort(dataSort)
        .then(res => {
          state.loading = false;
          if (res.success) {
            message.success('排序成功');
          } else {
            message.error(res.message);
            reload();
          }
        })
        .catch(err => {
          state.loading = false;
          message.error(err);
        });
    };
    // 清除移动
    const clearMoveSort = () => {
      moveSort.startIndex = null;
      moveSort.enterIndex = null;
      moveSort.enterElRect = null;
    };
    // 放下时鼠标不在元素上方时不会调用该方法
    const dropHandler = () => {
      if (moveSort.startIndex === moveSort.enterIndex) {
        // 清空
        clearMoveSort();
        return;
      }
      lastDropResult.removedIndex = moveSort.startIndex;
      if (moveSort.startIndex < moveSort.enterIndex) {
        if (moveSort.rightEnterStatus) {
          lastDropResult.addedIndex = moveSort.enterIndex;
        } else {
          if (moveSort.enterIndex === 0) {
            lastDropResult.addedIndex = 0;
          } else {
            lastDropResult.addedIndex = moveSort.enterIndex - 1;
          }
        }
      } else {
        if (moveSort.rightEnterStatus) {
          lastDropResult.addedIndex = moveSort.enterIndex + 1;
        } else {
          lastDropResult.addedIndex = moveSort.enterIndex;
        }
      }
      // 清空
      clearMoveSort();
      if (
        lastDropResult.removedIndex !== null &&
        lastDropResult.addedIndex !== null &&
        lastDropResult.addedIndex !== lastDropResult.removedIndex &&
        state?.dataSource?.length > 1
      ) {
        // 排序
        sortHandler();
      }
    };

    const goToDesigner = (pageId: string, pageType: number) => {
      const path =
        pageType == 2
          ? `/low-code-mobile/${appId}/${pageId}`
          : `/low-code-design/${appId}/${pageId}`;
      window.open(path);
    };
    const computeArea = (target: any, source: any): number => {
      const h = target.y >= source.y ? source.bottom - target.y : target.bottom - source.y;
      const w = target.x >= source.x ? source.right - target.x : target.right - source.x;
      return h * w;
    };
    const enterDraggableHandler = throttle(event => {
      const x = event.x;
      const y = event.y;
      if (moveSort.startIndex === null) {
        moveSort.interX = x - event.target.getBoundingClientRect().x;
        moveSort.startX = x;
        moveSort.startY = y;
      } else {
        const scrollY = moveSort.scrollStartY - scrollContainer.getBoundingClientRect().y;
        const { x: x0, y: y0, right, bottom } = moveSort.startElRect;
        const currentRect = {
          x: x0 + x - moveSort.startX,
          y: y0 + y - moveSort.startY + scrollY,
          bottom: bottom + y - moveSort.startY + scrollY,
          right: right + x - moveSort.startX,
        };
        const maxArea = [...posMap]
          .filter(
            rect =>
              currentRect.bottom >= rect[1].y &&
              currentRect.y <= rect[1].bottom &&
              currentRect.x <= rect[1].right &&
              currentRect.right >= rect[1].x,
          )
          .reduce(
            (res, rect) => {
              const area = computeArea(currentRect, rect[1]);
              return area >= res[1] ? [rect[0], area] : res;
            },
            [-1, 0],
          );
        moveSort.enterIndex = maxArea[0];
        moveSort.enterElRect = posMap.get(moveSort.enterIndex) ?? null;
        if (moveSort.enterElRect !== null) {
          const transformX = x - moveSort.enterElRect.x - moveSort.interX;
          moveSort.rightEnterStatus = transformX > 0;
        }
      }
    }, 300);
    const downDraggableHandler = (event: MouseEvent, index: number) => {
      // 右键冲突
      if (event.buttons !== 1) {
        return;
      }
      if (moveSort.startIndex === null) {
        moveSort.startIndex = index;
        moveSort.startElRect = document
          .getElementById('draggable-main-' + moveSort.startIndex)
          .getBoundingClientRect();
      }
    };
    const cardBorderStyle = computed(() => {
      return moveSort.rightEnterStatus
        ? 'border-right: 4px solid #1890ff;'
        : 'border-left: 4px solid #1890ff;';
    });

    const handleCreatePage = () => {
      editModal.model = null;
      editModal.open = true;
    };

    watch(
      () => cratePageFlag.value,
      (n, o) => {
        if (n && n != o) {
          handleCreatePage();
        }
      },
      { immediate: true },
    );

    return {
      t,
      groupName,
      reload,
      state,
      queryParams,
      enableFlagMap,
      releaseMap,
      editApp,
      showDeleteConfirm,
      changeStatus,
      exportPageConfig,
      importPageConfig,
      editModal,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      goToDesigner,

      moveSort,
      dropHandler,
      clearMoveSort,
      enterDraggableHandler,
      downDraggableHandler,
      cardBorderStyle,

      handleCreatePage,
    };
  },
  components: {
    DragContainer,
    Draggable,
    EditModal,
  },
});
</script>

<style lang="less" scoped>
:deep(.ant-card-actions > li) {
  margin: 4px 0 !important;
}
:deep(.body .ant-card-bordered) {
  border: 1px solid rgb(161, 159, 159);
  border-radius: 20px;
  overflow: hidden;
}
:deep(.ant-card-actions) {
  height: 32px;
  border-radius: 0 0 20px 20px;
}
:deep(.ant-card-meta-avatar) {
  padding: 0;
}
:deep(.ant-tag) {
  margin: 0;
}
:deep(.ant-card-bordered .ant-card-cover) {
  width: 100%;
  height: 0;
  margin: 0;
  padding: 15px 10px 0 10px;
  padding-bottom: 46%;
  overflow: hidden;
  text-align: center;
  background-repeat: no-repeat;
  background-position: center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}

:deep(.ant-card-cover img) {
  width: 50%;
}
:deep(.ant-tag-error),
:deep(.ant-tag-success) {
  border: none;
}
:deep(.smooth-dnd-container.horizontal > .smooth-dnd-draggable-wrapper) {
  /* height: 100%; */
  display: flex;
  width: 100%;
  vertical-align: top;
}
:deep(.smooth-dnd-container.horizontal) {
  display: flex;
  width: 240px;
}
:deep(.ant-col-4) {
  display: block;
  flex: none;
  width: 100%;
  max-width: none;
}
:deep(.form-field-drop-area) {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .smooth-dnd-drop-preview-constant-class {
    width: 100%;
    height: 4px !important;
  }
  .smooth-dnd-draggable-wrapper.animated {
    transform: translate3d(0px, 0px, 0px) !important;
  }
  .smooth-dnd-stretcher-element {
    width: 8px !important;
    height: 18px !important;
  }
}
.drag-start-placehodler-class {
  width: 240px;
  height: 85%;
  border: 1px dashed #1890ff;
}
</style>
