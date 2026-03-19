<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="选项类型">
          <a-radio-group
            v-model:value="config.options.optionType"
            button-style="solid"
            :size="size"
            @change="config.options.orientation = 'horizontal'"
          >
            <a-radio-button value="default">默认</a-radio-button>
            <a-radio-button value="button">按钮</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="按钮样式" v-if="config.options.optionType === 'button'">
          <a-radio-group
            v-model:value="config.options.buttonStyle"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="outline">描边</a-radio-button>
            <a-radio-button value="solid">实心</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="方向" v-if="config.options.optionType === 'default'">
          <a-radio-group
            v-model:value="config.options.orientation"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="horizontal">水平</a-radio-button>
            <a-radio-button value="vertical">垂直</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="大小" v-if="config.options.optionType === 'button'">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="default">中</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
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
