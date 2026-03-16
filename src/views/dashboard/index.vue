<template>
  <page-container>
    <div>这是首页</div>
    <!-- <div style="width: 100%">
      <div class="layoutJSON">
        Displayed as
        <code>[x, y, w, h]</code>
        :
        <div class="columns">
          <div class="layoutItem" v-for="item in state.layout" :key="item.i">
            <b>{{ item.i }}</b>
            : [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div>
    </div> -->
    <!-- <a-spin :spinning="state.loading" wrapperClassName="content">
      <a-affix
        :offset-top="80"
        :style="{ position: 'absolute', top: '45%', right: 0, zIndex: 999999 }"
      >
        <a-space direction="vertical">
          <a-button type="primary" shape="circle" @click="() => (state.isSetup = !state.isSetup)">
            <template #icon><double-left-outlined :rotate="state.isSetup ? 180 : 0" /></template>
          </a-button>
          <a-button
            type="primary"
            shape="circle"
            v-show="state.isSetup"
            @click="() => (state.modalVisible = true)"
          >
            <template #icon><plus-circle-outlined /></template>
          </a-button>
          <a-button type="primary" shape="circle" v-show="state.isSetup" @click="saveConfig">
            <template #icon><save-outlined /></template>
          </a-button>
        </a-space>
      </a-affix>
      <grid-layout
        ref="gridLayoutRef"
        v-model:layout="state.layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="state.isSetup"
        :is-resizable="state.isSetup"
        :responsive="true"
        :vertical-compact="true"
        :use-css-transforms="true"
        :margin="[5, 5]"
      >
        <grid-item
          v-for="item in state.layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :minW="2"
          :minH="4"
        >
          <child-item v-bind="getItemProps(item.i)" />
        </grid-item>
      </grid-layout>
    </a-spin>
    <page-components-modal v-model:open="state.modalVisible" @ok="changeConfig" />
    <process-approval-modal
      v-if="processApprovalState.open"
      v-model:open="processApprovalState.open"
      :process-instance-id="processApprovalState.processInstanceId"
      :function-id="processApprovalState.functionId"
    /> -->
  </page-container>
</template>

<script lang="ts">
// import { defineComponent, ref, onMounted, onActivated, reactive } from 'vue';
// import useDashboardState from './hooks/useDashboardState';
// import ChildItem from './components/child-item.vue';
// import PageComponentsModal from './page-components-modal.vue';
// import { Affix as AAffix } from 'ant-design-vue';

// import { useRoute } from 'vue-router';
// import { getMessageById } from '@/api/dashboard/items/system/notice';
// import ProcessApprovalModal from '@/components/workflow/process-approval/approval-modal.vue';
// import { updateMessageStatus } from '@/api/dashboard/items/system/notice';
// import convertMessage from './items/system/notice/convertMessage';

// export default defineComponent({
//   name: 'Dashboard',
//   setup() {
//     const { state, changeConfig, saveConfig } = useDashboardState();

//     const getItemProps = (pageComponentId: string) => {
//       const target = state.pageComponents.find(f => f.componentId === pageComponentId);
//       return {
//         title: target?.homePageTitle || '组件',
//         path: target?.functionUrl,
//         refreshRate: target?.refreshRate,
//       };
//     };

//     const gridLayoutRef = ref(null);

//     const processApprovalState = reactive({
//       open: false,
//       processInstanceId: '',
//       functionId: '',
//     });

//     const route = useRoute();

//     const approval = () => {
//       const logId = route.query?.logId as string;
//       if (logId) {
//         getMessageById(logId).then(({ success, result }) => {
//           if (success && result) {
//             if (result.type == 1) {
//               processApprovalState.open = true;
//               const data = convertMessage(result);
//               processApprovalState.processInstanceId = data?.extraParams?.processInstanceId;
//               processApprovalState.functionId = data?.extraParams?.functionId;
//             }
//           }
//         });

//         updateMessageStatus({ logId, readStatus: 'Y' });
//       }
//     };

//     onMounted(() => {
//       onActivated(() => {
//         //防止加载时快速切换导致宽度获取异常
//         gridLayoutRef.value?.onWindowResize?.();
//       });
//       approval();
//     });

//     return {
//       state,
//       changeConfig,
//       saveConfig,
//       getItemProps,
//       gridLayoutRef,
//       processApprovalState,
//     };
//   },
//   components: {
//     ChildItem,
//     PageComponentsModal,
//     AAffix,
//     ProcessApprovalModal,
//   },
// });
</script>

<style lang="less" scoped>
// .content {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   min-height: 300px;
//   :deep(.vue-grid-layout) {
//     background: #fafafa;
//     .vue-grid-item {
//       &:not(.vue-grid-placeholder) {
//         background: #fff;
//         // border: 1px solid #f0f0f0;
//         border-radius: 4px;
//         &:hover {
//           box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
//         }
//       }
//       &.vue-grid-placeholder {
//         background: @primary-color;
//       }
//       &.resizing {
//         opacity: 0.9;
//       }
//       .vue-resizable-handle {
//         position: absolute;
//         right: 0;
//         bottom: 0;
//         z-index: 5000;
//         box-sizing: border-box;
//         width: 20px;
//         height: 20px;
//         padding: 0 4px 4px 0;
//         background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
//         background-repeat: no-repeat;
//         background-position: bottom right;
//         background-origin: content-box;
//         cursor: se-resize;
//       }
//     }
//   }
// }

/* .layoutJSON {
  margin-top: 10px;
  padding: 10px;
  background: #ddd;
  border: 1px solid black;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 220px;
} */
</style>
