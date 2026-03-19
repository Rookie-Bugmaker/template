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
            <a-radio-button value="middle">中</a-radio-button>
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
        <a-form-item label="输入框只读">
          <a-switch
            v-model:checked="config.options.inputReadOnly"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="显示时间格式化">
          <a-select
            v-model:value="config.options.format"
            :size="size"
            allow-clear
            :dropdown-match-select-width="false"
          >
            <!-- <a-select-option value="">无</a-select-option> -->
            <a-select-option value="HH:mm:ss">HH:mm:ss</a-select-option>
            <a-select-option value="HH时mm分ss秒">HH时mm分ss秒</a-select-option>
          </a-select>
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
