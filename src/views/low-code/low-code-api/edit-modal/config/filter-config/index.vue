<template>
  <template v-for="(item, index) in currentConfig.config?.filter.filters" :key="index">
    <logic-title v-model:value="currentConfig.config.filter.logic" :index="index" />
    <group-wrapper :title="`条件组${index + 1}`" style="margin-bottom: 8px">
      <template #extra>
        <span style="margin-right: 10px">组内逻辑</span>
        <a-switch
          v-model:checked="item.logic"
          checked-value="and"
          un-checked-value="or"
          checked-children="且"
          un-checked-children="或"
        />
        <delete-outlined style="margin-left: 20px" @click="() => delConfig(index)" />
      </template>
      <filters
        v-model:config="currentConfig.config.filter.filters[index]"
        :field-list="props.fieldList"
      ></filters>
    </group-wrapper>
  </template>
  <a-button type="dashed" block @click="addGroup">
    <template #icon><plus-outlined /></template>
    添加条件组
  </a-button>
</template>

<script setup lang="ts">
import GroupWrapper from '@/views/low-code/design/components/right/common/filter-config/group-wrapper.vue';
import LogicTitle from '@/views/low-code/design/components/right/common/filter-config/logic-title.vue';
import filters from './filters.vue';
import type { ApiOperationParams } from '@/api/low-code/low-code-api/index';
import { LogicType } from '@/api/workflow/template/typing';
import type { FiledItem } from '@/api/low-code/data-set/table';
import { useVModels } from '../../../hooks/useVModels';

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

const addGroup = () => {
  if (!currentConfig.value.config.filter) {
    currentConfig.value.config.filter = { logic: LogicType.AND, filters: [] };
  }
  currentConfig.value.config.filter.filters.push({ logic: LogicType.AND, filters: [] });
};

const delConfig = (index: number) => {
  currentConfig.value.config.filter.filters.splice(index, 1);
};
</script>

<style lang="less" scoped></style>
