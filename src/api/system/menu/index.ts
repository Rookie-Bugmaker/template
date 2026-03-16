import request, {
  CONTENT_TYPE_APPLICATION_JSON,
  REQUEST_HEADER_PROJECT_CODE,
} from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

import type { FunctionItem } from '@/api/system/function/index';

import { localStorage } from '@/utils/local-storage';
import { STORAGE_TOKEN_KEY, STORAGE_TOKEN_TYPE_KEY } from '@/store/user';

//菜单信息
export interface MenuItem {
  menuId: string;
  menuName: string;
  menuCode: string;
  menuDescription: string;
  menuIcon: string;
  menuSort: number;

  functionId?: string;
  function?: FunctionItem;

  parentId?: string;
  childId?: string;
  childName?: string;
  childCode?: string;
  children?: MenuItem[];

  projectId?: number;
  projectNameCn?: string;

  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface MenuParams {
  page: number;
  pageSize: number;
  menuCode?: string;
  menuName?: string;
  menuDescription?: string;
  projectId?: number;
}

//菜单操作
export interface MenuOperationParams {
  menuId?: string;
  menuCode: string;
  menuName: string;
  menuDescription: string;
  menuIcon: string;
  menuSort: number;

  functionId: string;
  function?: FunctionItem;

  parentId: string;
  childId?: string;
  childName?: string;
  children?: MenuOperationParams[];

  projectId?: number;

  key?: string; //仅用于编辑页修改
}

export interface QueryByIdParams {
  menuId: string;
}

export interface DeleteParams {
  menuIds: string;
}

export async function findMenuByPage(params: MenuParams) {
  return request.post<MenuParams, ResponseBody<PageResult<MenuItem>>>(
    `${Service.SYS}/menu/findByPage`,
    params,
  );
}

export async function findMenuById(menuId: string) {
  return request.post<QueryByIdParams, ResponseBody<MenuItem>>(`${Service.SYS}/menu/findById`, {
    menuId,
  });
}

export async function addMenu(params: MenuOperationParams) {
  return request.post<MenuOperationParams, ResponseBody<string>>(
    `${Service.SYS}/menu/add`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

export async function updateMenu(params: MenuOperationParams) {
  return request.post<MenuOperationParams, ResponseBody>(`${Service.SYS}/menu/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function deleteMenu(menuIds: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/menu/delete`, {
    menuIds,
  });
}

//查询根菜单列表
export async function findRootMenu(projectId?: number) {
  return request.post<null, ResponseBody<MenuItem[]>>(`${Service.SYS}/menu/findRootMenu`, {
    projectId,
  });
}

//查询当前用户拥有的菜单(首页菜单查询)
export async function findMenuTreeByCurrentUser() {
  return request.post<null, ResponseBody<MenuItem>>(`${Service.SYS}/menu/findTreeByCurrentUser`);
}

//查询当前用户拥有的菜单(首页菜单查询)-SSE方式
export async function findMenuTreeByCurrentUserSse(): Promise<MenuItem> {
  return new Promise((resolve, reject) => {
    const environment = process.env.VUE_APP_API_URL;
    const tokenType = localStorage.get(STORAGE_TOKEN_TYPE_KEY);
    const token = localStorage.get(STORAGE_TOKEN_KEY);
    const url = `${environment}/sys/menu/stream?Authorization=${tokenType} ${token}&${REQUEST_HEADER_PROJECT_CODE}=${process.env.VUE_APP_PROJECT_CODE}`;
    const sse = new EventSource(url);

    let menuText = '';

    sse.onmessage = function (e) {
      if (e.data === 'end') {
        sse.close();
        resolve(JSON.parse(menuText) as MenuItem);
      } else {
        menuText += e.data;
      }
    };

    sse.onerror = function (e) {
      sse.close();
      reject(e);
    };
  });
}
