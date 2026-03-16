import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

import type { ApiItem } from '@/api/system/api/index';
import type { BlockItem } from '@/api/system/function/block-column';
import type { ProjectPageVO } from '@/api/system/project';

//功能类型(A:功能、B:按钮、C:列)
export type FunctionType = 'A' | 'B' | 'C';

// 打开方式（内部:0, 外部:1）
export type OpenMethodType = 0 | 1;

//功能信息
export interface FunctionItem {
  functionId: string;
  functionName: string;
  functionCode: string;
  functionDescription: string;
  functionType: FunctionType;

  parentId: string;

  parameters: string;

  icon: string;
  path: string;
  redirect: string;
  name: string;
  component: string;

  lockInTab: boolean;
  keepAlive: boolean;
  mergeTab: boolean;
  hideInMenu: boolean;
  hideChildrenInMenu: boolean;
  openMethod: OpenMethodType;

  apiList?: ApiItem[];
  children?: FunctionItem[];

  pageId?: string; //标记是否为配置页面

  blockList?: BlockItem[]; //返回没有权限的列数据（后端起的名字比较迷惑）

  parentName: string; //仅用于编辑时显示用

  projectId: number;
  projectNameCn?: string;
  project?: ProjectPageVO;

  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface FunctionParams {
  page: number;
  pageSize: number;
  functionCode?: string;
  functionName?: string;
  functionDescription?: string;
  path?: string;
  parameters?: string;
  component?: string;
  name?: string;
  redirect?: string;
  projectId?: string;
}

//功能操作
export interface FunctionOperationParams {
  functionId?: string;
  functionCode: string;
  functionName: string;
  functionDescription: string;
  functionType: FunctionType;

  parentId: string;
  parentName: string; //仅用于编辑时显示用

  parameters: string;

  icon: string;
  path: string;
  redirect: string;
  name: string;
  component: string;

  lockInTab: boolean;
  keepAlive: boolean;
  mergeTab: boolean;
  hideInMenu: boolean;
  hideChildrenInMenu: boolean;
  openMethod: OpenMethodType;

  pageId: string; //标记是否为配置页面

  vsId: string;

  projectId?: number;
}

export interface QueryByIdParams {
  functionId: string;
}

export interface DeleteParams {
  functionIds: string;
}

export interface BindingApiParams {
  functionId: string;
  apiIds: string;
}

export function findFunctionByPage(blockCode: string) {
  return async (params: FunctionParams) =>
    request.post<FunctionParams, ResponseBody<PageResult<FunctionItem>>>(
      `${Service.SYS}/function/findByPage?blockCode=${blockCode}`,
      params,
    );
}

export async function findFunctionById(functionId: string) {
  return request.post<QueryByIdParams, ResponseBody<FunctionItem>>(
    `${Service.SYS}/function/findById`,
    {
      functionId,
    },
  );
}

export async function addFunction(params: FunctionOperationParams) {
  return request.post<FunctionOperationParams, ResponseBody<string>>(
    `${Service.SYS}/function/add`,
    params,
  );
}

export async function updateFunction(params: FunctionOperationParams) {
  return request.post<FunctionOperationParams, ResponseBody>(
    `${Service.SYS}/function/update`,
    params,
  );
}

export async function deleteFunction(functionIds: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/function/delete`, {
    functionIds,
  });
}

export async function bindingApi(params: BindingApiParams) {
  return request.post<BindingApiParams, ResponseBody>(`${Service.SYS}/function/bindingApi`, params);
}

// 导入
export async function importFunction(params: FormData) {
  return request.post<FormData, ResponseBody<any>>(`${Service.SYS}/function/import`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
