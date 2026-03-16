<template>
  <a-result v-if="!auth && noMatch" :staus="403" title="403" sub-title="无权限" />
  <slot v-else-if="auth" />
</template>

<script lang="ts">
import { useUserStore } from '@/store/user';
import { isArray } from 'lodash-es';
import type { PropType, VNodeChild } from 'vue';
import { watchEffect, computed, ref, defineComponent } from 'vue';
import { Result as AResult } from 'ant-design-vue';

export type AuthorityType = string | string[] | ((authority: Permission[]) => boolean);

export enum Action {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  QUERY = 'query',
  IMPORT = 'import',
  EXPORT = 'export',
}

export interface Permission {
  /* 权限ID */
  id: string | number;
  /* 权限归属的角色 */
  roleId?: string | number;
  /* 权限名称 */
  name: string;
  /* 权限显示的名字 */
  label?: string;
  /* 权限拥有的操作 [增,删,改,查] */
  actions?: Action[];
}

export default defineComponent({
  name: 'Authority',
  props: {
    authority: {
      type: [String, Array, Function] as PropType<AuthorityType>,
      default: () => true,
    },
    noMatch: {
      type: [String, Boolean, Object] as PropType<string | boolean | VNodeChild>,
      default: () => undefined,
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const role = computed(() => userStore.role);
    const auth = ref(false);
    watchEffect(() => {
      if (role.value.permissions) {
        const permissions = role.value.permissions;
        const isArr = isArray(props.authority);

        if (typeof props.authority === 'string' || isArr) {
          auth.value = permissions.some(value => {
            return isArr
              ? (props.authority as string[]).includes(value.name)
              : props.authority === value.name;
          });
        } else if (typeof props.authority === 'function') {
          auth.value = props.authority(permissions);
        }
      }
    });

    return {
      auth,
    };
  },
  components: {
    AResult,
  },
});
</script>
