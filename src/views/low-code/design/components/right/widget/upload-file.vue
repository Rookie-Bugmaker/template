<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="类型">
          <a-radio-group v-model:value="config.options.type" button-style="solid" :size="size">
            <a-radio-button value="button">按钮</a-radio-button>
            <a-radio-button value="input">输入框</a-radio-button>
            <a-radio-button value="dialog">弹窗</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <template v-if="config.options.type === 'input'">
          <a-form-item label="迷你选择按钮">
            <a-switch
              v-model:checked="config.options.miniSelectBtn"
              checked-children="是"
              un-checked-children="否"
              :size="size"
            />
          </a-form-item>
          <a-form-item label="占位提示">
            <a-input v-model:value="config.options.placeholder" :size="size" allow-clear />
          </a-form-item>
        </template>
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="middle">中</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="可在线预览文件">
          <a-switch
            v-model:checked="config.options.preview"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="允许上传多个文件">
          <a-switch
            v-model:checked="config.options.multiple"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="最大文件数量" v-if="config.options.multiple">
          <a-input-number
            v-model:value="config.options.maxCount"
            :min="1"
            :step="1"
            :size="size"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="最大文件体积">
          <a-input-number
            v-model:value="config.options.maxFileSize"
            :min="1"
            :step="1024"
            :size="size"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="文件类型限制">
          <a-input v-model:value="config.options.accept" :size="size" allow-clear></a-input>
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
