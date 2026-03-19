<template>
  <a-form-item label="启用工作流">
    <a-switch
      v-model:checked="tableConfig.workflow.enabled"
      checked-children="是"
      un-checked-children="否"
      :size="size"
    />
  </a-form-item>
  <template v-if="tableConfig.workflow.enabled">
    <a-form-item label="流程模板">
      <a-select v-model:value="tableConfig.workflow.templateAlias" style="width: 100%" :size="size">
        <a-select-option v-for="item in state.templateList" :key="item.templateAlias">
          {{ item.templateName }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="单据数据源">
      <data-source-popedit
        v-model:value="tableConfig.dataSource.dataObjectId"
        data-source-type="table"
        :allow-cross-group="true"
        :size="size"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item label="单据主键字段">
      <a-input
        v-model:value="tableConfig.dataSource.dataObjectPrimaryKey"
        :size="size"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item label="单据编号字段">
      <data-source-field-selector
        v-model:value="tableConfig.workflow.bizCodeField"
        :field-list="state.dataObjectFieldList"
        :size="size"
      />
    </a-form-item>
  </template>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { defaultConfig } from '@/views/low-code/design/typing/block/table';
import { findGroupList } from '@/api/workflow/group';
import DataSourcePopedit from '../../common/data-source-popedit.vue';
import DataSourceFieldSelector from '../../common/data-source-field-selector.vue';
import { getTableById } from '@/api/low-code/data-set/table';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
  },
  setup(props) {
    const tableConfig = computed(() => props.config);
    //版本差异,缺少属性,旧版本没有importAndExport这个属性
    if (!tableConfig.value.workflow) {
      tableConfig.value.workflow = defaultConfig.workflow;
    }

    const state = reactive({
      templateList: [],
      dataObjectFieldList: [],
    });
    const getTemplateList = () => {
      findGroupList('').then(res => {
        if (res.success && res.result) {
          state.templateList = res.result
            ?.reduce((a, b) => {
              return a.concat(b.templateList);
            }, [])
            ?.map(m => {
              return {
                templateAlias: m.baseConfig.templateAlias,
                templateName: m.baseConfig.templateName,
              };
            });
        }
      });
    };
    getTemplateList();

    const getFieldList = async (objectId: string) => {
      const { success, result } = await getTableById(objectId);
      if (success && result) {
        return result.fieldList;
      }
      return [];
    };

    watch(
      () => props.config.dataSource.dataObjectId,
      async (n, o) => {
        if (n && n !== o) {
          const fieldList = await getFieldList(n);
          state.dataObjectFieldList = fieldList;
        }
      },
      { immediate: true },
    );

    return { tableConfig, state };
  },
  components: { DataSourcePopedit, DataSourceFieldSelector },
});
</script>

<style lang="less" scoped></style>
