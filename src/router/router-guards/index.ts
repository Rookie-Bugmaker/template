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

    if (window.__MICRO_APP_ENVIRONMENT__) {
      //设置用户信息
      userStore.SET_SUB_APP_USER_STATE();

      // 使用当前用户的 权限信息 生成 对应权限的路由表
      const allowRouters = userStore.GENERATE_SUB_APP_ROUTES();

      if (allowRouters) {
        // console.log(to);

        return { ...to, replace: true };
      }
      return false;
    } else {
      //先等待用户信息加载完成（如果token过期，会刷新token并获取用户信息），防止token过期，重新获取token期间，sse获取菜单数据失败（sse需要在连接时就带上token）
      await userStore.GET_INFO();

      //获取当前用户人员
      userStore.GET_PERSON_INFO();

      //获取角色列表，异步即可
      userStore.GET_ROLE_LIST();

      // //获取当前角色下的组织列表
      // userStore.GET_ORG_LIST();

      //获取当前角色的公司部门信息
      userStore.GET_USER_COMPANY_DEPT_INFO();

      //当访问地址是首页时，默认先使用静态路由，先打开页面，动态路由通过异步加载的方式载入
      if (to.path === '/' || to.path === defaultRoutePath) {
        //构建静态路由
        userStore.GENERATE_ROUTES_STATIC();

        // 使用当前用户的 权限信息 生成 对应权限的路由表
        userStore.GENERATE_ROUTES_DYNAMIC();

        return { ...to, replace: true };
      } else {
        //当访问地址为具体功能时，需要先等待菜单权限的加载完成，判断有没有权限之后再打开页面

        //构建静态路由
        userStore.GENERATE_ROUTES_STATIC();

        //如果访问路由已经在静态路由中存在，则直接跳转访问
        if (router.hasRoute(to.name)) {
          //需要重新加载一下菜单，防止在白名单路由页中刷新页面，导致路由丢失（但会导致白名单页面需额外加载一下菜单，如低代码管理页，其实是不需要加载菜单的）
          userStore.GENERATE_ROUTES_DYNAMIC();
          return { ...to, replace: true };
        }

        // 使用当前用户的 权限信息 生成 对应权限的路由表
        userStore.GENERATE_ROUTES_DYNAMIC().then(() => {
          //等待菜单加载完成后，判断是否有对应的菜单权限，再跳转
          const resolved = router.resolve({ path: to.path });
          if (
            resolved.matched?.length &&
            !resolved.matched.find(f => f?.meta?.key === 'PathMismatch')
          ) {
            router.push(to.path);
          }
        });

        //默认先进入首页
        return { path: defaultRoutePath, replace: true };
      }
    }
  }
});

router.afterEach(() => {});
