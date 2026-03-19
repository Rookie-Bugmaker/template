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
        <a-form-item label="弹窗标题">
          <a-input v-model:value="config.options.modalTitle" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="弹窗宽度">
          <a-input-number v-model:value="config.options.modalWidth" :size="size" :min="50" />
        </a-form-item>
        <a-form-item label="多选">
          <a-switch
            v-model:checked="config.options.multiple"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="数据源">
        <data-source-options-config />
        <search-form-fields-config
          :data-source-id="config.options.dataSource.objectId"
          :type="config.options.dataSource.type"
        />
        <table-columns-config
          :data-source-id="config.options.dataSource.objectId"
          :type="config.options.dataSource.type"
        />
      </a-collapse-panel>
      <a-collapse-panel key="4" header="数据填充">
        <brings-config :size="size" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../../common/base-config-form.vue';
import DataSourceOptionsConfig from '../../common/data-source-options-config/index.vue';
import SearchFormFieldsConfig from './search-form-fields-config.vue';
import TableColumnsConfig from './table-columns-config.vue';
import BringsConfig from '../../common/brings-config.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    DataSourceOptionsConfig,
    SearchFormFieldsConfig,
    TableColumnsConfig,
    BringsConfig,
  },
});
</script>

<style lang="less" scoped></style>
