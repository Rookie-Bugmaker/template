<template>
  <a-form-item label="启用导入/导出">
    <a-switch
      v-model:checked="tableConfig.importAndExport.enabled"
      checked-children="是"
      un-checked-children="否"
      :size="size"
    />
  </a-form-item>
  <template v-if="tableConfig.importAndExport.enabled">
    <a-form-item label="仅导出">
      <a-switch
        v-model:checked="tableConfig.importAndExport.onlyExport"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>

    <template v-if="!tableConfig.importAndExport.onlyExport">
      <a-form-item label="下载模板URL">
        <a-input v-model:value="tableConfig.importAndExport.downloadTempleteUrl" :size="size" />
      </a-form-item>
      <a-form-item label="下载模板名称">
        <a-input v-model:value="tableConfig.importAndExport.downloadTempleteName" :size="size" />
      </a-form-item>
      <a-form-item label="导入文件检查URL">
        <a-input v-model:value="tableConfig.importAndExport.checkFileUrl" :size="size" />
      </a-form-item>
      <a-form-item label="下载检查结果URL">
        <a-input v-model:value="tableConfig.importAndExport.downloadResUrl" :size="size" />
      </a-form-item>
      <a-form-item label="下载检查结果文件名称">
        <a-input v-model:value="tableConfig.importAndExport.downloadResName" :size="size" />
      </a-form-item>
      <a-form-item label="写入结果URL">
        <a-input v-model:value="tableConfig.importAndExport.importUrl" :size="size" />
      </a-form-item>
    </template>
    <a-form-item label="导出类型">
      <a-radio-group
        v-model:value="tableConfig.importAndExport.exportType"
        button-style="solid"
        :size="size"
      >
        <a-radio-button value="custom">客制化</a-radio-button>
        <a-radio-button value="lowCode">低代码</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="导出文件名称">
      <a-input v-model:value="tableConfig.importAndExport.exportFileName" :size="size" />
    </a-form-item>
    <a-form-item v-if="tableConfig.importAndExport.exportType === 'custom'" label="导出URL">
      <a-input v-model:value="tableConfig.importAndExport.exportUrl" :size="size" />
    </a-form-item>
    <a-button
      v-if="tableConfig.importAndExport.exportType === 'lowCode'"
      type="primary"
      block
      @click="() => (state.exportColumnsVisible = true)"
    >
      设置/更新导出列
    </a-button>
  </template>
  <export-columns v-model:open="state.exportColumnsVisible" :config="config" />
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { defaultConfig } from '@/views/low-code/design/typing/block/table';
import ExportColumns from './export-columns.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
  },
  setup(props) {
    const tableConfig = computed(() => props.config);
    //版本差异,缺少属性,旧版本没有importAndExport这个属性
    if (!tableConfig.value.importAndExport) {
      tableConfig.value.importAndExport = defaultConfig.importAndExport;
    }
    const state = reactive({ exportColumnsVisible: false });
    return { tableConfig, state };
  },
  components: { ExportColumns },
});
</script>

<style lang="less" scoped></style>
