<template>
  <group-wrapper :title="`参数列表配置`" style="margin-bottom: 8px">
    <template #extra>
      <!-- <a-button :disabled="!props.isSelect" type="primary" @click="getParameterList">刷新</a-button> -->
    </template>
    <a-row :gutter="20">
      <a-col :span="6">参数字段</a-col>
      <a-col :span="6">参数值</a-col>
      <a-col :span="5">是否必填</a-col>
      <a-col :span="5">参数描述</a-col>
    </a-row>
    <div
      class="item"
      v-for="(item, index) in currentConfig.parameterList"
      :key="index + 'parameterList'"
    >
      <a-row :gutter="20">
        <a-col :span="6">
          <a-select
            v-if="props.isSelect"
            v-model:value="item.parameter"
            allow-clear
            style="width: 100%"
            placeholder="参数字段"
            :options="fieldList"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
          ></a-select>
          <a-input
            v-else
            :disabled="hasDisabled(item, currentConfig.type)"
            v-model:value="item.parameter"
            allow-clear
            style="width: 100%"
            placeholder="参数字段"
          ></a-input>
        </a-col>
        <a-col :span="6">
          <a-input
            v-model:value="item.parameterValue"
            allow-clear
            style="width: 100%"
            placeholder="参数值"
          ></a-input>
        </a-col>
        <a-col :span="5">
          <a-switch
            v-model:checked="item.required"
            checked-children="必填"
            un-checked-children="非必填"
            :disabled="hasDisabled(item, currentConfig.type)"
          />
        </a-col>
        <a-col :span="5">
          <a-input
            :disabled="hasDisabled(item, currentConfig.type)"
            v-model:value="item.description"
            allow-clear
            style="width: 100%"
            placeholder="参数描述"
          ></a-input>
        </a-col>
        <a-col :span="2">
          <delete-outlined
            v-if="!hasDisabled(item, currentConfig.type)"
            @click="() => delConfig(index)"
          />
        </a-col>
      </a-row>
    </div>
    <a-button type="link" style="padding: 0" @click="addParams">
      <template #icon><plus-outlined /></template>
      添加配置
    </a-button>
  </group-wrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GroupWrapper from '@/views/low-code/design/components/right/common/filter-config/group-wrapper.vue';
import type { ApiOperationParams } from '@/api/low-code/low-code-api/index';
import type { FiledItem } from '@/api/low-code/data-set/table';
import { useVModels } from '../../hooks/useVModels';

type Props = {
  config: ApiOperationParams;
  isSelect?: boolean;
  fieldList?: Array<FiledItem>;
};
const props = withDefaults(defineProps<Props>(), {
  config: null,
  isSelect: false,
  fieldList: () => [],
});

const emit = defineEmits(['update:config']);

const currentConfig = useVModels(props, 'config', emit);

const fieldList = computed(() => {
  return props.fieldList.map(item => ({
    label: item.fieldCode,
    value: item.fieldCode,
  }));
});

const hasDisabled = (row, type) => {
  if ((row.parameter !== 'pageSize' && row.parameter !== 'page') || type !== 'queryByPagination') {
    return false;
  } else if (row.parameter === 'page' && row.description === '页码') {
    return true;
  } else if (row.parameter === 'pageSize' && row.description === '分页大小') {
    return true;
  } else return false;
};

const addParams = () => {
  !currentConfig.value.parameterList && (currentConfig.value.parameterList = []);
  currentConfig.value.parameterList.push({
    parameter: null,
    required: false,
    description: null,
  });
};

const delConfig = (index: number) => {
  currentConfig.value.parameterList.splice(index, 1);
};
</script>

<style lang="less" scoped>
.item {
  margin: 10px 0;
}
</style>
