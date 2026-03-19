<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="占位提示">
          <a-input v-model:value="config.options.placeholder" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="清除按钮">
          <a-switch
            v-model:checked="config.options.allowClear"
            checked-children="显示"
            un-checked-children="隐藏"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="展示字数">
          <a-switch
            v-model:checked="config.options.showCount"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="最小行数">
          <a-input-number
            v-model:value="config.options.autosize.minRows"
            :min="1"
            :max="config.options.autosize.maxRows"
            :step="1"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="最大行数">
          <a-input-number
            v-model:value="config.options.autosize.maxRows"
            :min="config.options.autosize.minRows"
            :max="10"
            :step="1"
          ></a-input-number>
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
