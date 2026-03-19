<template>
  <a-row :gutter="10">
    <a-col :span="10">数据源字段</a-col>
    <a-col :span="10">参数字段</a-col>
  </a-row>
  <div class="item" v-for="(item, index) in currentConfig.config.params" :key="index + 'params'">
    <a-row :gutter="10">
      <a-col :span="10">
        <data-source-field-selector
          v-model:value="item.key"
          :fieldList="props.fieldList"
          placeholder="数据源字段"
        ></data-source-field-selector>
      </a-col>
      <a-col :span="10">
        <a-select
          v-model:value="item.value"
          allow-clear
          style="width: 100%"
          placeholder="参数字段"
          :options="options"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
        ></a-select>
      </a-col>
      <a-col :span="4">
        <delete-outlined @click="() => delConfig(index)" />
      </a-col>
    </a-row>
  </div>
  <a-button type="link" style="padding: 0" @click="addParams">
    <template #icon><plus-outlined /></template>
    添加配置
  </a-button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataSourceFieldSelector from '@/views/low-code/design/components/right/common/data-source-field-selector.vue';
import type { ApiOperationParams } from '@/api/low-code/low-code-api/index';
import type { FiledItem } from '@/api/low-code/data-set/table';
import { useVModels } from '../../hooks/useVModels';

type Props = {
  config: ApiOperationParams;
  fieldList: Array<FiledItem>;
};
const props = withDefaults(defineProps<Props>(), {
  config: null,
  fieldList: () => [],
});

const emit = defineEmits(['update:config']);

const currentConfig = useVModels(props, 'config', emit);

const options = computed(() =>
  currentConfig.value.parameterList?.map(item => ({
    label: item.parameter,
    value: item.parameter,
  })),
);

const addParams = () => {
  currentConfig.value.config.params.push({
    key: null,
    value: null,
  });
};

const delConfig = (index: number) => {
  currentConfig.value.config.params.splice(index, 1);
};
</script>

<style lang="less" scoped>
.item {
  margin: 10px 0;
}
</style>
