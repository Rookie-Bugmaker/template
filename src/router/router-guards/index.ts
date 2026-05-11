import router from '@/router';
import localStorage from '@/utils/local-storage';
import { allowList, loginRoutePath, defaultRoutePath } from '../define-meta';
// eslint-disable-next-line
import { useUserStore } from '@/store/user';
import { STORAGE_TOKEN_KEY } from '@/store/user';
import { Modal } from 'ant-design-vue';

router.beforeEach(async to => {
  Modal.destroyAll(); //销毁弹出的确认窗

  const userToken = localStorage.get(STORAGE_TOKEN_KEY);
  const userStore = useUserStore();
  // token check
  if (!userToken) {
    // 白名单路由列表检查
    if (allowList.includes(to.name as string)) {
      return true;
    }
    if (to.fullPath !== loginRoutePath) {
      // 未登录，进入到登录页
      return {
        path: loginRoutePath,
        replace: true,
        // 登录后跳转到之前页面，如不需要，直接删除 query 即可
        query: { redirect: encodeURIComponent(to.fullPath) },
      };
    }
    return to;
  } else if (to.fullPath === loginRoutePath) {
    // 已经登录，进入登录页，跳回默认首页
    return {
      path: defaultRoutePath,
      replace: true,
    };
  }

  // check login user.role is null
  if (userStore.allowRouters && userStore.allowRouters.length > 0) {
    return true;
  } else {
    // 从服务端获取用户的 [基础信息] 和 [权限信息]
    // 并构建动态路由和菜单
    //设置用户信息
    userStore.SET_SUB_APP_USER_STATE();

    // 使用当前用户的 权限信息 生成 对应权限的路由表
    const allowRouters = userStore.GENERATE_SUB_APP_ROUTES();

    if (allowRouters) {
      // console.log(to);

      return { ...to, replace: true };
    }
    return false;
  }
});

router.afterEach(() => {});
