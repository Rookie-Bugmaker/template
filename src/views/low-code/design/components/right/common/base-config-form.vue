<template>
  <a-form :model="designerState.currentConfig" layout="horizontal" class="base-config-form">
    <a-collapse v-model:activeKey="activeKey" expandIconPosition="end" class="base-config-collapse">
      <a-collapse-panel key="0" header="基础信息">
        <a-form-item label="唯一标识">
          <a-input v-model:value="designerState.currentConfig.uid" disabled :size="size" />
        </a-form-item>
        <a-form-item label="类型">
          <a-input v-model:value="designerState.currentConfig.name" disabled :size="size" />
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel
        key="1"
        header="基础设置"
        v-if="
          [MainType.FormWidget, MainType.ColumnWidget].includes(
            designerState.currentConfig.mainType,
          )
        "
      >
        <base-widget-config />
      </a-collapse-panel>
      <slot :config="designerState.currentConfig" :size="size" />
      <a-collapse-panel
        key="9"
        header="单元格插槽"
        v-if="designerState.currentConfig.mainType === MainType.ColumnWidget"
      >
        <body-cell-slot-config :size="size" />
      </a-collapse-panel>
      <a-collapse-panel
        key="10"
        header="校验设置"
        v-if="
          [MainType.FormWidget, MainType.ColumnWidget].includes(
            designerState.currentConfig.mainType,
          ) && designerState.currentConfig.rules
        "
      >
        <widget-rules-config :size="size" />
      </a-collapse-panel>
    </a-collapse>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { MainType } from '@/views/low-code/design/typing/typing';
import BaseWidgetConfig from './base-widget-config.vue';
import BodyCellSlotConfig from './body-cell-slot-config/index.vue';
import WidgetRulesConfig from './widget-rules-config.vue';

export default defineComponent({
  name: '',
  setup() {
    const designerState = inject(designerStateInjectKey);

    const activeKey = ref([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
    ]);

    const size = ref<SizeType>('small');

    return {
      MainType,
      designerState,
      activeKey,
      size,
    };
  },
  components: { BaseWidgetConfig, BodyCellSlotConfig, WidgetRulesConfig },
});
</script>

<style lang="less" scoped>
.base-config-form {
  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }
  .base-config-collapse {
    :deep(.ant-collapse-header) {
      padding: 6px 16px;
    }
    /* .base-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
      .type-name {
        padding: 2px 24px;
        font-size: 14px;
        text-align: center;
        background-color: #ececec;
        border-radius: 4px;
      }
      label {
        margin-bottom: 5px;
      }
    } */
  }
}
</style>
