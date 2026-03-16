<template>
  <a-select
    :value="value"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    :disabled="disabled"
    :dropdown-match-select-width="false"
    @change="handleChange"
    style="width: 100%"
  >
    <a-select-option
      v-for="item in projectList"
      :key="item.id"
      :value="item.id"
      :label="item.nameCn"
      :description="item.name"
      :style="{ display: item.status == '1' ? 'none' : '' }"
    >
      <span>{{ item.nameCn }}</span>
      <span v-if="showValueCode" style="float: right; margin-left: 10px; color: rgb(180 180 180)">
        {{ item.name }}
      </span>
    </a-select-option>
  </a-select>
</template>
<script lang="ts" setup>
import { getList } from '@/api/system/project';
import { useFetchList } from '@/utils/hooks/useFetchList';
interface Props {
  value: number;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  showValueCode?: boolean;
}
withDefaults(defineProps<Props>(), {
  placeholder: '请选择项目',
  disabled: false,
  allowClear: true,
  showValueCode: true,
});
const emit = defineEmits(['update:value', 'change']);
/**数据 */
const { list: projectList } = useFetchList(getList);
/**选择 */
const handleChange = (value: number) => {
  emit('update:value', value);
  emit('change', value);
};
</script>
