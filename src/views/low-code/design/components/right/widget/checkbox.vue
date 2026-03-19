<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="方向">
          <a-radio-group
            v-model:value="config.options.orientation"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="horizontal">水平</a-radio-button>
            <a-radio-button value="vertical">垂直</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="数据源">
        <a-form-item label="类型">
          <a-radio-group
            v-model:value="config.options.optionsType"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="fixed">固定</a-radio-button>
            <a-radio-button value="dataSource">数据源</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <template v-if="config.options.optionsType === 'fixed'">
          <a-form-item label="值为数字（默认为字符）">
            <a-switch
              v-model:checked="config.options.optionsValueType"
              checked-children="是"
              un-checked-children="否"
              checked-value="number"
              un-checked-value="string"
              :size="size"
            />
          </a-form-item>
          <fixed-options-list :value-type="config.options.optionsValueType" />
        </template>
        <data-source-options-config v-if="config.options.optionsType === 'dataSource'" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';
import FixedOptionsList from '../common/fixed-options-list.vue';
import DataSourceOptionsConfig from '../common/data-source-options-config/index.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    FixedOptionsList,
    DataSourceOptionsConfig,
  },
});
</script>

<style lang="less" scoped></style>
