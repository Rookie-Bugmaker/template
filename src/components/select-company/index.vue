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
      v-for="item in companyList"
      :key="item.id"
      :value="item.id"
      :label="item.companyName"
      :description="item.orgCode"
      :style="{ display: item.status == '0' ? 'none' : '' }"
      :disabled="disabledItem?.includes(item.orgCode)"
    >
      <span>{{ item.companyName }}</span>
      <span v-if="showValueCode" style="float: right; margin-left: 10px; color: rgb(180 180 180)">
        {{ item.orgCode }}
      </span>
    </a-select-option>
  </a-select>
</template>
<script lang="ts" setup>
import { getSimple } from '@/api/organization/company';
import { useFetchList } from '@/utils/hooks/useFetchList';
interface Props {
  value?: string;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  showValueCode?: boolean;
  autoSelectFirst?: boolean;
  disabledItem?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择公司',
  disabled: false,
  allowClear: true,
  showValueCode: true,
  autoSelectFirst: false,
  disabledItem: () => [],
});
const emit = defineEmits(['update:value', 'change']);
/**公司数据 */
const { list: companyList } = useFetchList(getSimple, {
  onSuccess: res => {
    if (props.autoSelectFirst) {
      emit('update:value', res?.[0]?.id);
    }
  },
});
/**选择 */
const handleChange = (value: string) => {
  emit('update:value', value);
  emit('change', value);
};
</script>
