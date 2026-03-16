<template>
  <a-modal
    :title="undefined"
    v-bind="$attrs"
    :wrap-class-name="state.isMaximized ? `modal-full-screen ${wrapClassName}` : wrapClassName"
    @ok="$event => $emit('ok', $event)"
    @cancel="$event => $emit('cancel', $event)"
    :confirmLoading="confirmLoading"
    :maskClosable="maskClosable"
    :centered="centered"
  >
    <template #title>
      <div
        ref="modalTitleRef"
        class="modal-title-wrapper"
        :style="{ cursor: movable ? 'move' : 'defalut' }"
      >
        <span v-if="title">{{ title }}</span>
        <template v-else>
          <slot name="title"></slot>
        </template>
        <div
          v-if="
            maximizable !== false &&
            !(
              typeof maximizable === 'object' && (maximizable as Maximizable)?.onlyMaximize === true
            )
          "
          class="modal-full-screen-btn"
          @click="maximize"
        >
          <fullscreen-exit-outlined v-if="state.isMaximized" class="icon" />
          <fullscreen-outlined v-else class="icon" />
        </div>
      </div>
    </template>
    <template #closeIcon>
      <slot name="closeIcon">
        <icon-close style="font-size: 24px" />
      </slot>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #footer>
      <slot name="footer">
        <yl-button
          act-type="cancel"
          @click="
            $event => {
              $emit('cancel', $event);
              $emit('update:open', false);
            }
          "
          v-bind="cancelButtonProps"
        ></yl-button>
        <yl-button
          act-type="save"
          @click="$event => $emit('ok', $event)"
          :loading="confirmLoading"
          v-bind="okButtonProps"
        ></yl-button>
      </slot>
    </template>
    <template #modalRender="{ originVNode }">
      <div ref="modalRenderRef" :style="movable ? transformStyle : {}">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts">
export default {
  name: 'YlModal',
};
</script>

<script lang="ts" setup>
import { defineAsyncComponent, reactive, ref, type PropType } from 'vue';
import type { ButtonProps } from 'ant-design-vue';
import { IconClose } from '../icon/index';
import { isObject } from 'lodash';
import useModalMove from './useModalMove';

const YlButton = defineAsyncComponent(() => import('../button/index.vue'));

interface Maximizable {
  default: boolean; //默认是否最大化
  onlyMaximize: boolean; //仅能最大化，不能缩小
}

const emit = defineEmits(['ok', 'cancel', 'update:open', 'maximize']);
const props = defineProps({
  //为了实现全屏按钮，title统一由插槽处理
  title: {
    type: String,
    default: '',
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  maskClosable: {
    type: Boolean,
    default: false,
  },
  //可最大化，开启后出现最大化按钮，传对象的话可以设置默认最大化
  maximizable: {
    type: [Boolean, Object] as PropType<boolean | Maximizable>,
    default: true,
  },
  //弹窗可移动
  movable: {
    type: Boolean,
    default: true,
  },
  okButtonProps: {
    type: Object as PropType<ButtonProps>,
    default: () => ({}),
  },
  cancelButtonProps: {
    type: Object as PropType<ButtonProps>,
    default: () => ({}),
  },
  centered: {
    type: Boolean,
    default: true,
  },
  wrapClassName: {
    type: String,
    default: '',
  },
});

const state = reactive({
  isMaximized: isObject(props.maximizable) ? props.maximizable?.default || false : false,
  toMinimize: false,
  updateToMinimize: (val: boolean) => {
    state.toMinimize = val;
  },
});

const modalTitleRef = ref<HTMLElement>(null);
const modalRenderRef = ref<HTMLElement>(null);
const { transformStyle } = useModalMove(modalTitleRef, state);
const maximize = () => {
  state.toMinimize = state.isMaximized;
  state.isMaximized = !state.isMaximized;
  emit('maximize', state.isMaximized);
};

defineExpose({
  modalRenderRef,
});
</script>

<style lang="less" scoped>
.modal-title-wrapper {
  width: 100%;
  .modal-full-screen-btn {
    float: right;
    width: 56px;
    margin-right: 18px;
    text-align: center;
    cursor: pointer;
    margin-top: -2px;
    .icon {
      color: #999999;
    }
    &:hover {
      .icon {
        color: rgba(0, 0, 0, 0.75);
      }
    }
  }
}
</style>
