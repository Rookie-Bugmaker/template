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
        <a-form-item label="集编码">
          <a-input v-model:value="config.options.setCode" :size="size" allow-clear></a-input>
        </a-form-item>
        <a-form-item label="使用值编码作为控件值">
          <a-switch
            v-model:checked="config.options.codeValue"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="父值集项">
          <block-field-selector
            v-model:value="config.options.parentValue"
            style="width: 100%"
            placeholder="请选择值父值集项"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="父项使用值编码作为控件值" v-if="config.options.parentValue">
          <a-switch
            v-model:checked="config.options.parentCodeValue"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="允许多选">
          <a-switch
            v-model:checked="config.options.multiple"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="最大展示标签数" v-if="config.options.multiple">
          <a-input-number
            v-model:value="config.options.maxTagCount"
            :min="1"
            :step="1"
            :size="size"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="排除项">
          <value-set-code-select
            v-model:value="config.options.excludes"
            :code="config.options.setCode"
            :size="size"
          ></value-set-code-select>
        </a-form-item>
        <a-form-item label="包含项">
          <value-set-code-select
            v-model:value="config.options.includes"
            :code="config.options.setCode"
            :size="size"
          ></value-set-code-select>
        </a-form-item>
        <a-form-item label="禁用项">
          <value-set-code-select
            v-model:value="config.options.disabledOptions"
            :code="config.options.setCode"
            :size="size"
          ></value-set-code-select>
        </a-form-item>
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';
import BlockFieldSelector from '../common/filter-config/block-field-selector.vue';
import ValueSetCodeSelect from '../common/value-set-code-select.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    BlockFieldSelector,
    ValueSetCodeSelect,
  },
});
</script>

<style lang="less" scoped></style>
