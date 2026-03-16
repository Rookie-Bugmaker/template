<template>
  <div ref="containerRef" style="height: 100%">
    <page-component-wrapper :title="title" ref="pageComponentRef">
      <template #extra-left>
        <a-dropdown>
          <a
            class="ant-dropdown-link"
            @click.prevent
            style="margin-left: 13px; color: #333; font-size: 13px; font-weight: 600"
          >
            {{ state.readStatus === '' ? '全部' : state.readStatus === 'Y' ? '已读' : '未读' }}
            ({{ state.total }})
            <DownOutlined />
          </a>
          <template #overlay>
            <a-menu @click="changeStatus">
              <a-menu-item key="N">
                <a>未读</a>
              </a-menu-item>
              <a-menu-item key="Y">
                <a>已读</a>
              </a-menu-item>
              <a-menu-item key="">
                <a>全部</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template #extra-right>
        <reload-outlined @click="refresh(state.readStatus)" />
      </template>

      <div style="height: 100%; overflow: auto" @scroll="handleScroll" ref="containerListRef">
        <a-list
          size="small"
          :data-source="state.data"
          class="message-list"
          :loading="state.loading"
          ref="aListRef"
        >
          <template #renderItem="{ item }">
            <a-list-item ref="containerListItemRef">
              <dynamic-list-item
                :messageType="item.type"
                v-bind="item.extraParams"
                :process-instance-id="item.extraParams?.processInstanceId"
                @click="updateStatus(item.logId)"
              >
                <a-badge :status="item.readStatus === 'Y' ? 'default' : 'error'" />
                <div class="type-wrapper" :style="{ color: item.typeColor }">
                  <span class="symbol">[</span>
                  <span class="type">{{ item.typeDesc }}</span>
                  <!-- <span>{{ item.type }}</span> -->
                  <span class="symbol">]</span>
                </div>
                <ellipsis style="padding: 0 8px; flex: 1 0 150px; text-align: left">
                  {{ item.message }}
                </ellipsis>
                <ellipsis
                  style="
                    margin-left: auto;
                    flex: 0 0 140px;
                    width: 140px;
                    color: #9d9fa9;
                    text-align: right;
                  "
                >
                  {{ item.createDate }}
                </ellipsis>
              </dynamic-list-item>
            </a-list-item>
          </template>
        </a-list>
        <div v-if="state.footer">
          <p style="text-align: center; margin: 0; font-size: 10px; color: #868790">
            我也是有底线的～
          </p>
        </div>
      </div>
    </page-component-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch, computed } from 'vue';
import {
  getMessage,
  updateMessageStatus,
  /* type MessageItem, */ type ReadStatus,
} from '@/api/dashboard/items/system/notice';
import PageComponentWrapper from '@/views/dashboard/components/page-component-wrapper.vue';
import Ellipsis from '@/components/ellipsis/index.vue';
import DynamicListItem from './components/dynamic-list-item.vue';

import { notification } from 'ant-design-vue';
import { useWebSocket } from '@/utils/hooks/useWebSocket';
import convertMessage, {
  type MessageItemExpansion,
} from '@/views/dashboard/items/system/notice/convertMessage';
import { useResizeObserver } from '@/utils/hooks/useResizeObserver';

