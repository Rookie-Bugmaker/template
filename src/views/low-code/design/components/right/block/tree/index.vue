<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="基础设置">
        <!-- <a-form-item label="标题">
          <a-input v-model:value="config.options.title" :size="size" />
        </a-form-item> -->
        <!-- <a-form-item label="禁用">
          <a-switch
            v-model:checked="config.options.disabled"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item> -->
        <a-form-item label="禁用节点">
          <a-radio-group
            v-model:value="config.options.disabledType"
            button-style="solid"
            :size="size"
          >
            <a-radio-button :value="null">无</a-radio-button>
            <a-radio-button value="root">根节点</a-radio-button>
            <a-radio-button value="notLeaf">非叶子节点</a-radio-button>
            <a-radio-button value="custom">自定义</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="节点禁用条件" v-if="config.options.disabledType == 'custom'">
          <condition-selector v-model:value="config.options.disabledCondition" :size="size" />
        </a-form-item>
        <!-- <a-form-item label="默认打开全部节点">
          <a-switch
            v-model:checked="config.options.defaultExpandAll"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="自动展开父节点">
          <a-switch
            v-model:checked="config.options.autoExpandParent"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item> -->
        <a-form-item label="显示连接线">
          <a-switch
            v-model:checked="config.options.showLine"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <!-- <a-form-item label="显示图标">
          <a-switch
            v-model:checked="config.options.showIcon"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item> -->
        <a-form-item label="显示搜索框">
          <a-switch
            v-model:checked="config.options.showSearch"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="搜索框占位符" v-if="config.options.showSearch">
          <a-input v-model:value="config.options.searchPlaceholder" :size="size" />
        </a-form-item>

        <a-form-item label="主键字段">
          <data-source-field-selector
            v-model:value="config.options.fieldNames.key"
            :field-list="state.objectFieldList"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="父键字段">
          <data-source-field-selector
            v-model:value="config.options.fieldNames.parentKey"
            :field-list="state.objectFieldList"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="标题字段">
          <data-source-field-selector
            v-model:value="config.options.fieldNames.title"
            :field-list="state.objectFieldList"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="描述字段">
          <data-source-field-selector
            v-model:value="config.options.fieldNames.descriptionKey"
            :field-list="state.objectFieldList"
            :size="size"
          />
        </a-form-item>
        <!-- <a-form-item label="子项字段">
          <a-input v-model:value="config.options.fieldNames.children" :size="size" />
        </a-form-item> -->
      </a-collapse-panel>
      <a-collapse-panel key="3" header="数据源">
        <a-button type="primary" block @click="state.dataSourceSettingVisible = true">
          数据源设置
        </a-button>
        <data-source-setting v-model:open="state.dataSourceSettingVisible" :config="config" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import BaseConfigForm from '../../common/base-config-form.vue';
import DataSourceSetting from './data-source-setting.vue';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';
import DataSourceFieldSelector from '../../common/data-source-field-selector.vue';
import ConditionSelector from '../../common/condition-selector.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const state = reactive({ dataSourceSettingVisible: false, objectFieldList: [] });

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
        console.log(n, o);
        if (n && n !== o) {
          const fieldList = await getFieldList(props.config.dataSource.type, n);

          state.objectFieldList = fieldList;
        }
      },
      { immediate: true },
    );

    return { state };
  },
  components: {
    BaseConfigForm,
    DataSourceSetting,
    DataSourceFieldSelector,
    ConditionSelector,
  },
});
</script>

<style lang="less" scoped></style>
