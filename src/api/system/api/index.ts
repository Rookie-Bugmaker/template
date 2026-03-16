import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export type ApiMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

//Api信息
export interface ApiItem {
  id: string;
  apiName: string;
  apiMethod: ApiMethod;
  apiUri: string;
  apiDesc: string;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface ApiParams {
  page: number;
  pageSize: number;
  apiUri: string;
  apiName: string;
  apiDesc: string;
}

//Api操作
export interface ApiOperationParams {
  id?: string;
  apiUri: string;
  apiMethod: ApiMethod;
  apiName: string;
  apiDesc: string;
}

export interface DeleteParams {
  ids: string;
}

export async function findApiByPage(params: ApiParams) {
  return request.post<ApiParams, ResponseBody<PageResult<ApiItem>>>(
    `${Service.SYS}/api/findByPage`,
    params,
  );
}

export async function addApi(params: ApiOperationParams) {
  return request.post<ApiOperationParams, ResponseBody>(`${Service.SYS}/api/add`, params);
}
export async function updateApi(params: ApiOperationParams) {
  return request.post<ApiOperationParams, ResponseBody>(`${Service.SYS}/api/update`, params);
}

export async function deleteApi(ids: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/api/delete`, { ids });
}

// 导入
export async function importApi(params: FormData) {
  return request.post<FormData, ResponseBody<any>>(`${Service.SYS}/api/import`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 根据URI查询API信息(批量)
export async function findByUris(uris: string[]) {
  return request.post<string[], ResponseBody<ApiItem[]>>(`${Service.SYS}/api/findByUris`, uris, {
    headers: {
      ...CONTENT_TYPE_APPLICATION_JSON,
    },
  });
}
