import type { ComputedRef, Ref, UnwrapRef } from 'vue';
import { computed, inject, onMounted, reactive, ref, toRefs, watch } from 'vue';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { LayoutType, MenuTheme, MultiTabType } from '@/components/base-layouts/typing';
import { xor, isEqual } from 'lodash-es';
import { genMenuInfo } from '@/utils/menu-util';
import type { MultiTabStore } from '@/components/multi-tab';
import { loginRoutePath } from '@/router/define-meta';
import { useAppStore } from '@/store/app';
import { useUserStore, type UserState } from '@/store/user';
export interface MenuState {
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
  current?: string;
  isMobile?: Ref<boolean>;
}
type LayoutState = {
  layout: Ref<LayoutType>;
  theme: Ref<MenuTheme>;
  fixedSidebar: Ref<boolean>;
  contentWidth: Ref<string>;
  splitMenus: Ref<boolean>;
  transitionName: Ref<string>;
  multiTab: Ref<boolean>;
  multiTabFixed: Ref<boolean>;
  multiTabType: Ref<MultiTabType>;
  fixedHeader: Ref<boolean>;
};
interface MenuStated extends LayoutState {
  hasSideMenu: ComputedRef<boolean>;
  isTopMenu: ComputedRef<boolean>;
  sideWidth: ComputedRef<number | undefined>;
  secondSideWidth: Ref<number>;
  breadcrumb: Ref<
    {
      path: string;
      breadcrumbName: string;
    }[]
  >;
  collapsed: Ref<boolean | undefined> | undefined;
  selectedKeys: Ref<string[]> | undefined;
  openKeys: Ref<string[]> | undefined;
  updateSelectKeys: (keys: string[]) => void;
  updateCollapsed: (s: boolean) => void;
}

export interface BreadcrumbItem {
  path: string;
  breadcrumbName: string;
}

const sideWidth = 260;
const collapsedWidth = 48;
const firstSideWidth = 160; // for leftmenu-layout
const secondSideWidth = 180; // for leftmenu-layout

