<template>
  <status-tag :value="value" :status-list="typeList" />
</template>

<script lang="ts" setup>
import { UserType } from '@/api/system/user/index';
import StatusTag from '@/components/status-tag/index.vue';
import { useI18n } from 'vue-i18n';

defineProps({
  value: {
    type: String,
    default: '',
  },
});

const { t } = useI18n();

const typeList = [
  {
    value: UserType.CUSTOMER,
    text: () => t('view.system.user.userType.customer'),
    color: 'magenta',
  },
  {
    value: UserType.EMPLOYEE,
    text: () => t('view.system.user.userType.employee'),
    color: 'blue',
  },
  {
    value: UserType.SUPPLIER,
    text: () => t('view.system.user.userType.supplier'),
    color: 'purple',
  },
];
</script>

<style lang="less" scoped></style>
