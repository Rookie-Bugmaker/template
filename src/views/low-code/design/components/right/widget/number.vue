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
        <a-form-item label="增减按钮">
          <a-switch
            v-model:checked="config.options.controls"
            checked-children="显示"
            un-checked-children="隐藏"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="最小值">
          <a-input-number v-model:value="config.options.min" :size="size"></a-input-number>
        </a-form-item>
        <a-form-item label="最大值">
          <a-input-number v-model:value="config.options.max" :size="size"></a-input-number>
        </a-form-item>
        <a-form-item label="步长">
          <a-input-number v-model:value="config.options.step" :size="size"></a-input-number>
        </a-form-item>
        <a-form-item label="数值精度">
          <a-input-number v-model:value="config.options.precision" :size="size"></a-input-number>
        </a-form-item>
        <a-form-item label="格式化">
          <a-input v-model:value="config.options.formatter" :size="size"></a-input>
        </a-form-item>
        <a-form-item label="解析器">
          <a-input v-model:value="config.options.parser" :size="size"></a-input>
        </a-form-item>
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