const pattern = /^((\/)?(https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
const state = reactive<MenuState>({
  collapsed: false,
  openKeys: [],
  selectedKeys: [],
  current: undefined,
});

let res: (MenuStated & LayoutState & { isMobile: Ref<boolean>; collapsedWidth: number }) | null =
  null;
// 用 symbol 类型是最好的，但由于热更新会导致 symbol 更新，导致获取不到正确的 provide 值
export const MenuStateSymbol = 'proGlobalMenuState';

export const injectMenuState = () => {
  return inject(MenuStateSymbol, { ...toRefs(reactive({})) } as MenuStated &
    LayoutState & { isMobile: Ref<boolean>; collapsedWidth: number });
};
export default function useMenuState(
  initialState?: MenuState,
  multiTabState?: UnwrapRef<MultiTabStore>,
) {
  const { t, locale } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const currentUser = computed<UserState>(() => userStore.currentUser as UserState);
  const appStore = useAppStore();
  const isMobile =
    initialState && initialState.isMobile ? initialState.isMobile : inject('isMobile', ref(false));
  Object.assign(state, res ? {} : initialState);
  // define layoutSettings
  const layoutState = reactive({
    layout: computed(() => (isMobile.value ? 'side' : appStore.layout)),
    theme: computed(() => {
      const navTheme = appStore.navTheme;
      return navTheme === 'realDark' ? 'dark' : navTheme;
    }),
    primaryColor: computed(() => appStore.primaryColor),
    fixedSidebar: computed(() => appStore.fixedSidebar),
    fixedHeader: computed(() => appStore.fixedHeader),
    contentWidth: computed(() => appStore.contentWidth),
    // only work layout `mix` `side`
    splitMenus: computed(() => !isMobile.value && appStore.splitMenus),
    transitionName: computed(() => appStore.transitionName),
    multiTab: computed(() => appStore.multiTab),
    multiTabFixed: computed(() => appStore.multiTabFixed),
    multiTabType: computed(() => appStore.multiTabType),
  } as LayoutState);
  const hasSideMenu = computed(() => {
    return layoutState.layout !== 'top';
  });
  const isTopMenu = computed(() => layoutState.layout === 'top');
  const menuWidth = computed(() => {
    if (isMobile.value) {
      return sideWidth;
    }
    const width: number = layoutState.layout === 'left' ? firstSideWidth : sideWidth;
    return hasSideMenu.value ? (state.collapsed ? collapsedWidth : width) : undefined;
  });
  // 解决动态路由 打开页面 openKeys 错误问题
  const allowRouters = computed(() => userStore.allowRouters); // genMenuInfo(filterMenu(routes)).menus;
  const menuKeyMap = computed(() => genMenuInfo(allowRouters.value as RouteRecordRaw[]).menuKeyMap);
  const getOpenKeysBySelectKey = (key: string) => {
    return menuKeyMap.value[key]?.parentKeys;
  };
  watch(
    () => state.collapsed,
    () => {
      if (state.collapsed && !isMobile.value) {
        state.openKeys = [];
      } else {
        state.openKeys = getOpenKeysBySelectKey(route.path);
      }
    },
  );
  // 布局变化时 openKeys 为空
  watch([computed(() => layoutState.layout), computed(() => layoutState.splitMenus)], () => {
    state.openKeys = [];
  });
  const getRouteInfoFromMultiTab = (path: string): RouteLocationNormalized => {
    const cacheList = multiTabState?.cacheList || [];
    const routeInfo = cacheList.find(cache => cache.path === path)
      ?.route as RouteLocationNormalized;
    return routeInfo!;
  };
  watch(
    () => state.selectedKeys,
    (_newVal, oldVal = []) => {
      if (isEqual(_newVal, oldVal)) {
        return;
      }

      if (state.selectedKeys) {
        if (isMobile.value) {
          state.collapsed = true;
        }
        const path = state.selectedKeys[state.selectedKeys.length - 1];
        const isOtherUrl = pattern.test(path);
        const isOtherUrlForOldVal = pattern.test(oldVal[oldVal?.length - 1]);
        //如果外链用内部打开，path会被转变为普通路由path,外链存在meta.externalLink
        //这里直接判断是否外链即可
        if (isOtherUrl) {
          const routes = router.getRoutes();
          const { target } = routes.find(r => r.path.indexOf(path) > -1)?.meta || {};
          state.selectedKeys = oldVal;
          const url = `${path}${path.includes('?') ? '&' : '?'}userId=${
            currentUser.value.userId
          }&roleId=${currentUser.value.currentRoleId}&orgId=${currentUser.value.currentOrgId}`;
          window.open(url, target as string);
          return;
        }
        if (
          !state.collapsed &&
          layoutState.layout !== 'left' &&
          (layoutState.layout === 'side' ||
            layoutState.layout === 'mix' ||
            layoutState.splitMenus === true) &&
          !isOtherUrlForOldVal
        ) {
          const openKeys = getOpenKeysBySelectKey(path);
          if (xor(state.openKeys, openKeys).length) {
            state.openKeys = openKeys || [];
          }
        }
        router.isReady().then(() => {
          /* const routeInfo = getRouteInfoFromMultiTab(path) || ({ path } as RouteLocationNormalized);
          if (routeInfo.fullPath !== route.fullPath) {
            // 优先级 routeInfo.fullPath >  route.fullPath > routeInfo
            router.push(route.path === path ? routeInfo.fullPath || route.fullPath : routeInfo);
          } */

          //因为路由会动态切换，切换后，重新加载的路径不一定在新的路由表内，所以需要判断
          //因为存在带参的动态路由，menuKeyMap.value[path]不能匹配上，所以需要通过route.matched判断
          if (
            menuKeyMap.value[path] ||
            (route.matched?.length && !route.matched.find(f => f?.meta?.key === 'PathMismatch'))
          ) {
            const routeInfo =
              getRouteInfoFromMultiTab(path) || ({ path } as RouteLocationNormalized);
            if (routeInfo.fullPath !== route.fullPath) {
              // router.push(routeInfo);
              router.push(route.path === path ? routeInfo.fullPath || route.fullPath : routeInfo);
            }
          } else {
            //如果路径不在路由表内，则自动跳转到第一个路由
            router.push(Object.keys(menuKeyMap.value)?.[0]);
          }
        });
      }
    },
  );
  const updateMenuState = (path: string): void => {
    const cachedKeys = getOpenKeysBySelectKey(path) || [];
    state.selectedKeys = [...cachedKeys, path];
  };
  const breadcrumb = ref<BreadcrumbItem[]>([]);
  const updateBreadcrumb = () => {
    breadcrumb.value = route.meta.hideInBreadcrumb
      ? []
      : route.matched.concat().map(r => {
          return {
            path: r.path,
            breadcrumbName:
              r.path === '/'
                ? t('pages.home')
                : r.meta.title !== undefined
                ? t(`${r.meta.title}`)
                : '',
          };
        });
  };
  const updateSelectKeys = (keys: string[]) => {
    state.selectedKeys = keys;
  };
  const updateCollapsed = (val: boolean) => {
    state.collapsed = !val;
  };
  onMounted(() => {
    watch(
      () => route.fullPath,
      () => {
        if (route.path !== loginRoutePath) {
          updateMenuState(route.path);
          // // 更新面包屑
          updateBreadcrumb();
        }
      },
      // { immediate: true },
    );

    // 动态刷新面包屑多语言
    watch(
      () => locale.value,
      () => updateBreadcrumb(),
    );
  });
  res = {
    ...toRefs(state),
    ...toRefs(layoutState),
    isMobile,
    hasSideMenu,
    isTopMenu,
    sideWidth: menuWidth,
    secondSideWidth: ref(secondSideWidth),
    breadcrumb,
    collapsedWidth,
    updateSelectKeys,
    updateCollapsed,
  };
  return res;
}
