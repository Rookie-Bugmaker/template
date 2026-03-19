import { reactive, computed } from 'vue';
import { Modal, message } from 'ant-design-vue';
import request from '@/utils/request';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

export interface OpenModalOptions {
  title?: string;
  path?: string;
  params?: any;
}

export interface ModalState extends OpenModalOptions {
  open: boolean;
  ok?: () => void;
  cancel?: () => void;
}

export default function useEventHandler() {
  const modalState: ModalState = reactive({ open: false, title: '新窗口' });
  const openModal = (options: OpenModalOptions) => {
    Object.assign(modalState, options);
    modalState.open = true;
  };

  const router = useRouter();
  const route = useRoute();

  const userStore = useUserStore();
  const currentUser = computed(() => userStore.currentUser);

  return {
    Modal,
    message,
    modalState,
    openModal,
    request,
    router,
    route,
    currentUser,
  };
}
