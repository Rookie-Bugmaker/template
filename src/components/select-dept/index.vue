<template>
  <a-tree-select
    :value="value"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    :disabled="disabled"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :dropdown-match-select-width="false"
    :tree-data="deptList"
    :field-names="{
      value: 'id',
      label: 'departmentName',
    }"
    @change="handleChange"
    :treeDefaultExpandAll="treeDefaultExpandAll"
    style="width: 100%"
    v-bind="$attrs"
  ></a-tree-select>
</template>
<script lang="ts" setup>
import { computed, nextTick, watch } from 'vue';
import { getList } from '@/api/organization/dept';
import { useFetchList } from '@/utils/hooks/useFetchList';
interface Props {
  value?: string;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  showValueCode?: boolean;
  treeDefaultExpandAll?: boolean;
  companyId?: string;
  autoFetch?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择部门',
  disabled: false,
  treeDefaultExpandAll: false,
  allowClear: true,
  showValueCode: true,
  autoFetch: true,
});
const emit = defineEmits(['update:value', 'change']);
/**公司数据 */
const { list: deptList } = useFetchList(getList, {
  params: computed(() => {
    return {
      companyIds: props.companyId ? [props.companyId] : [],
    };
  }),
  onValidateParams(params, next) {
    if (params.companyIds?.length) {
      next();
    } else {
      nextTick(() => {
        deptList.value = [];
      });
    }
  },
  autoFetch: props.autoFetch,
});
/**选择 */
const handleChange = (value: string) => {
  emit('update:value', value);
  emit('change', value);
};

watch(
  () => props.companyId,
  (n, o) => {
    //发生改变才触发加载
    if (n != o) {
      if (!n && o) {
        //如果新值是空，且旧值不为空，说明父值做了清空操作，需要清空已选择值，并清空值列表
        emit('update:value', null);
        deptList.value = [];
      } else if (n && o) {
        //如果新值旧值都不为空，说明父值改变了，需要清空已选择，并重新加载值列表
        emit('update:value', null);
      } else if (n && !o) {
        //如果新值不为空，且旧值是空,说明是新选的父值，或者是初始化表单时加载的值，只需重新加载值列表，且不应清空选择
      }
    }
  },
  { immediate: true },
);
</script>
