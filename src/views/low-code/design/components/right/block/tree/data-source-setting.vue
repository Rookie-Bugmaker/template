span
<template>
  <a-drawer
    :open="open"
    title="树-数据源设置"
    :width="960"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <a-row type="flex" :gutter="[8, 0]">
      <a-col flex="220px" style="height: 100%">
        <a-card title="数据源" size="small" :bordered="false">
          <a-form :model="formConfig.dataSource" layout="vertical">
            <a-form-item label="查询-数据源类型">
              <a-radio-group
                v-model:value="formConfig.dataSource.type"
                button-style="solid"
                size="default"
              >
                <a-radio-button value="table">表结构</a-radio-button>
                <a-radio-button value="view">自定义SQL</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="查询-数据源">
              <data-source-popedit
                v-model:value="formConfig.dataSource.objectId"
                :data-source-type="formConfig.dataSource.type"
                :allow-cross-group="true"
                size="middle"
                allow-clear
              />
            </a-form-item>
            <a-divider />
            <a-form-item label="数据源">
              <data-source-popedit
                v-model:value="formConfig.dataSource.dataObjectId"
                :allow-cross-group="true"
                data-source-type="table"
                size="middle"
              />
            </a-form-item>
            <a-form-item label="数据源-主键">
              <a-input
                v-model:value="formConfig.dataSource.dataObjectPrimaryKey"
                size="middle"
                :disabled="true"
              />
            </a-form-item>
            <!-- <a-form-item label="删除-前后置增强">
              <a-input
                v-model:value="formConfig.dataSource.beanName"
                size="middle"
                placeholder="beanName"
              />
            </a-form-item> -->
          </a-form>
        </a-card>
      </a-col>
      <a-col flex="auto" style="height: 100%">
        <a-card title="数据源过滤条件" size="small" :bordered="false" style="margin-top: 15px">
          <block-filter-config :config="config" />
        </a-card>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';
import DataSourcePopedit from '../../common/data-source-popedit.vue';
// import DataSourceFieldSelector from '../../common/data-source-field-selector.vue';
import BlockFilterConfig from '../../common/block-filter-config.vue';

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
    const state = reactive({
      objectFieldList: [],
      dataObjectFieldList: [],
    });

    const formConfig = computed(() => props.config);

    const closeDrawer = () => {
      emit('update:open', false);
    };

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
      () => props.config.dataSource.objectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList(props.config.dataSource.type, n);
          state.objectFieldList = fieldList;
        }
      },
      { immediate: true },
    );

    watch(
      () => props.config.dataSource.dataObjectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList('table', n);
          state.dataObjectFieldList = fieldList;
          formConfig.value.dataSource.dataObjectPrimaryKey = fieldList.find(
            f => f.primaryKey === 'Y',
          )?.fieldCode;
        }
      },
      { immediate: true },
    );

    return {
      state,
      formConfig,
      closeDrawer,
    };
  },
  components: {
    DataSourcePopedit,
    // DataSourceFieldSelector,
    BlockFilterConfig,
  },
});
</script>

<style lang="less" scoped></style>
