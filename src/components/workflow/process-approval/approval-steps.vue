<template>
  <b-scroll :scroll-x="true" class="approval-steps-wrapper">
    <a-steps :current="currentStep" class="approval-steps">
      <template #progressDot="{ index /*status  , prefixCls */ }">
        <a-tooltip
          color="#fff"
          v-if="steps[index].nodeStatus !== NodeStatus.NotStarted"
          :getPopupContainer="(trigger: HTMLElement) => trigger.parentElement"
        >
          <template #title>
            <div class="step-info-wrapper">
              <template v-if="steps[index].endTime">
                <div>
                  <p class="info">
                    <span>结束时间：</span>
                    {{ steps[index].endTime }}
                  </p>
                  <p class="info">
                    <span>审批时长：</span>
                    {{ getTimeStr(steps[index].processingTime) }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div>
                  <a-badge v-if="steps[index].overtimeFlag" color="red" text="已超时" />
                  <p class="info">
                    <span>到达时间：</span>
                    {{ steps[index].startTime }}
                  </p>
                  <p v-if="steps[index].overtimeFlag" class="info" style="color: red">
                    <span>超时时长：</span>
                    {{ getTimeStr(steps[index].overTime) }}
                  </p>
                </div>
              </template>
            </div>
          </template>
          <div
            :class="[
              'step-icon-wrapper',
              {
                'selected-node': selectedNodeId === steps[index].nodeId && !disabledSelectStep,
              },
            ]"
          >
            <component
              :is="getStepIcon(steps[index]?.nodeType) || 'question-circle-outlined'"
              class="step-icon"
              :style="{ 'background-color': getStepBgc(steps[index].nodeType) }"
            ></component>
          </div>
        </a-tooltip>
        <div
          v-else
          :class="[
            'step-icon-wrapper',
            { 'selected-node': selectedNodeId === steps[index].nodeId && !disabledSelectStep },
          ]"
        >
          <component
            :is="getStepIcon(steps[index]?.nodeType) || 'question-circle-outlined'"
            class="step-icon"
            :style="{ 'background-color': getStepBgc(steps[index].nodeType) }"
          ></component>
        </div>
      </template>
      <a-step
        v-for="(item, index) in steps"
        :key="index"
        :title="item.nodeName"
        @click="$emit('select-step', item)"
      >
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
            style="margin-top: 8px"
            :readonly="readonly"
            :designated-user-ids="item.selectUser?.rangeKeys"
          />
          <span
            v-if="currentStep === index"
            :class="['current-step-text', { 'is-overtime': item.overtimeFlag }]"
          >
            当前节点
          </span>
        </template>
      </a-step>
    </a-steps>
  </b-scroll>
</template>

<script lang="ts">
import { defineComponent, computed, ref, resolveDynamicComponent } from 'vue';
import type { PropType } from 'vue';
import type { SequenceGraphItem } from '@/api/workflow/instance/index';
import { NodeStatus } from '@/api/workflow/instance/index';
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
    selectedNodeId: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabledSelectStep: {
      //禁用选择节点切换数据
      type: Boolean,
      default: false,
    },
  },
  emits: ['update-task-data', 'select-step'],
  setup(props, { emit, expose }) {
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

    const currentStep = computed<number>(() => {
      /* if (
        sequenceGraphSteps.value[sequenceGraphSteps.value.length - 1]?.taskCompleteMark ===
        CompleteMark.Completed
      ) {
        return sequenceGraphSteps.value.length - 1;
      } */
      return props.steps.findIndex(f => f.isCurrentNode === true);
    });

    const getTimeStr = (ot: string) => {
      if (ot) {
        const arr = ot.split(':');
        if (arr.length === 3) {
          const h = arr[0];
          const m = arr[1];
          const s = arr[2];
          if (h === '00' && m === '00') {
            return `${s}秒`;
          } else if (h === '00') {
            return `${m}分${s}秒`;
          } else {
            return `${arr[0]}小时${arr[1]}分${arr[2]}秒`;
          }
        }
      }
      return ot;
    };

    expose({
      validate,
    });

    return {
      NodeStatus,
      NodeType,
      NodeAttr,
      setUserSelectRef,
      getStepIcon,
      getStepBgc,
      handleUpdateTaskData,
      currentStep,
      getTimeStr,
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
    margin-top: 28px;
    margin-bottom: 14px;
    white-space: nowrap;

    :deep(.ant-steps-item) {
      display: inline-block;
      width: 180px;
    }
    .step-icon-wrapper {
      width: 45px;
      height: 45px;
      transform: translate(-42%, -50%);
      .step-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        color: #fff;
        font-size: 18px;
        border-radius: 50%;
      }

      &.selected-node {
        background: linear-gradient(to top, #2496ff, #2496ff) left top no-repeat,
          linear-gradient(to right, #2496ff, #2496ff) left top no-repeat,
          /*左上*/ linear-gradient(to left, #2496ff, #2496ff) right top no-repeat,
          /*上右*/ linear-gradient(to bottom, #2496ff, #2496ff) right top no-repeat,
          /*上右*/ linear-gradient(to left, #2496ff, #2496ff) left bottom no-repeat,
          /*下左*/ linear-gradient(to bottom, #2496ff, #2496ff) left bottom no-repeat,
          /*左下*/ linear-gradient(to top, #2496ff, #2496ff) right bottom no-repeat,
          /*下右*/ linear-gradient(to left, #2496ff, #2496ff) right bottom no-repeat;
        background-color: rgb(245, 245, 245);
        background-size: 2px 8px, 8px 2px, 2px 8px, 8px 2px;
      }
    }

    :deep(.ant-steps-item-container) {
      .step-info-wrapper {
        color: #3f3f3f;
        .info {
          margin: 5px;
        }
      }
    }
    :deep(.ant-steps-item-content) {
      margin-top: 24px;
    }
    :deep(.ant-steps-item-description) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .current-step-text {
      display: block;
      width: 100px;
      margin: 8px 0 0 0;
      padding: 5px 5px;
      color: #096dd9;
      background: #e6f7ff;
      border: 1px solid #91d5ff;
      border-radius: 4px;
      &.is-overtime {
        color: #cf1322;
        background-color: #fff1f0;
        border: 1px solid #cf1322;
      }
    }
  }
}
</style>
