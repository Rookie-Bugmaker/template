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
        <a-form-item label="字典编码">
          <a-input v-model:value="config.options.dictCode" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="使用编码作为控件值">
          <a-switch
            v-model:checked="config.options.codeValue"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <!-- <a-form-item label="允许多选">
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
        </a-form-item> -->
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
  },
});
</script>

<style lang="less" scoped></style>
