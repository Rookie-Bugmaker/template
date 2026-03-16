<template>
  <a-menu-item-group key="dept" v-if="currentUser.currentDeptId">
    <template #title>{{ $t('component.avatarDropdown.template.currentDept.title') }}</template>
    <a-sub-menu key="dept-info">
      <template #expandIcon>
        <span
          v-if="currentDeptList?.length > 1"
          class="ant-dropdown-menu-submenu-arrow ant-dropdown-menu-submenu-expand-icon"
          style="right: 1px"
        >
          <swap-outlined style="color: rgba(0, 0, 0, 0.45); font-size: 12px; font-style: normal" />
        </span>
      </template>
      <template #title>
        {{ currentDeptList?.find(f => f.id == currentUser.currentDeptId)?.departmentName }}
      </template>
      <a-menu-item-group
        v-if="currentDeptList?.length > 1"
        key="dept-list"
        style="min-width: 160px"
      >
        <template #title>
          <block-outlined />
          {{ $t('component.avatarDropdown.template.switchDept.title') }}
        </template>
        <!-- <a-menu-item
          v-for="deptItem in currentDeptList"
          :key="deptItem.id"
          @click="$emit('switch-dept', deptItem.id)"
          :disabled="deptItem.id == currentUser.currentDeptId"
        >
          <span
            v-if="deptItem.id == currentUser.currentDeptId"
            style="color: green; font-size: 14px; font-style: normal; position: absolute; left: 8px"
          >
            <check-outlined />
          </span>
          <span style="margin-left: 16px; float: left">
            {{ deptItem.departmentName }}
          </span>
        </a-menu-item> -->
        <a-tree
          :treeData="currentDeptTree"
          :fieldNames="{
            key: 'id',
            title: 'departmentName',
            children: 'children',
          }"
          defaultExpandAll
          @select="
            k => {
              $emit('switch-dept', k?.[0]);
            }
          "
        ></a-tree>
      </a-menu-item-group>
    </a-sub-menu>
  </a-menu-item-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { DeptInfo } from '@/api/system/role';

export default defineComponent({
  name: 'SwitchDept',
  props: {
    currentUser: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['switch-dept'],
  setup(props) {
    const buildDeptTree = (deptList: DeptInfo[], currentDeptId) => {
      return deptList.filter(f => {
        const children = deptList.filter(x => f.orgCode === x.parentOrgCode);
        f.children = children?.length ? children : null;
        f.disabled = f.id == currentDeptId;
        return f.parentOrgCode === '' || f.parentOrgCode === null;
      });
    };
    const currentDeptList = computed<any[]>(() => {
      return (
        props.currentUser.companyDeptList?.find(
          f => f.companyId == props.currentUser.currentCompanyId,
        )?.deptList || []
      );
    });
    const currentDeptTree = computed<any[]>(() => {
      return buildDeptTree(
        props.currentUser.companyDeptList?.find(
          f => f.companyId == props.currentUser.currentCompanyId,
        )?.deptList || [],
        props.currentUser.currentDeptId,
      );
    });
    return { currentDeptList, currentDeptTree };
  },
});
</script>

<style lang="less" scoped></style>
