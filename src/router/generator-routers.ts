import { h, defineAsyncComponent /* defineComponent */ } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
// import { RouterView } from 'vue-router';
import { message } from 'ant-design-vue';
import type { MenuDataItem, MenuRouteMetaPermission } from './typing';
import type { RouteItem } from '@/api/user/login';
import RouteView from '@/layouts/route-view.vue';

import { findMenuTreeByCurrentUserSse } from '@/api/system/menu/index';
import type { MenuItem } from '@/api/system/menu/index';
import type { FunctionItem } from '@/api/system/function/index';
import type { BlockItem } from '@/api/system/function/block-column';

import { duffDevice, retry } from '@/utils/util';
import { uuid } from '@/utils/unique-key-util';

// 根级菜单
const rootRouter: MenuDataItem = {
  name: 'index',
  path: '/',
  redirect: '/dashboard',
  meta: {
    title: 'CCCAR',
  },
  component: () => import('@/layouts/index.vue'),
  children: [] as MenuDataItem[],
};

const defineRouteComponents: Record<string, any> = {
  BasicLayout: () => import('@/layouts/index.vue'),
  RouteView: () => import('@/layouts/route-view.vue'),
  PageView: () => import('@/layouts/route-view.vue'),
  ExternalLinkView: () => import('@/layouts/external-link-view.vue'),
};

const defineRouteComponentKeys = Object.keys(defineRouteComponents);

