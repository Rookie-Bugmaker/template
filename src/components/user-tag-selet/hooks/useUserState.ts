import { ref } from 'vue';
import { findByUserIds } from '@/api/system/user';
import type { UserItem } from '@/api/system/user';
import { isArray } from 'lodash';

import { createInjectionState } from '@vueuse/core';

const [useProvideUserState, useUserState] = createInjectionState(() => {
  const loading = ref(false);
  const selectedRows = ref<UserItem[]>([]);

  const loadSelectedRows = async values => {
    if (!values) {
      clearSelectedRows();
      return;
    }
    const ids = isArray(values) ? values.join(',') : values;
    loading.value = true;
    const { success, result } = await findByUserIds(ids);
    if (success && result) {
      selectedRows.value = result;
    }
    loading.value = false;
  };

  const setSelectedRows = (rows: UserItem[]) => {
    selectedRows.value = rows;
  };

  const clearSelectedRows = () => {
    selectedRows.value = [];
  };

  const addSelectedItem = (item: UserItem) => {
    selectedRows.value.push(item);
  };

  const removeSelectedItem = (id: string) => {
    selectedRows.value = selectedRows.value.filter(item => {
      return item.userId !== id;
    });
  };

  return {
    loading,
    selectedRows,
    loadSelectedRows,
    setSelectedRows,
    clearSelectedRows,
    addSelectedItem,
    removeSelectedItem,
  };
});

export { useProvideUserState, useUserState };
