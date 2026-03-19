<template>
  <a-form-item label="数据源类型">
    <a-radio-group
      v-model:value="designerState.currentConfig.options.dataSource.type"
      button-style="solid"
      :size="size"
    >
      <a-radio-button value="table">表结构</a-radio-button>
      <a-radio-button value="view">自定义SQL</a-radio-button>
    </a-radio-group>
  </a-form-item>
  <a-form-item label="数据源">
    <data-source-popedit
      v-model:value="designerState.currentConfig.options.dataSource.objectId"
      :data-source-type="designerState.currentConfig.options.dataSource.type"
      :allow-cross-application="true"
      @select="handleSelectDataSource"
      :size="size"
    ></data-source-popedit>
  </a-form-item>
  <a-form-item label="值字段">
    <field-selector
      v-model:value="designerState.currentConfig.options.valueField"
      :type="designerState.currentConfig.options.dataSource.type"
      :data-source-id="designerState.currentConfig.options.dataSource.objectId"
      :size="size"
    ></field-selector>
  </a-form-item>
  <a-form-item label="描述字段">
    <field-selector
      v-model:value="designerState.currentConfig.options.textField"
      :type="designerState.currentConfig.options.dataSource.type"
      :data-source-id="designerState.currentConfig.options.dataSource.objectId"
      :size="size"
    ></field-selector>
  </a-form-item>
  <template v-if="designerState.currentConfig.type === WidgetType.Select">
    <a-form-item label="显示提示文本">
      <a-switch
        v-model:checked="designerState.currentConfig.options.showDescription"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="提示字段" v-if="designerState.currentConfig.options.showDescription">
      <field-selector
        v-model:value="designerState.currentConfig.options.descriptionField"
        :type="designerState.currentConfig.options.dataSource.type"
        :data-source-id="designerState.currentConfig.options.dataSource.objectId"
        :size="size"
      ></field-selector>
    </a-form-item>
  </template>
  <a-form-item label="父字段" v-if="isTreeSource">
    <field-selector
      v-model:value="designerState.currentConfig.options.parentField"
      :type="designerState.currentConfig.options.dataSource.type"
      :data-source-id="designerState.currentConfig.options.dataSource.objectId"
      :size="size"
    ></field-selector>
  </a-form-item>
  <a-form-item label="">
    <a-button type="primary" block @click="state.filterVisible = true">过滤条件设置</a-button>
    <filter-config v-model:open="state.filterVisible" :config="designerState.currentConfig" />
    <a-button
      block
      @click="state.paramsVisible = true"
      style="margin-top: 8px"
      v-show="designerState.currentConfig.options.dataSource.type === 'view'"
    >
      自定义条件设置
    </a-button>
    <params-config v-model:open="state.paramsVisible" :config="designerState.currentConfig" />
    <a-button block @click="state.sortVisible = true" style="margin-top: 8px">排序设置</a-button>
    <sort-config v-model:open="state.sortVisible" :config="designerState.currentConfig" />
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';
import type { PropType } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import FieldSelector from './field-selector.vue';
import DataSourcePopedit from '../data-source-popedit.vue';
import FilterConfig from '../filter-config/index.vue';
import ParamsConfig from '../params-config/index.vue';
import SortConfig from '../sort-config.vue';
import { WidgetType } from '@/views/low-code/design/typing';

export default defineComponent({
  name: '',
  props: {
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
    isTreeSource: {
      //是否为树形结构的数据源
      type: Boolean,
      default: false,
    },
  },
  emits: ['select-data-source'],
  setup(_props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    const handleSelectDataSource = (v, record) => {
      emit('select-data-source', v, record);
    };

    const state = reactive({
      filterVisible: false,
      paramsVisible: false,
      sortVisible: false,
    });

    return { WidgetType, designerState, handleSelectDataSource, state };
  },
  components: {
    DataSourcePopedit,
    FieldSelector,
    FilterConfig,
    ParamsConfig,
    SortConfig,
  },
});
</script>

<style lang="less" scoped></style>
