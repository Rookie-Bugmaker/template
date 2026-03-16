<template>
  <yl-modal
    :title="isFunction(options.modalTitle) ? options.modalTitle() : options.modalTitle || '请选择'"
    :open="open"
    :width="options.modalWidth || 720"
    centered
    :bodyStyle="{ padding: '12px 24px 4px' }"
    @cancel="
      () => {
        resetFields();
        $emit('cancel');
      }
    "
    :footer="state.multiple ? undefined : null"
  >
    <template #footer>
      <yl-button
        act-type="save"
        v-show="state.multiple"
        @click="confirmSelect"
        :loading="tableState.loading"
      ></yl-button>
    </template>
    <template v-if="options.searchFormFields?.length">
      <search-form @search="reload" @reset="resetFields" ref="searchFormRef">
        <template
          v-for="name in Object.keys($slots).filter(f => f.startsWith('search-form-'))"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps"></slot>
        </template>
      </search-form>
      <a-divider style="margin: 0 0 12px"></a-divider>
    </template>

    <table-selector>
      <template
        v-for="name in Object.keys($slots).filter(f => f.startsWith('table-'))"
        #[name]="slotProps"
      >
        <slot :name="name" v-bind="slotProps"></slot>
      </template>
    </table-selector>
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue';
import { injectPopupEditState } from './usePopupEdit';

import SearchForm from './search-form.vue';
import TableSelector from './table-selector.vue';

import { isFunction } from 'lodash';

export default defineComponent({
  name: 'PopupModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel'],
  setup(props, { slots }) {
    const {
      state,
      confirmSelect,
      options,
      queryParams,
      resetFields,
      validateInfos,
      tableState,
      reloadTable: reload,
      handleTableChange,
    } = injectPopupEditState();

    const searchFormRef = ref(null);

    watch(
      () => props.open,
      (n, o) => {
        if (n && n !== o) {
          nextTick(() => {
            searchFormRef.value?.focusSearchInput?.();
          });
        }
      },
      {
        immediate: true,
      },
    );

    return {
      slots,
      state,
      confirmSelect,
      options,
      queryParams,
      resetFields,
      validateInfos,
      reload,
      tableState,
      handleTableChange,
      searchFormRef,
      isFunction,
    };
  },
  components: {
    SearchForm,
    TableSelector,
  },
});
</script>
