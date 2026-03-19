<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="default">中</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="打开值">
          <a-input v-model:value="config.options.checkedValue" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="关闭值">
          <a-input v-model:value="config.options.unCheckedValue" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="打开描述">
          <a-input v-model:value="config.options.checkedChildren" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="关闭描述">
          <a-input v-model:value="config.options.unCheckedChildren" :size="size" allow-clear />
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
