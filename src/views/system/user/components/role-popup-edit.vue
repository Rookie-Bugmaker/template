<template>
  <popup-edit placeholder="请选择角色" allowClear :options="options"></popup-edit>
</template>

<script setup lang="ts">
import PopupEdit from '@/components/popup-edit/index.vue';
import { findRoleByPage, findRoleById } from '@/api/system/role/index';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/* 角色 */
const options = {
  getDataById: findRoleById,
  getDataByPage: findRoleByPage,
  modalWidth: 850,
  modalTitle: () => t('view.system.user.form.roleId.popup.title'),
  valueField: 'roleId',
  textField: 'roleName',
  searchFormFields: [
    {
      label: () => t('view.system.user.form.roleId.popup.code'),
      field: 'roleCode',
    },
    {
      label: () => t('view.system.user.form.roleId.popup.name'),
      field: 'roleName',
    },
  ],
  tableColumns: [
    {
      title: () => t('view.system.user.form.roleId.popup.code'),
      dataIndex: 'roleCode',
    },
    {
      title: () => t('view.system.user.form.roleId.popup.name'),
      dataIndex: 'roleName',
    },
    {
      title: () => t('view.system.user.form.roleId.popup.desc'),
      dataIndex: 'roleDescription',
    },
  ],
};
</script>

<style lang="less" scoped></style>
