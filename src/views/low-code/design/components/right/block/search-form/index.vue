<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="布局">
        <a-form-item label="列数">
          <a-radio-group v-model:value="config.options.colNum" button-style="solid" :size="size">
            <a-radio-button :value="1">一列</a-radio-button>
            <a-radio-button :value="2">二列</a-radio-button>
            <a-radio-button :value="3">三列</a-radio-button>
            <a-radio-button :value="4">四列</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标签位置">
          <a-radio-group
            v-model:value="config.options.labelAlign"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="left">靠左</a-radio-button>
            <a-radio-button value="right">靠右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="表单项间隔">
          <a-radio-group
            :value="config.options.gutter.join(',')"
            button-style="solid"
            @change="
              e => {
                config.options.gutter = e.target.value.split(',').map(m => parseInt(m));
              }
            "
            :size="size"
          >
            <a-radio-button value="0,0">无</a-radio-button>
            <a-radio-button value="8,8">小</a-radio-button>
            <a-radio-button value="12,12">中</a-radio-button>
            <a-radio-button value="16,16">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="表单项布局">
          <a-radio-group
            v-model:value="config.options.layout"
            button-style="solid"
            :size="size"
            @change="e => handleChangeLayout(e, config)"
          >
            <a-radio-button value="horizontal">水平</a-radio-button>
            <a-radio-button value="vertical">垂直</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="表单项比例"
          v-show="config.options.layout == 'horizontal'"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >
          <a-radio-group
            :value="config.options.itemRatio.join(',')"
            button-style="solid"
            @change="
              e => {
                config.options.itemRatio = e.target.value.split(',').map(m => parseInt(m));
              }
            "
            :size="size"
          >
            <a-radio-button value="4,20">4:20</a-radio-button>
            <a-radio-button value="6,18">6:18</a-radio-button>
            <a-radio-button value="8,16">8:16</a-radio-button>
            <a-radio-button value="10,14">10:14</a-radio-button>
            <a-radio-button value="12,12">12:12</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="查询设置">
        <a-button type="primary" block @click="state.searchSettingVisible = true">
          查询条件绑定
        </a-button>
        <search-setting v-model:open="state.searchSettingVisible" :config="config" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import BaseConfigForm from '../../common/base-config-form.vue';
import SearchSetting from './search-setting.vue';

export default defineComponent({
  name: '',
  setup() {
    const state = reactive({ searchSettingVisible: false });

    const handleChangeLayout = (e, config) => {
      const v = e.target.value;
      if (v === 'horizontal') {
        config.options.itemRatio = [8, 16];
      }
      if (v === 'vertical') {
        config.options.itemRatio = [24, 24];
      }
    };

    return { handleChangeLayout, state };
  },
  components: {
    BaseConfigForm,
    SearchSetting,
  },
});
</script>

<style lang="less" scoped></style>
