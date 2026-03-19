<template>
  <a-button
    :disabled="config.options.disabled || itemDisabledCondition()"
    :type="config.options.type"
    :size="config.options.size"
    :shape="config.options.shape"
    :danger="config.options.danger"
    @click="onClick"
  >
    <slot>
      <span>{{ config.options.text }}</span>
    </slot>
  </a-button>
  <custom-modal
    v-if="eh.modalState.open"
    v-model:open="eh.modalState.open"
    :path="eh.modalState.path"
    destroyOnClose
    v-bind="eh.modalState"
    :params="eh.modalState.params"
    @ok="
      () => {
        eh.modalState?.ok?.();
      }
    "
    @cancel="
      () => {
        eh.modalState?.cancel?.();
        eh.modalState.open = false;
      }
    "
  ></custom-modal>
  <page-model
    v-if="config.options?.openModal?.configTreeId && pageModalState.open"
    v-model:open="pageModalState.open"
    :width="config.options.openModal?.width ?? 800"
    :title="config.options.openModal?.title ?? '弹窗页'"
    :maximizable="{ default: !!config.options.openModal?.defaultMaximize }"
    :configTreeId="config.options?.openModal?.configTreeId"
    :params="pageModalState.params"
  />
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';
import CustomModal from '@/views/low-code/parser/hooks/useEventHandler/custom-modal.vue';
import PageModel from '@/views/low-code/parser/components/common/page-modal.vue';
import { getFilterValue } from '@/views/low-code/parser/utils/filter';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    //如果按钮是在table行上的话，table会将当前行数据传递进来，给事件用；表单也会传递表单数据，也叫rowData
    rowData: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const parserState = inject(parserStateInjectKey);

    const eh = useEventHandler();

    const pageModalState = reactive({
      open: false,
      params: {
        parentParams: {},
      },
    });
    const setParentParams = () => {
      const parentParamList =
        props.config.options?.openModal?.params?.map(({ key, valueType, value }) => {
          return {
            key,
            value: getFilterValue({
              valueType,
              value,
              blockRefMap: parserState?.block,
              blockConfigMap: parserState?.blockConfig,
              modelData: props.rowData,
            }),
          };
        }) || [];
      pageModalState.params.parentParams = parentParamList.reduce((a, b) => {
        a[b.key] = b.value;
        return a;
      }, {});
    };

    const onClick = event => {
      if (props.config.options?.eventType === 'custom') {
        return eval(`({state,e,eh,rowData})=>{${props.config.options.customFn}}`)({
          state: parserState,
          e: event,
          eh,
          rowData: props.rowData,
        });
      } else if (props.config.options?.openModal?.configTreeId) {
        pageModalState.open = true;
        setParentParams();
      } else {
        //如无按钮绑定事件，则按父组件传递的onClick绑定
        return props.config.options.onClick;
      }
    };

    const itemDisabledCondition = () => {
      const condition =
        props.config.options?.disabledCondition &&
        parserState?.conditions?.find(f => f.uid === props.config.options?.disabledCondition);
      if (condition) {
        const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
        return f(null, props.rowData, parserState, eh);
      } else {
        return false;
      }
    };

    return { parserState, eh, onClick, itemDisabledCondition, pageModalState };
  },
  components: {
    CustomModal,
    PageModel,
  },
});
</script>

<style lang="less" scoped></style>
