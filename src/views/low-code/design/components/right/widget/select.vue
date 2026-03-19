<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="占位提示">
          <a-input v-model:value="config.options.placeholder" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="default">中</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="清除按钮">
          <a-switch
            v-model:checked="config.options.allowClear"
            checked-children="显示"
            un-checked-children="隐藏"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="多选">
          <a-switch
            v-model:checked="config.options.mode"
            checked-children="是"
            un-checked-children="否"
            checked-value="multiple"
            un-checked-value=""
            :size="size"
            @change="config.options.autoSelectSingleOption = false"
          />
        </a-form-item>
        <a-form-item label="最大展示标签数" v-if="config.options.mode === 'multiple'">
          <a-input-number
            v-model:value="config.options.maxTagCount"
            :min="1"
            :step="1"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="只有一个选项时自动选中" v-else>
          <a-switch
            v-model:checked="config.options.autoSelectSingleOption"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
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
          <a-form-item label="显示提示文本">
            <a-switch
              v-model:checked="config.options.showDescription"
              checked-children="是"
              un-checked-children="否"
              :size="size"
            />
          </a-form-item>
          <fixed-options-list
            :value-type="config.options.optionsValueType"
            :show-description="config.options.showDescription"
          />
        </template>
        <data-source-options-config v-if="config.options.optionsType === 'dataSource'" />
      </a-collapse-panel>
      <a-collapse-panel key="4" header="数据填充">
        <brings-config :size="size" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';
import FixedOptionsList from '../common/fixed-options-list.vue';
import DataSourceOptionsConfig from '../common/data-source-options-config/index.vue';
import BringsConfig from '../common/brings-config.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    FixedOptionsList,
    DataSourceOptionsConfig,
    BringsConfig,
  },
});
</script>

<style lang="less" scoped></style>
