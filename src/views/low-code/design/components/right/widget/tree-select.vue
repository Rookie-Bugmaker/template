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
        <a-form-item label="选择限制">
          <a-radio-group v-model:value="config.options.limit" button-style="solid" :size="size">
            <a-radio-button value="none">无</a-radio-button>
            <a-radio-button value="leaf">仅叶子节点</a-radio-button>
            <a-radio-button value="notRoot">非根节点</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- <a-form-item label="允许多选">
          <a-switch
            v-model:checked="config.options.mode"
            checked-children="是"
            un-checked-children="否"
            checked-value="multiple"
            un-checked-value=""
            :size="size"
          />
        </a-form-item> -->
        <!-- <a-form-item label="最大展示标签数" v-if="config.options.mode === 'multiple'">
          <a-input-number
            v-model:value="config.options.maxTagCount"
            :min="1"
            :step="1"
          ></a-input-number>
        </a-form-item> -->
      </a-collapse-panel>
      <a-collapse-panel key="3" header="数据源">
        <a-form-item label="类型">
          <a-radio-group
            v-model:value="config.options.optionsType"
            button-style="solid"
            :size="size"
          >
            <!-- <a-radio-button value="fixed">固定</a-radio-button> -->
            <a-radio-button value="dataSource">数据源</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- <fixed-options-list v-if="config.options.optionsType === 'fixed'" /> -->
        <data-source-options-config
          v-if="config.options.optionsType === 'dataSource'"
          :isTreeSource="true"
        />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';
// import FixedOptionsList from '../common/fixed-options-list.vue';
import DataSourceOptionsConfig from '../common/data-source-options-config/index.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    // FixedOptionsList,
    DataSourceOptionsConfig,
  },
});
</script>

<style lang="less" scoped></style>
