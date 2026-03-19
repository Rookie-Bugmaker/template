<template>
  <a-drawer
    :open="open"
    title="数据源排序"
    :width="760"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <template v-if="designerState.currentConfig?.options?.dataSource?.sort">
      <div
        v-for="(cItem, cIndex) in designerState.currentConfig?.options?.dataSource?.sort"
        :key="cIndex"
        style="margin-bottom: 12px"
      >
        <data-source-field-selector
          v-model:value="cItem.field"
          style="width: 55%"
          placeholder="请选排序字段"
          :fieldList="state.fieldList"
        />
        <a-select v-model:value="cItem.type" style="width: 20%" placeholder="请选择类型">
          <a-select-option value="asc">升序</a-select-option>
          <a-select-option value="desc">降序</a-select-option>
        </a-select>
        <a-select v-model:value="cItem.nulls" style="width: 20%" placeholder="请选择空值位置">
          <a-select-option value="none">不处理</a-select-option>
          <a-select-option value="first">在最前</a-select-option>
          <a-select-option value="last">在最后</a-select-option>
        </a-select>

        <delete-outlined
          style="margin-left: 10px"
          @click="() => designerState.currentConfig?.options?.dataSource?.sort.splice(cIndex, 1)"
        />
      </div>
      <a-button type="dashed" block @click="addSort">
        <template #icon><plus-outlined /></template>
        添加排序
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, inject } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { FieldType } from '@/views/low-code/design/typing/index';

import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';

import DataSourceFieldSelector from './data-source-field-selector.vue';

export default defineComponent({
  name: '',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  emit: ['update:open'],
  setup(props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    //版本差异,缺少属性,旧版本没有sort这个属性
    if (!designerState.currentConfig?.options?.dataSource?.sort) {
      designerState.currentConfig.options.dataSource['sort'] = [];
    }

    const closeDrawer = () => {
      emit('update:open', false);
    };

    const state = reactive({
      fieldList: [],
    });

    const getFieldList = async (type: string, objectId: string) => {
      if (type === 'table') {
        const { success, result } = await getTableById(objectId);
        if (success && result) {
          return result.fieldList;
        }
      }
      if (type === 'view') {
        const { success, result } = await getViewById(objectId);
        if (success && result) {
          return result.fieldList;
        }
      }
      return [];
    };

    watch(
      () => props.config.options.dataSource.objectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList(props.config.options.dataSource.type, n);
          state.fieldList = fieldList;
        }
      },
      { immediate: true },
    );

    const addSort = () => {
      designerState.currentConfig?.options?.dataSource?.sort.push({
        field: '',
        type: 'desc',
        nulls: 'none',
      });
    };

    return {
      FieldType,
      designerState,
      closeDrawer,
      state,
      addSort,
    };
  },
  components: {
    DataSourceFieldSelector,
  },
});
</script>

<style lang="less" scoped></style>
