<template>
  <b-scroll :scroll-x="true" class="approval-steps-wrapper">
    <a-steps :current="0" class="approval-steps">
      <template #progressDot="{ index /*status  , prefixCls */ }">
        <!-- <a-popover> -->
        <!-- <template #content>
          <span>step {{ index }} status: {{ status }}</span>
        </template> -->
        <!-- <span :class="`${prefixCls}-icon-dot`" /> -->
        <component
          :is="getStepIcon(steps[index]?.nodeType) || 'question-circle-outlined'"
          class="step-icon"
          :style="{ 'background-color': getStepBgc(steps[index].nodeType) }"
        ></component>
        <!-- </a-popover> -->
      </template>
      <a-step v-for="(item, index) in steps" :key="index" :title="item.nodeName">
        <template #description>
          <user-tag-select
            v-if="item.selectUser?.enable"
            :ref="el => setUserSelectRef(el, item.nodeId)"
            :selected-user-ids="
              taskData.find(f => Object.keys(f).includes(item.nodeId))[item.nodeId]
            "
            @update:selected-user-ids="ids => handleUpdateTaskData(item.nodeId, ids)"
            :max-tag-count="1"
            :max-select-num="item.selectUser?.max"
            :min-select-num="item.selectUser?.required === true ? item.selectUser?.min : null"
            :designated-user-ids="item.selectUser?.rangeKeys"
            style="margin-top: 15px"
          />
        </template>
      </a-step>
    </a-steps>
  </b-scroll>
</template>

<script lang="ts">
import { defineComponent, ref, resolveDynamicComponent } from 'vue';
import type { PropType } from 'vue';
import type { SequenceGraphItem } from '@/api/workflow/instance/index';
import { NodeType, NodeAttr } from '@/api/workflow/template/typing';

import UserTagSelect from '@/components/user-tag-selet/index.vue';
import BScroll from '@/components/b-scroll/index.vue';

export default defineComponent({
  name: 'ApprovalSteps',
  props: {
    steps: {
      type: Array as PropType<SequenceGraphItem[]>,
      default: () => [],
    },
    taskData: {
      type: Array as PropType<{ [key: string]: string[] }[]>,
      default: () => [],
    },
  },
  emits: ['update-task-data'],
  setup(_props, { emit, expose }) {
    const userSelectRefs = ref({});

    //不使用数组来保存ref,使用对象根据nodeId来保存ref（防止重新打开窗口时，多次push相同的节点ref,且旧ref未删除）
    const setUserSelectRef = (el, nodeId) => {
      if (el) {
        userSelectRefs.value[nodeId] = el;
      }
    };

    const validate = () => {
      return !Object.values(userSelectRefs.value).some((s: any) => {
        const [f] = s.validate();
        return !f;
      });
    };

    const getStepIcon = (nodeType: NodeType) => {
      const c = resolveDynamicComponent(NodeAttr[nodeType]?.icon);
      return typeof c !== 'string' ? c : 'question-circle-outlined';
    };

    const getStepBgc = (nodeType: NodeType) => {
      return NodeAttr[nodeType]?.color || '#ccc';
    };

    const handleUpdateTaskData = (taskId: string, ids: string[]) => {
      emit('update-task-data', taskId, ids);
    };

    expose({ validate });

    return {
      NodeType,
      NodeAttr,
      setUserSelectRef,
      getStepIcon,
      getStepBgc,
      handleUpdateTaskData,
    };
  },
  components: {
    UserTagSelect,
    BScroll,
  },
});
</script>

<style lang="less" scoped>
.approval-steps-wrapper {
  overflow: hidden;
  .approval-steps {
    display: inline-block;
    width: fit-content;
    min-width: 100%;
    margin-top: 45px;
    margin-bottom: 35px;
    white-space: nowrap;
    :deep(.ant-steps-item) {
      display: inline-block;
      width: 180px;
    }
    .step-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      color: #fff;
      font-size: 18px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    :deep(.ant-steps-item-content) {
      margin-top: 28px;
    }
  }
}
</style>
