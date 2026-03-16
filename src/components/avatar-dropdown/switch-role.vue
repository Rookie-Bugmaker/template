<template>
  <a-menu-item-group key="role">
    <template #title>{{ $t('component.avatarDropdown.template.currentRole.title') }}</template>
    <a-sub-menu key="role-info" v-if="currentUser.currentRoleId">
      <!-- <template #icon>
                <team-outlined />
              </template> -->
      <template #expandIcon>
        <span
          v-if="currentUser.roleList?.length > 1"
          class="ant-dropdown-menu-submenu-arrow ant-dropdown-menu-submenu-expand-icon"
          style="right: 1px"
        >
          <swap-outlined style="color: rgba(0, 0, 0, 0.45); font-size: 12px; font-style: normal" />
        </span>
      </template>
      <template #title>
        {{ currentUser.roleList?.find(f => f.roleId == currentUser.currentRoleId)?.roleName }}
      </template>
      <a-menu-item-group
        v-if="currentUser.roleList?.length > 1"
        key="role-list"
        style="min-width: 160px"
      >
        <template #title>
          <block-outlined />
          {{ $t('component.avatarDropdown.template.switchRole.title') }}
        </template>
        <a-menu-item
          v-for="roleItem in currentUser?.roleList?.filter(f => f.enableFlag === 'Y') || []"
          :key="roleItem.roleId"
          @click="$emit('switch-role', roleItem.roleId)"
          :disabled="roleItem.roleId == currentUser.currentRoleId"
        >
          <span
            v-if="roleItem.roleId == currentUser.currentRoleId"
            style="color: green; font-size: 14px; font-style: normal; position: absolute; left: 8px"
          >
            <check-outlined />
          </span>
          <span style="margin-left: 16px; float: left">
            {{ roleItem.roleName }}
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
            {{ roleItem.roleCode }}
          </span> -->
        </a-menu-item>
      </a-menu-item-group>
    </a-sub-menu>
  </a-menu-item-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SwitchRole',
  props: {
    currentUser: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['switch-role'],
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
