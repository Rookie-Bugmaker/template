<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol" @submit="reloadTable()">
    <a-row :gutter="24" :wrap="true">
      <a-col
        :span="layoutSetting.itemSpan"
        v-for="(item, index) in options.searchFormFields"
        :key="index"
      >
        <a-form-item
          :label="isFunction(item.label) ? item.label() : item.label"
          style="margin-bottom: 12px"
        >
          <slot v-if="item.slot" :name="item.slot" :queryParams="queryParams"></slot>
          <a-input
            v-else
            v-model:value="queryParams[item.field]"
            allow-clear
            :ref="el => setRef(el, item.field)"
          />
        </a-form-item>
      </a-col>
      <a-col :span="layoutSetting.btnSpan">
        <a-form-item
          label=""
          style="margin-bottom: 12px"
          :class="{ 'btn-right': layoutSetting.btnRight }"
        >
          <a-space size="middle">
            <a-button shape="circle" title="重置" @click="resetFields(), focusSearchInput()">
              <template #icon><undo-outlined /></template>
            </a-button>
            <a-button shape="circle" type="primary" html-type="submit" title="查询">
              <template #icon><search-outlined /></template>
            </a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { injectPopupEditState } from './usePopupEdit';
import { isFunction } from 'lodash';

interface LayoutSetting {
  itemSpan: number;
  btnSpan: number;
  btnRight: boolean;
}

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export default defineComponent({
  name: 'PopupModalSearchForm',
  setup(_props, { expose }) {
    const { options, queryParams, resetFields, reloadTable } = injectPopupEditState();

    //计算合适的布局
    const layoutSetting = computed<LayoutSetting>(() => {
      const length = options.searchFormFields?.length;
      if (length === 1) {
        return {
          itemSpan: 12,
          btnSpan: 12,
          btnRight: false,
        };
      } else if (length === 2) {
        return {
          itemSpan: 10,
          btnSpan: 4,
          btnRight: false,
        };
      } else if (length % 2 === 0) {
        return {
          itemSpan: 12,
          btnSpan: 24,
          btnRight: true,
        };
      } else {
        return {
          itemSpan: 12,
          btnSpan: 12,
          btnRight: true,
        };
      }
    });

    const refMap = ref({});

    const setRef = (el, field) => {
      if (el) {
        refMap.value[field] = el;
      }
    };

    const focusSearchInput = () => {
      //判断搜索框有没有值，有值的话直接focus到对应的搜素框，没有的话则默认focus第一个搜索框
      const focusField = queryParams[options.searchTextField || options.textField]
        ? options.searchTextField || options.textField
        : options.searchFormFields?.[0]?.field;
      refMap.value?.[focusField]?.focus();
    };

    expose({
      focusSearchInput,
    });

    return {
      ...formLayout,
      options,
      queryParams,
      layoutSetting,
      resetFields,
      reloadTable,
      refMap,
      setRef,
      focusSearchInput,
      isFunction,
    };
  },
});
</script>

<style lang="less" scoped>
.btn-right {
  justify-content: flex-end;
  text-align: right;
  :deep(.ant-form-item-control) {
    max-width: 100%;
  }
}
</style>
