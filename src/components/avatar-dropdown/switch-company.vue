<template>
  <a-menu-item-group key="company">
    <template #title>{{ $t('component.avatarDropdown.template.currentCompany.title') }}</template>
    <a-sub-menu key="company-info" v-if="currentUser.currentCompanyId">
      <template #expandIcon>
        <span
          v-if="currentUser.companyDeptList?.length > 1"
          class="ant-dropdown-menu-submenu-arrow ant-dropdown-menu-submenu-expand-icon"
          style="right: 1px"
        >
          <swap-outlined style="color: rgba(0, 0, 0, 0.45); font-size: 12px; font-style: normal" />
        </span>
      </template>
      <template #title>
        {{
          currentUser.companyDeptList?.find(f => f.companyId == currentUser.currentCompanyId)
            ?.companyName
        }}
      </template>
      <a-menu-item-group
        v-if="currentUser.companyDeptList?.length > 1"
        key="company-list"
        style="min-width: 160px"
      >
        <template #title>
          <block-outlined />
          {{ $t('component.avatarDropdown.template.switchCompany.title') }}
        </template>
        <a-menu-item
          v-for="companyItem in currentUser?.companyDeptList || []"
          :key="companyItem.companyId"
          @click="$emit('switch-company', companyItem.companyId)"
          :disabled="companyItem.companyId == currentUser.currentCompanyId"
        >
          <span
            v-if="companyItem.companyId == currentUser.currentCompanyId"
            style="color: green; font-size: 14px; font-style: normal; position: absolute; left: 8px"
          >
            <check-outlined />
          </span>
          <span style="margin-left: 16px; float: left">
            {{ companyItem.companyName }}
          </span>
        </a-menu-item>
      </a-menu-item-group>
    </a-sub-menu>
  </a-menu-item-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SwitchCompany',
  props: {
    currentUser: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['switch-company'],
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
