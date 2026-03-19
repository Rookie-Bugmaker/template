<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="基础设置">
        <a-form-item label="标题">
          <a-input v-model:value="config.options.title" :size="size" />
        </a-form-item>
        <a-form-item label="标题函数">
          <func-input
            v-model:value="config.options.titleFunc"
            :size="size"
            title="函数"
            argsTips="title, state"
            placeholder="请输入函数体，标题会作为默认值显示，函数体返回的内容会动态替换标题文本内容"
          />
        </a-form-item>
        <a-form-item label="图标">
          <icon-select v-model:value="config.options.icon" placeholder="请选择图标" :size="size" />
        </a-form-item>
        <a-form-item label="卡片尺寸">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="default">默认</a-radio-button>
            <a-radio-button value="small">小</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconSelect from '@/components/icon-select/index.vue';
import BaseConfigForm from '../common/base-config-form.vue';
import FuncInput from '../common/func-input.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    IconSelect,
    FuncInput,
  },
});
</script>

<style lang="less" scoped></style>
