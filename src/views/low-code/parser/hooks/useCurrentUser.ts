import { computed } from 'vue';
import { useUserStore } from '@/store/user';

export default function useCurrentUser() {
  const userStore = useUserStore();
  const currentUser = computed(() => userStore.currentUser);
  const getByCurrentUser = (key: string) => {
    if (!key) {
      return null;
    }
    if (key === 'roleId') {
      return currentUser?.value?.['currentRoleId'] || null;
    } else if (key === 'orgId') {
      return currentUser?.value?.['currentOrgId'] || null;
    }
    return currentUser?.value?.[key] || null;
  };

  return {
    getByCurrentUser,
  };
}
