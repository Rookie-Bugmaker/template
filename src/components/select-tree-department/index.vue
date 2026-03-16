<template>
  <a-tree-select
    v-model:value="localValue"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    :multiple="multiple"
    :disabled="disabled"
    :tree-default-expand-all="treeDefaultExpandAll"
    :tree-data="deptTreeData"
    :dropdown-match-select-width="false"
    @change="handleChange"
    :field-names="{ label: 'deptName', value: 'deptId' }"
    v-bind="$attrs"
    tree-node-filter-prop="deptName"
  />
</template>
<script lang="ts" setup>
// import { Modal } from 'ant-design-vue';
import { computed, ref } from 'vue';

// import { getDeptTree } from '@/api/organization/department';
// import { extractTopThreeLevels } from '@/utils/tree-util';

const props = withDefaults(
  defineProps<{
    value: string | string[];
    placeholder?: string;
    allowClear?: boolean;
    disabled?: boolean;
    treeDefaultExpandAll?: boolean;
    /**限制层级 -1:不限制 **/
    topLevel?: number;
    multiple?: boolean;
    disabledFirstLevel?: boolean;
    valueType?: 'string' | 'array';
  }>(),
  {
    placeholder: '请选择部门',
    disabled: false,
    treeDefaultExpandAll: true,
    allowClear: true,
    topLevel: -1,
    multiple: false,
    disabledFirstLevel: true,
    valueType: 'string',
  },
);
const emit = defineEmits(['update:value', 'change']);

function getValue(props: any) {
  if (props.multiple) {
    if (props.valueType === 'string' && typeof props.value !== 'object') {
      return props.value?.split(',') || [];
    }
    return props.value || [];
  }
  return props.value;
}

function setValue(props: any, value: any, emit: any) {
  if (props.multiple) {
    if (props.valueType === 'string') {
      emit('update:value', (value as string[])?.join(',') || null);
    } else {
      emit('update:value', value || []);
    }
  } else {
    emit('update:value', value);
  }
}

const localValue = computed({
  get() {
    return getValue(props);
  },
  set(value) {
    setValue(props, value, emit);
  },
});

/**部门树结构数据 */
const deptTreeData = ref([]);
const getDeptTreeAsync = async () => {
  /* const { success, message: content, result } = await getDeptTree({ pageSize: 9999 });

  if (success) {
    //禁用第一层 因为第一层是公司
    const disabledFirstLevel = props.disabledFirstLevel
      ? result?.rows.map(m => {
          m.disabled = true;
          return m;
        }) ?? []
      : result?.rows ?? [];

    deptTreeData.value =
      props.topLevel > 0
        ? extractTopThreeLevels(disabledFirstLevel, props.topLevel)
        : disabledFirstLevel;
  } else {
    Modal.error({ title: '错误', content });
  } */
};

getDeptTreeAsync();

/**部门选择 */
const handleChange = (value: string, label, extra) => {
  emit('change', value, label, extra);
};
</script>
