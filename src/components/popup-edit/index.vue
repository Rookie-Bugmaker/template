<template>
  <a-input-group
    compact
    v-if="state.multiple === true"
    :class="['popup-edit-multi', { 'is-disabled': disabled }]"
    style="width: 100%"
  >
    <a-select
      v-model:value="state.selectedKeys"
      :options="state.selectedRows"
      :field-names="{ label: options.textField, value: options.valueField }"
      style="width: calc(100% - 32px)"
      :disabled="disabled"
      :allowClear="allowClear"
      mode="multiple"
      max-tag-count="responsive"
      v-bind="$attrs"
      @deselect="handleDeselect"
    ></a-select>
    <span class="select-btn">
      <loading-outlined v-if="state.loading" class="select-btn-icon" />
      <unordered-list-outlined
        v-if="!!!state.loading"
        @click="handleModalOpen"
        class="select-btn-icon"
      />
    </span>
  </a-input-group>
  <a-input
    v-else
    :class="['popup-edit', { 'is-disabled': disabled }]"
    :value="textInputValue"
    style="width: 100%"
    :readonly="inputReadonly"
    :disabled="disabled"
    v-bind="$attrs"
    @update:value="handleUpdateTextInputValue"
  >
    <template #suffix>
      <close-circle-filled
        v-if="allowClear && textInputValue && !disabled"
        style="color: rgba(0, 0, 0, 0.5); font-size: 12px"
        @click="clearValue"
      />
    </template>
    <template #addonAfter>
      <loading-outlined v-show="state.loading" />
      <menu-outlined v-show="!!!state.loading" @click="handleModalOpen" />
    </template>
  </a-input>
  <popup-modal
    v-if="state.initRenderModal"
    :open="state.modalVisible"
    @cancel="() => (state.modalVisible = false)"
    :getContainer="getContainer"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps"></slot>
    </template>
  </popup-modal>
</template>

<script lang="ts">
import { defineComponent, watch, nextTick } from 'vue';
import type { PropType } from 'vue';
import type { EmitEvent, Options, Value } from './typing';
import { usePopupEdit } from './usePopupEdit';
import PopupModal from './popup-modal.vue';
import { isEqual } from 'lodash';

export default defineComponent({
  name: 'PopupEdit',
  props: {
    value: {
      type: [String, Number, Array] as PropType<Value>,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    //多选的情况下，string返回的结果是,隔开的字符串，array返回一个数组
    valueType: {
      type: String as PropType<'string' | 'array'>,
      default: 'string',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object as PropType<Options>,
      default: () => {
        return {};
      },
    },
    //指定 Modal 挂载的 HTML 节点
    getContainer: {
      type: Function,
      default: () => document.body,
    },
    //分页大小
    pageSize: {
      type: Number,
      default: 10,
    },
    /**
     * 输入框只读（默认false）（此属性仅单选的情况下可用）
     * 不只读情况下，会将输入值直接当做textField|searchTextField进行分页搜索。（注：请确保在getDataByPage接口中，支持textField|searchTextField作为查询条件）
     * 若查询结果为空，则清空输入框；若查询结果只有一条，则赋值该行数据；若查询结果有多行数据，则弹出选择框
     */
    inputReadonly: {
      type: Boolean,
      default: false,
    },
    /**跳过第一次带出 */
    skipFirstBring: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value', 'change', 'select', 'clear', 'bring'], //bring 带出事件，带出当前值与当前数据项
  expose: ['reloadModalTable'],
  setup(props, { emit, expose }) {
    const emitEvent: EmitEvent = {
      updateValue: value => {
        emit('update:value', value);
      },
      change: (value, record) => {
        emit('change', value, record);
      },
      select: (value, record) => {
        emit('select', value, record);
      },
      bring: (value, record) => {
        emit('bring', value, record);
      },
      clear: () => {
        emit('clear');
      },
    };
    const {
      state,
      clearValue,
      handleDeselect,
      reloadTable,
      initValueInfo,
      textInputValue,
      handleUpdateTextInputValue,
    } = usePopupEdit(props, emitEvent);

    watch(
      () => props.value,
      (n, o) => {
        if (!isEqual(n, o)) {
          let keyValues = [];
          if (state.multiple) {
            if (props.valueType === 'string') {
              keyValues = n ? (n as string).split(',') : [];
            } else {
              keyValues = (n as (string | number)[]) || [];
            }
          } else {
            keyValues = n ? [n as string | number] : [];
          }
          //emit update:value的时候也会触发此监听，需判断一下控件值与当前存储值是否相等，相等则不必去重新加载数据
          if (!isEqual(keyValues, state.selectedKeys)) {
            initValueInfo(n);
          }
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );

    const handleModalOpen = () => {
      if (!props.disabled) {
        //默认不渲染Modal，初次打开时才渲染
        state.initRenderModal = true;
        state.modalVisible = true;
        nextTick(() => {
          reloadTable();
        });
      }
    };

    const reloadModalTable = reloadTable;

    expose({
      reloadModalTable,
    });

    return {
      state,
      clearValue,
      handleDeselect,
      handleModalOpen,
      reloadModalTable,
      textInputValue,
      handleUpdateTextInputValue,
    };
  },
  components: {
    PopupModal,
  },
});
</script>
<style lang="less" scoped>
.popup-edit {
  &.is-disabled {
    :deep(.ant-input-group-addon) {
      background-color: #eeeeee;
      cursor: not-allowed;
      > span {
        cursor: not-allowed;
      }
    }
  }
}
.popup-edit-multi {
  &.is-disabled {
    .select-btn {
      background-color: #eeeeee;
    }
  }
  .select-btn {
    position: absolute;
    width: 32px;
    height: 100%;
    color: #111827;
    font-weight: normal;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    white-space: nowrap;
    text-align: center;
    vertical-align: middle;
    list-style: none;
    background-color: #fafafa;
    border: 1px solid #dae1e8;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    font-feature-settings: 'tnum';
    .select-btn-icon {
      vertical-align: bottom;
    }
  }
}
</style>
