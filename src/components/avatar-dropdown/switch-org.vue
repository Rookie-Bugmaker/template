<template>
  <a-menu-item-group key="org">
    <template #title>{{ $t('component.avatarDropdown.template.currentOrg.title') }}</template>
    <a-sub-menu key="org-info" v-if="currentUser?.currentOrgId">
      <template #expandIcon>
        <span
          v-if="currentUser?.orgList?.length > 1"
          class="ant-dropdown-menu-submenu-arrow ant-dropdown-menu-submenu-expand-icon"
          style="right: 1px"
        >
          <swap-outlined style="color: rgba(0, 0, 0, 0.45); font-size: 12px; font-style: normal" />
        </span>
      </template>
      <template #title>
        {{ currentUser?.orgList?.find(f => f.orgId == currentUser?.currentOrgId)?.orgName }}
      </template>
      <a-menu-item-group
        v-if="currentUser?.orgList?.length > 1"
        key="org-list"
        style="min-width: 230px"
      >
        <template #title>
          <block-outlined />
          {{ $t('component.avatarDropdown.template.switchOrg.title') }}
        </template>
        <a-menu-item
          v-for="orgItem in currentUser?.orgList?.filter(f => f.orgStatus === 'Y') || []"
          :key="orgItem.orgId"
          @click="$emit('switch-org', orgItem.orgId)"
          :disabled="orgItem.orgId === currentUser?.currentOrgId"
        >
          <span
            v-if="orgItem.orgId == currentUser?.currentOrgId"
            style="color: green; font-size: 14px; font-style: normal; position: absolute; left: 8px"
          >
            <check-outlined />
          </span>
          <span style="margin-left: 16px; float: left">
            {{ orgItem.orgName }}
          </span>
          <!-- <span
            style="
              color: rgba(0, 0, 0, 0.35);
              font-size: 14px;
              font-style: normal;
              margin-left: 10px;
              float: right;
            "
          >
            {{ orgItem.orgCode }}
          </span> -->
        </a-menu-item>
      </a-menu-item-group>
    </a-sub-menu>
  </a-menu-item-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SwitchOrg',
  props: {
    currentUser: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['switch-org'],
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