const externalLinkPattern = /^((\/)?(https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;

export const generator = (
  routeMap: RouteItem[],
  parentId: string | number,
  routeItem?: RouteRecordRaw | MenuDataItem,
) => {
  return routeMap
    .filter(item => item.parentId === parentId)
    .map(item => {
      const { title, hideInMenu, hideChildrenInMenu, target, icon, authority } = item.meta || {};
      const currentRouter: MenuDataItem = {
        // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
        path: item.path || `${(routeItem && routeItem.path) || ''}/${item.name}`,
        // 路由名称，建议唯一
        name: item.name || `${item.id}`,
        // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
        meta: {
          title,
          icon: icon || undefined,
          hideInMenu,
          hideChildrenInMenu,
          target: target,
          authority: authority,
        },
        // 该路由对应页面的 组件 (动态加载 @/views/ 下面的路径文件)
        component:
          item.component && defineRouteComponentKeys.includes(item.component)
            ? defineRouteComponents[item.component]
            : () => import(/* @vite-ignore */ `../views/${item.component}.vue`),
      };

      // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
      if (!currentRouter.path.startsWith('http')) {
        currentRouter.path = currentRouter.path.replace('//', '/');
      }

      // 重定向
      item.redirect && (currentRouter.redirect = item.redirect);

      // 子菜单，递归处理
      (currentRouter.children as any) = generator(routeMap, item.id, currentRouter);
      if (currentRouter.children === undefined || currentRouter.children.length <= 0) {
        delete currentRouter.children;
      }
      return currentRouter;
    })
    .filter(item => item);
};

/**
 * 根据路径分组收集功能项
 * @param pathMap
 * @param routes
 */
const getRepeatedFunctionMap = (pathMap: Map<string, MenuDataItem[]>, routes: MenuDataItem[]) => {
  routes.forEach(item => {
    if (item.children && item.children.length > 0) {
      getRepeatedFunctionMap(pathMap, item.children);
    } else {
      const path = item.path;
      const pathItemArrayList = pathMap.get(path);
      if (pathItemArrayList) {
        pathItemArrayList.push(item);
      } else {
        pathMap.set(path, [item]);
      }
    }
  });
};

/**
 * 解决功能重复挂载在不同菜单上的问题
 * @param routes
 * @returns
 */
const convertRepeatedFunction = (routes: MenuDataItem[]) => {
  const pathMap = new Map();
  getRepeatedFunctionMap(pathMap, routes);
  // 获取有重复挂载的功能项
  const repeatedArrs = Array.from(pathMap.values()).filter(f => f.length > 1);

  repeatedArrs.forEach(arr => {
    const firstUKey = `_puk_${uuid(6).toLowerCase()}`;

    //添加一个默认路由，保证其他功能能通过原始name或者path访问该路由，这个路由只用作跳转和匹配原始参数
    routes.push({
      name: arr[0]?.name, //保证能通过name访问
      path: `${arr[0]?.path}/:path_unique_key?`, //保证能通过path访问（'?':将puk设置为可选）
      redirect: `${arr[0]?.path}/${firstUKey}`, //通过name或者path访问时，默认重定向到第一个匹配的路由
      meta: { hideInMenu: true, keepAlive: true }, //隐藏路由
      component: null,
    });

    //替换重复路由的路由名称（name）及访问路径（path）
    arr.forEach((item, index) => {
      //路径是否为外部链接
      const isExternalLink = externalLinkPattern.test(item.path);
      //是否内页打开的外链(有值代表是)
      const elink = item?.meta?.externalLink;

      if (index == 0) {
        //非内页打开的外链，path为实际外链地址，不需要加后缀唯一参数
        if (!isExternalLink || elink) {
          item.path = `${item.path}/${firstUKey}`;
        }
        item.name = `${item.name}_${firstUKey}`;
      } else {
        const uKey = `_puk_${uuid(6).toLowerCase()}`;
        //非内页打开的外链，path为实际外链地址，不需要加后缀唯一参数
        if (!isExternalLink || elink) {
          item.path = `${item.path}/${uKey}`;
        }
        item.name = `${item.name}_${uKey}`;
      }
    });
  });

  return routes;
};

export const generatorDynamicRouter = () => {
  return new Promise<RouteRecordRaw>((resolve, reject) => {
    retry(findMenuTreeByCurrentUserSse, 5, 1500)
      .then(result => {
        if (result) {
          // 菜单如果查询成功，会返回一个仅有一个根节点的树形结构，root id = result.menuId;
          const routes = convertMenuToRoutes([result], result?.menuId) as MenuDataItem[];
          // routes.push(notFoundRouter);
          //后台返回的菜单根节点不显示，去掉根节点;然后对重复挂载的功能进行特殊转换
          const childRouter = convertRepeatedFunction(routes[0].children || []);
          //路由的根节点使用系统的根级菜单，因为有layout
          rootRouter.children = childRouter;
          if (childRouter.length) {
            // rootRouter.redirect = childRouter[0].path;//如果没有固定首页的话，则默认使用第一个路由
            rootRouter.redirect = '/dashboard'; //每个用户都有首页的情况下，默认指向首页
          }
        }

        resolve(rootRouter as RouteRecordRaw);
      })
      .catch(err => {
        message.error('菜单加载失败，请刷新页面重试');
        reject(err);
      });
  });
};

//将后端返回的菜单数据转换成前端标准路由数据格式
export const convertMenuToRoutes = (menus: MenuItem[] = [], rootId: string): MenuDataItem[] => {
  return menus.map(menuItem => {
    const menuKey = menuItem.menuCode || menuItem.childCode || menuItem.menuId;
    const routeItem: MenuDataItem = {
      name: menuKey,
      path: `/${menuKey}`, //文件夹没有具体路径分配，拿id做替代
      redirect: '',
      meta: { title: menuItem.menuName, icon: menuItem.menuIcon || undefined },
      component: defineRouteComponents.RouteView,
    };
    //两个都为空说明是文件夹,有childId说明是子菜单,这两种情况下，下级直接取children
    if ((!menuItem.functionId && !menuItem.childId) || menuItem.childId) {
      if (menuItem.children != null) {
        routeItem.children = convertMenuToRoutes(menuItem.children, rootId);
        //遍历子菜单，如果是文件夹，则将组件置为RouterView
        routeItem.children = routeItem.children?.map((m: any, index: number) => {
          //如果不是根节点下第一个子节点，且为文件夹的话，则将组件置为RouterView
          if (
            menuItem.children[index]?.parentId !== rootId &&
            m.component === defineRouteComponents.RouteView
          ) {
            /*  不能直接用RouterView作为父路由组件进行包裹，
                如果三级或以下菜单开启keepAlive会导致同RouterView下的组件会当成子路由处理，直接替换子组件；
                且切换时无法销毁上一个keepAlive的子路由，发生页面重复,重复调用setup
                需要如下操作特殊处理下 */
            /* const wrapperComponent = defineComponent({
              name: m.name,
              setup(props, { attrs }) {
                return () =>
                  h(
                    'div',
                    { style: 'height:100%;width:100%' },
                    h(RouterView, { ...props, ...attrs }),
                  );
              },
            });
            m.component = wrapperComponent; */
            /**
             * 新逻辑，概念转换，舍弃中间层级（文件夹层级）的RouterView，将component置为null
             * 等于Layout下的路由只有RouteView一层，然后就是具体页面组件
             * 这样无论路由（菜单，菜单是由路由构成的）有几层，等于每个页面组件都是处于路由第二层，这样就可以使用keepAlive
             */
            m.component = null;
          }
          return m;
        });
      } else {
        routeItem.children = null;
      }
      //菜单重定向到下级菜单的第0个元素的路径上
      routeItem.redirect = routeItem.children?.[0].path || '';
    } else if (menuItem.functionId) {
      //有functionId说明是具体功能（页面）,下级直接取function
      const functionRoute =
        menuItem.function == null
          ? null
          : convertFunctionToRoutes([menuItem.function], menuItem.menuId); //文件夹的function是单个，不是数组
      if (functionRoute?.length) {
        //因为传递只传递单个function，所以转换出来也只有一个route，转换出来的结果直接当做该节点的路由
        Object.assign(routeItem, functionRoute[0]);
        //因为现在的菜单就是功能，重定向，应该重定向到该功能的子功能路径上
        routeItem.redirect = functionRoute[0].children?.[0]?.path || '';
        //但是标题跟图标根据菜单设置为准
        routeItem.meta.title = menuItem.menuName;
        routeItem.meta.icon = menuItem.menuIcon || undefined;
        //是否内页打开的外链
        const elink = routeItem?.meta?.externalLink;
        //如果功能直接挂在根节点，则component需要RouteView包裹一下
        if (menuItem.parentId == rootId) {
          //其他功能因为是异步组件原因，需要再包裹一层defineAsyncComponent，再挂载到RouteView下
          const c = defineAsyncComponent(routeItem.component as any);
          //如果是内页打开的外链，组件还需要传递props:externalLink
          routeItem.component = h(RouteView, null, () =>
            h(c, elink ? { externalLink: elink } : null),
          );
        } else if (elink) {
          //如果功能没挂在根节点
          //且是内页打开的外链，组件还需要传递props:externalLink（这里不需要再包裹RouteView，因为没挂在根节点，上层或祖先路由已经包裹了RouteView）
          const c = defineAsyncComponent(routeItem.component as any);
          routeItem.component = h(c, elink ? { externalLink: elink } : null);
        }
      }
    }
    return routeItem;
  });
};

//将后端返回的功能数据转换成前端标准路由数据格式
const convertFunctionToRoutes = (
  functions: FunctionItem[] = [],
  menuId: string,
): MenuDataItem[] => {
  const result: MenuDataItem[] = [];
  duffDevice<FunctionItem>(functions, functionItem => {
    //只获取功能类型（A），B是权限/按钮设置
    if (functionItem.functionType !== 'A') return;
    const getItem = () => {
      //路径是否为外部链接
      const isExternalLink = externalLinkPattern.test(functionItem.path);
      //是否为内部打开外部链接
      const isInnerOpen = functionItem.openMethod === 0;

      const getComponent = () => {
        if (isExternalLink && isInnerOpen) {
          return defineRouteComponents['ExternalLinkView'];
        } else {
          return () => import(/* @vite-ignore */ `../views/${functionItem.component}.vue`);
        }
      };
      const c = getComponent();
      const routeItem: MenuDataItem = {
        name: functionItem.name,
        path: isExternalLink && isInnerOpen ? `/${functionItem.name}` : functionItem.path, //文件夹没有具体路径分配，拿id做替代；外链且内部打开的话，路径按名称做替代
        redirect: functionItem.redirect,
        component: c,
        meta: {
          title: functionItem.functionName,
          icon: functionItem.icon,
          hideChildrenInMenu: functionItem.hideChildrenInMenu,
          hideInMenu: functionItem.hideInMenu,
          keepAlive: functionItem.keepAlive,
          lock: functionItem.lockInTab,
          mergeTab: functionItem.mergeTab,
          externalLink: isExternalLink && isInnerOpen ? functionItem.path : undefined,
          authority:
            functionItem.children == null ? [] : convertFunctionToAuth(functionItem.children),
          permission:
            functionItem.blockList == null
              ? null
              : convertBlockAndColumnToRouteMetaPermission(functionItem.blockList),
          logMenuId: menuId,
        },
      };
      routeItem.children =
        functionItem.children == null
          ? null
          : convertFunctionToRoutes(functionItem.children, menuId); //功能路由与子功能路由同属一个菜单下，所以menuId与父级一致
      return routeItem;
    };

    result.push(getItem());
  });
  return result;
};

//将功能类型为B的权限/按钮转换成菜单节点上的权限(authority)
const convertFunctionToAuth = (functions: FunctionItem[] = []) => {
  const result = [];
  duffDevice<FunctionItem>(functions, functionItem => {
    if (functionItem.functionType !== 'B') return;
    result.push(functionItem.functionCode);
  });
  return result;
};

//将需要隐藏的列，转换成路由权限数据
const convertBlockAndColumnToRouteMetaPermission = (
  blockData: BlockItem[],
): MenuRouteMetaPermission[] => {
  return (
    blockData?.map(item => {
      return {
        blockCode: item.fcCode,
        hideColumns:
          item.children == null
            ? []
            : item.children
                .filter(f => f.hideColumn === true)
                .map(m => {
                  const code = m.fcCode;
                  //如果控制字段中包含英文.则说明该字段设置对应的是前端列的dataIndex的数组设置，需要将字段控制转成数组
                  if (m.fcCode.includes('.')) {
                    return code.split('.');
                  }
                  return code;
                }),
        disabledFields:
          item.children == null
            ? []
            : item.children
                .filter(f => f.editableFlag === 'N')
                .map(m => {
                  const code = m.fcCode;
                  //如果控制字段中包含英文.则说明该字段设置对应的是前端列的dataIndex的数组设置，需要将字段控制转成数组
                  if (m.fcCode.includes('.')) {
                    return code.split('.');
                  }
                  return code;
                }),
      };
    }) || []
  );
};