export default defineComponent({
  name: 'Notice',
  props: {
    title: {
      type: String,
      default: '',
    },
    //组件刷新频率
    refreshRate: {
      type: Number,
      default: 900,
    },
  },
  setup() {
    // 距离底部多少px时加载
    const TO_BOTTOM_PX = 8;
    // 每次加载数量固定为多少
    const NUM_PER_LOAD = 20;
    // 最外部容器
    const containerRef = ref(null);
    const { sizeObject: containerSize } = useResizeObserver(containerRef);
    // 表头
    const pageComponentRef = ref(null);
    const tableHeadRef = computed(() => {
      return pageComponentRef.value?.tableHeadRef;
    });
    const { sizeObject: tableHeadSize } = useResizeObserver(tableHeadRef);
    // antDesign最小表头高38
    const tableHeadHeight = computed(() => {
      return tableHeadSize.height <= 38 ? 38 : tableHeadSize.height;
    });
    // 当中列表容器
    const containerListRef = ref(null);
    // a-list
    const aListRef = ref(null);
    const { sizeObject: aListSize } = useResizeObserver(aListRef);
    // 单个列表
    const containerListItemRef = ref(null);
    const { sizeObject: containerListItemSize } = useResizeObserver(containerListItemRef);
    const containerListItemHeight = computed(() => {
      // padding=16 border-bottom=1固定
      return containerListItemSize.height + 16 + 1;
    });

    const state = reactive({
      loading: false,
      readStatus: 'N' as ReadStatus, // N:未读，Y:已读
      data: [] as MessageItemExpansion[],
      page: 1,
      pageSize: NUM_PER_LOAD,
      longSize: 1,
      total: 0, //总条数,记录总数,不一定是数组长度
      footer: false,
    });

    // 容器高度/每次加载条数 = 当前容器高度下要加载的页数
    const updateLongSize = () => {
      state.longSize = Math.ceil(
        (Math.floor(containerSize.height) - tableHeadHeight.value) /
          (containerListItemHeight.value * NUM_PER_LOAD),
      );
    };

    // 获取数据 readStatus = 当前已读/未读/全部状态
    const getMessageHandler = readStatus => {
      state.loading = true;
      getMessage({
        readStatus,
        page: state.page,
        pageSize: state.pageSize,
        typeList: [],
      })
        .then(({ success, result }) => {
          if (success && result) {
            state.data.push(...(result.rows?.map(m => convertMessage(m)) || []));
            state.total = result.total || 0;
          }
        })
        .finally(() => {
          aListHeight = aListSize.height; //每次加载完后 更新为当前高度
          state.loading = false;
        });
    };

    // 刷新按钮
    const refresh = readStatus => {
      updateLongSize();
      state.page = 1;
      state.data = [];
      state.footer = false;
      // 当前高度加载条数
      state.pageSize = NUM_PER_LOAD * state.longSize;
      getMessageHandler(readStatus);
    };

    // 获取数据
    const getData = readStatus => {
      // 点击刷新的单次加载条数
      if (state.pageSize > NUM_PER_LOAD) {
        state.page = state.pageSize / NUM_PER_LOAD + 1;
        state.pageSize = NUM_PER_LOAD;
      }
      getMessageHandler(readStatus);
    };

    // 已读/未读/全部状态切换
    const changeStatus = e => {
      updateLongSize();
      state.readStatus = e.key;
      state.footer = false;
      state.page = 1;
      state.data = [];
      state.pageSize = NUM_PER_LOAD * state.longSize;
      getMessageHandler(state.readStatus);
    };

    watch(
      () => containerSize.height,
      n => {
        if (
          Math.ceil((n - tableHeadHeight.value) / (containerListItemHeight.value * NUM_PER_LOAD)) >
            state.longSize &&
          state.data.length < state.total
        ) {
          // 容器高度>当前所有的数据高度，并且小于总数量，自动加载
          state.page++;
          getData(state.readStatus);
          state.longSize++;
        }
      },
    );

    // 只数据的list的高度
    let aListHeight = aListRef.value?.clientHeight || 0;
    const handleScroll = () => {
      const container = containerListRef.value;
      // 根据list高度变化判断新加载的数据是否渲染完
      if (aListSize.height <= aListHeight) return;
      // 渲染完了就再加载
      if (
        container.scrollTop + container.clientHeight + TO_BOTTOM_PX >= container.scrollHeight &&
        container.scrollTop > 0
      ) {
        // 更新高度
        aListHeight = aListSize.height;
        // 滚动触底自动加载
        if (state.data.length < state.total) {
          state.page++;
          getData(state.readStatus);
        } else {
          state.footer = true;
        }
      }
    };

    onMounted(() => {
      getData(state.readStatus);
    });

    const onMessage = ({ success, result }) => {
      if (success && result && typeof result !== 'string') {
        notification.info({
          message: '消息通知',
          description: convertMessage(result)?.message,
        });
        getData(state.readStatus);
      }
    };

    useWebSocket({
      path: `/sys/ws/home/notice`,
      autoConnect: true,
      onMessage,
    });

    const updateStatus = (logId: string) => {
      updateMessageStatus({ logId, readStatus: 'Y' }).then(({ success }) => {
        if (success) {
          state.data.find(f => f.logId == logId).readStatus = 'Y';
        }
      });
    };

    return {
      state,
      getData,
      updateStatus,
      handleScroll,
      changeStatus,
      containerRef,
      containerListRef,
      aListRef,
      containerListItemRef,
      pageComponentRef,
      NUM_PER_LOAD,
      refresh,
    };
  },
  components: { PageComponentWrapper, Ellipsis, DynamicListItem },
});
</script>

<style lang="less" scoped>
.message-list {
  :deep(.list-item) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    .type-wrapper {
      color: @primary-color;
      text-align: center;
      .type {
        text-wrap: nowrap;
      }
      .symbol {
        &:first-child {
          margin-right: 2px;
        }
        &:last-child {
          margin-left: 2px;
        }
      }
    }
  }
}
</style>
