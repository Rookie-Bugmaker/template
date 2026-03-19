<template>
  <a-row :gutter="10">
    <a-col :span="7">排序字段</a-col>
    <a-col :span="7">排序方式</a-col>
    <a-col :span="7">空值处理</a-col>
  </a-row>
  <div class="item" v-for="(item, index) in currentConfig.config.sort" :key="index">
    <a-row :gutter="10">
      <a-col :span="7">
        <data-source-field-selector
          v-model:value="item.field"
          :fieldList="props.fieldList"
          style="width: 100%"
          placeholder="排序字段"
        ></data-source-field-selector>
      </a-col>
      <a-col :span="7">
        <a-select
          v-model:value="item.type"
          :dropdown-match-select-width="false"
          style="width: 100%"
          placeholder="排序方式"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
        >
          <a-select-option value="asc">升序</a-select-option>
          <a-select-option value="desc">降序</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="7">
        <a-select
          v-model:value="item.nulls"
          :dropdown-match-select-width="false"
          style="width: 100%"
          placeholder="空值处理"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
        >
          <a-select-option value="none">不处理</a-select-option>
          <a-select-option value="first">排在最前</a-select-option>
          <a-select-option value="last">排在最后</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <delete-outlined @click="() => delConfig(index)" />
      </a-col>
    </a-row>
  </div>
  <a-button type="link" style="padding: 0" @click="addSort">
    <template #icon><plus-outlined /></template>
    添加配置
  </a-button>
</template>

<script setup lang="ts">
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

const addSort = () => {
  currentConfig.value.config.sort.push({
    field: null,
    type: null,
    nulls: null,
  });
};
const delConfig = (index: number) => {
  currentConfig.value.config.sort.splice(index, 1);
};
</script>

<style lang="less" scoped>
.item {
  margin: 10px 0;
}
</style>
