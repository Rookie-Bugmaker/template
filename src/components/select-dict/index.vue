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
      v-for="item in dictList"
      :key="codeValue ? item.itemCode : item.id"
      :value="codeValue ? item.itemCode : item.id"
      :label="item.itemName"
      :description="item.itemCode"
      :disabled="disabledItem?.includes(item.itemCode)"
    >
      <span>{{ item.itemName }}</span>
      <span v-if="showValueCode" style="float: right; margin-left: 10px; color: rgb(180 180 180)">
        {{ item.itemCode }}
      </span>
    </a-select-option>
  </a-select>
</template>
<script lang="ts" setup>
import { queryDict } from '@/api/system/dict';
import { useFetchList } from '@/utils/hooks/useFetchList';
interface Props {
  value?: string;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  showValueCode?: boolean;
  disabledItem?: string[];
  codeValue?: boolean; //使用code作为值
  dictCode: string;
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择字典项',
  disabled: false,
  allowClear: true,
  showValueCode: true,
  disabledItem: () => [],
  codeValue: true,
  dictCode: '',
});
const emit = defineEmits(['update:value', 'change']);
/**数据 */
const { list: dictList } = useFetchList<any>(
  async () => {
    const res = await queryDict(props.dictCode);
    const result = res.data?.items || [];
    result.sort((a, b) => a.sorted - b.sorted);
    return {
      success: res.success,
      message: res.msg,
      result,
    };
  },
  {
    onValidateParams(_params, next) {
      if (props.dictCode) {
        next();
      }
    },
  },
);
/**选择 */
const handleChange = (value: string) => {
  emit('update:value', value);
  emit('change', value);
};
</script>
