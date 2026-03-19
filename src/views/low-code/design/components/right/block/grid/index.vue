<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="基础设置">
        <a-form-item label="垂直对齐方式">
          <a-radio-group v-model:value="config.options.align" button-style="solid" :size="size">
            <a-radio-button value="flex-start">起点对齐</a-radio-button>
            <a-radio-button value="center">居中对齐</a-radio-button>
            <a-radio-button value="flex-end">终点对齐</a-radio-button>
            <a-radio-button value="stretch">拉伸对齐</a-radio-button>
            <a-radio-button value="baseline">基线对齐</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="水平排列方式">
          <a-radio-group v-model:value="config.options.justify" button-style="solid" :size="size">
            <a-radio-button value="flex-start">起点对齐</a-radio-button>
            <a-radio-button value="center">居中对齐</a-radio-button>
            <a-radio-button value="flex-end">终点对齐</a-radio-button>
            <a-radio-button value="space-between">两端对齐</a-radio-button>
            <a-radio-button value="space-around">环绕对齐</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="栅格间隔">
          <a-input-number
            v-model:value="config.options.gutter"
            :min="0"
            :size="size"
          ></a-input-number>
        </a-form-item>
        <!-- <a-form-item label="自动换行">
          <a-switch
            v-model:checked="config.options.wrap"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item> -->
        <a-form-item label="高度">
          <a-input v-model:value="config.options.height" :size="size" />
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="栅格列设置">
        <grid-cols :config="config" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../../common/base-config-form.vue';
import GridCols from './grid-cols.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
    GridCols,
  },
});
</script>

<style lang="less" scoped></style>
