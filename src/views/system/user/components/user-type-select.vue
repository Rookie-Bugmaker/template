<template>
  <a-select v-bind="$attrs">
    <a-select-option v-for="key in Object.keys(UserType)" :key="key">
      {{ $t(userTypeMap[key]) }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import { UserType } from '@/api/system/user/index';

const userTypeMap = {
  [UserType.CUSTOMER]: 'view.system.user.userType.customer',
  [UserType.EMPLOYEE]: 'view.system.user.userType.employee',
  [UserType.SUPPLIER]: 'view.system.user.userType.supplier',
};
</script>

<style lang="less" scoped></style>
