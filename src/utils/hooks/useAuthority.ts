import { useRoute } from 'vue-router';
import type { MenuRouteMeta } from '@/router/typing';

export const useAuthority = () => {
  const route = useRoute();
  const currentRouteMeta = route.meta as MenuRouteMeta;
  //动态路由转换时已经全部转换为字符串数组类型
  const currentRouteMetaAuthority = (currentRouteMeta?.authority || []) as string[];

  //根据当前页面的权限设置，判断参数authCode是否有权限（在权限数组中有权限）
  const hasAuth = (authCode: string): boolean => {
    return currentRouteMetaAuthority.includes(authCode) || false;
  };

  return {
    hasAuth,
  };
};
