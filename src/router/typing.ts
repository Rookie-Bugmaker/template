import type { VNodeChild } from 'vue';
import type {
  // RouteRecordRaw,
  RouteMeta,
  RouteComponent,
  RouteRecordRedirectOption,
} from 'vue-router';

type Lazy<T> = () => Promise<T>;

export interface MenuRouteMetaPermission {
  blockCode: string;
  hideColumns: (string | number | readonly (string | number)[])[];
  disabledFields: (string | number | readonly (string | number)[])[];
}

export interface MenuRouteMeta {
  hideChildrenInMenu?: boolean;
  hideInBreadcrumb?: boolean;
  hideInMenu?: boolean;
  icon?: string | VNodeChild | JSX.Element;
  authority?: string | string[];
  target?: '_blank' | '_self' | '_parent' | '_top';
  keepAlive?: boolean;
  lock?: boolean;
  mergeTab?: boolean;
  permission?: MenuRouteMetaPermission[];
  externalLink?: string; //外链地址
  logMenuId?: string; //用于记录日志的菜单ID（根据功能记录操作日志）
}

export type MenuDataItem = {
  path: string;
  name?: string;
  children?: MenuDataItem[];
  meta?: MenuRouteMeta & RouteMeta;
  redirect?: RouteRecordRedirectOption;
  component?: RouteComponent | Lazy<RouteComponent>;
}; //& RouteRecordRaw;
