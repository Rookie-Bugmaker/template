<template>
  <a-row :gutter="10">
    <a-col :span="8">数据源字段</a-col>
    <a-col :span="7">关联条件</a-col>
    <a-col :span="7">字符值</a-col>
  </a-row>
  <div class="item" v-for="(item, index) in currentConfig.filters" :key="index">
    <a-row :gutter="10">
      <a-col :span="8">
        <data-source-field-selector
          v-model:value="item.field"
          :fieldList="props.fieldList"
          @change="v => handleChange(v, item)"
          style="width: 100%"
          placeholder="数据源字段"
        ></data-source-field-selector>
      </a-col>
      <a-col :span="7">
        <a-select
          v-model:value="item.operator"
          allow-clear
          :dropdown-match-select-width="false"
          style="width: 100%"
          placeholder="关联条件"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
        >
          <a-select-option
            v-for="cItem in item.fieldType
              ? OPERATOR_LIST.filter(f => f.type.includes(item.fieldType))
              : OPERATOR_LIST"
            :key="cItem.value"
            :value="cItem.value"
          >
            {{ cItem.text }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="7">
        <a-input-number
          v-if="item.type === 'number'"
          v-model:value="item.value"
          style="width: 100%"
          placeholder="请输入数字值"
        ></a-input-number>
        <a-select
          v-else-if="item.type === 'currentUser'"
          v-model:value="item.value"
          allow-clear
          style="width: 100%"
          :dropdown-match-select-width="false"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
        >
          <a-select-option value="userId">当前用户ID</a-select-option>
          <a-select-option value="roleId">当前角色ID</a-select-option>
          <a-select-option value="orgId">当前数据组织ID</a-select-option>
        </a-select>
        <a-input
          v-else
          v-model:value="item.value"
          allow-clear
          style="width: 100%"
          placeholder="请输入字符值"
        ></a-input>
      </a-col>
      <a-col :span="2">
        <delete-outlined @click="() => delConfig(index)" />
      </a-col>
    </a-row>
  </div>
  <a-button type="link" style="padding: 0" @click="addFilter">
    <template #icon><plus-outlined /></template>
    添加配置
  </a-button>
</template>

<script setup lang="ts">
import DataSourceFieldSelector from '@/views/low-code/design/components/right/common/data-source-field-selector.vue';
import { OPERATOR_LIST } from '@/views/low-code/design/typing/index';
import type { Filter } from '@/api/low-code/low-code-api/index';
import type { LogicType } from '@/api/workflow/template/typing';
import type { FiledItem } from '@/api/low-code/data-set/table';
import { useVModels } from '../../../hooks/useVModels';

type Props = {
  config: {
    logic: LogicType;
    filters: Array<Filter>;
  };
  fieldList: Array<FiledItem>;
};
const props = withDefaults(defineProps<Props>(), {
  config: null,
  fieldList: () => [],
});
const emit = defineEmits(['update:config']);

const currentConfig = useVModels(props, 'config', emit);

const handleChange = (v, record) => {
  record.fieldType = props.fieldList.find(f => f.fieldCode === v)?.fieldType || null;
};

const addFilter = () => {
  !currentConfig.value.filters && (currentConfig.value.filters = []);
  currentConfig.value.filters.push({
    field: null,
    type: null,
    operator: null,
    value: null,
  });
};

const delConfig = (index: number) => {
  currentConfig.value.filters.splice(index, 1);
};
</script>

<style lang="less" scoped>
.item {
  margin: 10px 0;
}
</style>
