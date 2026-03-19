import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import axios from 'axios';
import type { ResponseBody, PageResult } from '@/api/typing';
import type { OperatorType } from '@/views/low-code/design/typing/operator';
import type { LogicType } from '@/api/workflow/template/typing';
import { Service } from '@/api/typing';

export type DataSourceType = 'table' | 'view';
// export type LogicType = 'and' | 'or';
export type SortType = 'asc' | 'desc';
export type NullsType = 'none' | 'first' | 'last';
export type ApiType = 0 | 1; // 0 内部 1 外部
// 接口类型
export type CodeType =
  | 'query'
  | 'queryByPagination'
  | 'insert'
  | 'delete'
  | 'update'
  | 'queryByObject';

// 参数信息
export interface Parameter {
  /* 参数字段 */
  parameter: string;
  /* 是否必填 */
  required: boolean;
  /* 参数描述 */
  description: string;
  /* 是否禁止 */
  disabled?: boolean;
  [key: string]: any;
}

// 过滤信息
export interface Filter {
  /* 数据源字段 */
  field: string;
  /* 类型 */
  type: string;
  /* 参数字段 */
  value: string;
  /* 操作 */
  operator: OperatorType;
  [key: string | symbol]: any;
}

//Api信息
export interface ApiItem extends ApiOperationParams {
  id: string;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface ApiParams {
  page?: number;
  pageSize?: number;
  lowCodeApi?: string;
  apiType?: number;
  type?: string;
}

export interface QueryConfig {
  /* 数据源ID */
  objectId: string;
  /* 数据源类型 */
  type: DataSourceType;
  /* 参数绑定 */
  params?: Array<{
    /* 数据源字段 */
    key: string;
    /* 参数字段 */
    value: string;
  }>;
  /* 过滤 */
  filter?: {
    /* 逻辑 */
    logic: LogicType;
    filters: Array<{
      logic: LogicType;
      filters: Array<Filter>;
    }>;
  };
  /* 排序 */
  sort?: Array<{
    /* 字段 */
    field: string;
    /* 类型 */
    type: SortType;
    /* 对空处理 */
    nulls: NullsType;
  }>;
  page?: number;
  pageSize?: number;
  [key: string | symbol]: any;
}

export interface QueryByPaginationConfig extends QueryConfig {
  page: number;
  pageSize: number;
}

//Api操作
export interface ApiOperationParams {
  apiId?: string;
  /* 接口标识 */
  lowCodeApiCode: string;
  /* 接口类型 */
  type: CodeType;
  /* 接口类型 */
  apiType: ApiType;
  /* 其他参数 */
  parameterList: Array<Parameter>;
  config: QueryConfig;
  [key: string | symbol]: any;
}

export interface DeleteParams {
  ids: string;
}

export interface FacadeParams {
  lowCodeApiCode: string;
  [key: string]: any;
}

export async function findApiByPage(params: ApiParams) {
  return request.get<ApiParams, ResponseBody<PageResult>>(
    `${Service.LOWCODE}/api/page/${params.page}/${params.pageSize}`,
    {
      params,
    },
  );
}

export async function findApiByType(params: ApiParams) {
  return request.get<ApiParams, ResponseBody<PageResult<ApiItem>>>(
    `${Service.LOWCODE}/api/pageByType/${params.page}/${params.pageSize}`,
    {
      params,
    },
  );
}

export async function addApi(params: ApiOperationParams) {
  return request.post<ApiOperationParams, ResponseBody>(`${Service.LOWCODE}/api/add`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function updateApi(params: ApiOperationParams) {
  return request.put<ApiOperationParams, ResponseBody>(`${Service.LOWCODE}/api/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function deleteApi(id: string) {
  return request.delete<DeleteParams, ResponseBody>(`${Service.LOWCODE}/api/delete/${id}`);
}

export async function facadeList(params: FacadeParams) {
  return request.post<FacadeParams, ResponseBody>(`${Service.LOWCODE}/facade/list`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function facadeListByPage(params: FacadeParams) {
  return request.post<FacadeParams, ResponseBody<PageResult>>(
    `${Service.LOWCODE}/facade/listByPage`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

export async function facadeInsert(params: FacadeParams) {
  return request.post<FacadeParams, ResponseBody>(`${Service.LOWCODE}/facade/insert`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function facadeUpdate(params: FacadeParams) {
  return request.put<ApiOperationParams, ResponseBody>(`${Service.LOWCODE}/facade/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function facadeDelete(params: FacadeParams) {
  return request.delete<DeleteParams, ResponseBody>(`${Service.LOWCODE}/facade/delete`, {
    data: params,
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

// 测试外部接口
export async function testApi(data: any) {
  const { params, apiMethod, apiUri, parameterType } = data;
  // const request = axios.create({
  //   // API 请求的默认前缀
  //   baseURL: process.env.VUE_APP_API_BASE_URL,
  //   timeout: 15000, // 请求超时时间
  // });
  return axios[apiMethod](`${apiUri}`, params, {
    headers: {
      'Content-Type': parameterType,
    },
  });
}

// 分页
export async function queryByPagination(params: ApiOperationParams) {
  return request.post<ApiOperationParams, ResponseBody>(
    `${Service.LOWCODE}/queryByPagination`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

// 列表
export async function queryList(params: ApiOperationParams) {
  return request.post<ApiOperationParams, ResponseBody>(`${Service.LOWCODE}/query`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
