<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="页签设置">
        <tab-panes :config="config" />
      </a-collapse-panel>
      <a-collapse-panel key="3" header="基础设置">
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="default">默认</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="页签类型">
          <a-radio-group v-model:value="config.options.type" button-style="solid" :size="size">
            <a-radio-button value="line">下划线</a-radio-button>
            <a-radio-button value="card">卡片</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="页签居中">
          <a-switch
            v-model:checked="config.options.centered"
            checked-children="开"
            un-checked-children="关"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="页签位置">
          <a-radio-group
            v-model:value="config.options.tabPosition"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="top">上</a-radio-button>
            <a-radio-button value="right">右</a-radio-button>
            <a-radio-button value="bottom">下</a-radio-button>
            <a-radio-button value="left">左</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="页签间隙">
          <a-input-number
            v-model:value="config.options.tabBarGutter"
            :min="0"
            :size="size"
          ></a-input-number>
        </a-form-item>
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../../common/base-config-form.vue';
import TabPanes from './tab-panes.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    TabPanes,
  },
});
</script>

<style lang="less" scoped></style>
