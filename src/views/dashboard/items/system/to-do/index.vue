<template>
  <page-component-wrapper :title="title" :loading="state.loading">
    <template #extra-right>
      <reload-outlined @click="getData" />
    </template>
    <a-list class="to-do-list" size="small" :data-source="state.data">
      <template #renderItem="{ item }">
        <a-list-item>
          <process-approval
            class="list-item"
            :processInstanceId="item.processInstanceId"
            :functionId="item.functionId"
            @handle="getData"
          >
            <ellipsis style="margin-right: 10px; display: flex; flex: 1 0 150px; text-align: left">
              <span>您有一条</span>
              <span>{{ item.promoter }}提交的</span>
              <span class="template-wrapper" style="color: #f9c00c">
                <span class="symbol">[</span>
                <!-- <ellipsis>{{ item.templateName }}</ellipsis> -->
                <span>{{ item.templateName }}</span>
                <span class="symbol">]</span>
              </span>
              待处理，单据编号
              <span style="color: #00b9f1">[{{ item.bizCode }}]</span>
            </ellipsis>
            <ellipsis style="margin-left: auto; flex: 0 0 150px; width: 150px; color: #9d9fa9">
              {{ item.createTime }}
            </ellipsis>
          </process-approval>
        </a-list-item>
      </template>
    </a-list>
  </page-component-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageComponentWrapper from '@/views/dashboard/components/page-component-wrapper.vue';
import Ellipsis from '@/components/ellipsis/index.vue';
import ProcessApproval from '@/components/workflow/process-approval/index.vue';
// import { notification } from 'ant-design-vue';
import { getCurrentUserToDos, type ToDoItem } from '@/api/workflow/to-do/index';

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
  setup(props) {
    const state = reactive({
      loading: false,
      data: [] as ToDoItem[],
    });

    const getData = () => {
      state.loading = true;
      getCurrentUserToDos()
        .then(({ success, result }) => {
          if (success && result) {
            state.data = result;
          }
        })
        .finally(() => {
          state.loading = false;
        });
    };

    getData();
    setInterval(getData, props.refreshRate * 1000);

    return { state, getData };
  },
  components: { PageComponentWrapper, Ellipsis, ProcessApproval },
});
</script>

<style lang="less" scoped>
.to-do-list {
  /*  :deep(.ant-list-items) {
    width: max-content;
  } */
  :deep(.list-item) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    color: #333333;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    padding: 0;
    .template-wrapper {
      display: flex;
      // max-width: 190px;
      margin: 0 2px;
      text-align: center;
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
