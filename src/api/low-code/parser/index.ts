import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export interface OperationParams {
  pageId: string;
  beanName?: string;
  data: [
    {
      objectId: string;
      data: any[];
    },
  ];
}

export type QueryObjectType = 'view' | 'table';

export type QueryDynamicValueType = 'varchar2' | 'number' | 'date';

export interface QueryDynamicParams {
  key: string;
  value: string;
  type: QueryDynamicValueType;
}

export type QueryFilterLogic = 'and' | 'or';

export enum QueryFilterOperatorType {
  eq = 'eq', //(equal to)
  neq = 'neq', //(not equal to)
  isnull = 'isnull', //(is equal to null)
  isnotnull = 'isnotnull', //(is not equal to null)
  lt = 'lt', //(less than)
  lte = 'lte', //(less than or equal to)
  gt = 'gt', //(greater than)
  gte = 'gte', //(greater than or equal to)
  startswith = 'startswith',
  doesnotstartwith = 'doesnotstartwith',
  endswith = 'endswith',
  doesnotendwith = 'doesnotendwith',
  contains = 'contains',
  doesnotcontain = 'doesnotcontain',
  /* isempty = 'isempty',
      isnotempty = 'isnotempty', */
  in = 'in',
}

export interface QueryFilterItem {
  field: string;
  operator: QueryFilterOperatorType;
  value: string;
}

export interface QueryFilter {
  logic: QueryFilterLogic;
  filters: (QueryFilter | QueryFilterItem)[];
}

export type QuerySortType = 'asc' | 'desc';

export type QuerySortNulls = 'none' | 'first' | 'last';

export interface QuerySort {
  field: string;
  type: QuerySortType;
  nulls: QuerySortNulls;
}

export interface QueryParams {
  pageId: string;
  //functionId?: string;
  objectId: string;
  type: QueryObjectType;
  page?: number;
  pageSize?: number;
  fuzzyQuery: {
    fields: string[];
    value: string;
  };
  params: QueryDynamicParams[];
  filter: QueryFilter;
  sort: QuerySort[];
}

//新增
export const insertData = (params: OperationParams) =>
  request.post<OperationParams, ResponseBody>(`${Service.LOWCODE}/insert`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

//更新
export const updateData = (params: OperationParams) =>
  request.put<OperationParams, ResponseBody>(`${Service.LOWCODE}/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

//删除
export const deleteData = (params: OperationParams) =>
  request.delete<OperationParams, ResponseBody>(`${Service.LOWCODE}/delete`, {
    data: params,
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

//分页查询
export const queryByPage = (params: QueryParams) =>
  request.post<QueryParams, ResponseBody<PageResult>>(
    `${Service.LOWCODE}/queryByPagination`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );

//列表查询
export const queryByList = (params: QueryParams) =>
  request.post<QueryParams, ResponseBody<any[]>>(`${Service.LOWCODE}/query`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

//构建单个查询所需要的配置信息
export interface QueryByIdConfig {
  pageId: string;
  objectId: string;
  type: 'table' | 'view';
  primaryKey: string;
}

//单个查询(通过列表查询构建)
export const queryById = (
  config: QueryByIdConfig,
): ((v: string | number, params?: any[]) => Promise<ResponseBody>) => {
  const initParams = (val: string, params?: any[]): QueryParams => {
    return {
      pageId: config.pageId,
      objectId: config.objectId,
      type: config.type,
      fuzzyQuery: {
        fields: [],
        value: '',
      },
      params: params,
      filter: {
        logic: 'and',
        filters: [{ field: config.primaryKey, operator: QueryFilterOperatorType.eq, value: val }],
      },
      sort: [],
    };
  };
  return (value: string, params = []) =>
    new Promise((resolve, reject) => {
      request
        .post<QueryParams, ResponseBody<any[]>>(
          `${Service.LOWCODE}/query`,
          initParams(value, params),
          {
            headers: { ...CONTENT_TYPE_APPLICATION_JSON },
          },
        )
        .then(response => {
          if (response.success) {
            if (response.result?.length) {
              resolve(Object.assign(response, { result: response.result[0] }));
            } else {
              resolve(Object.assign(response, { result: null }));
            }
          } else {
            reject(response);
          }
        })
        .catch(err => reject(err));
    });
};

export interface QueryByIdsConfig {
  pageId: string;
  objectId: string;
  type: 'table' | 'view';
  primaryKey: string;
}

//根据多个id(逗号隔开)查询列表
export const queryByIds = (
  config: QueryByIdConfig,
): ((v: string | number, params?: any[]) => Promise<ResponseBody>) => {
  const initParams = (val: string, params?: any[]): QueryParams => {
    return {
      pageId: config.pageId,
      objectId: config.objectId,
      type: config.type,
      fuzzyQuery: {
        fields: [],
        value: '',
      },
      params: params,
      filter: {
        logic: 'and',
        filters: [{ field: config.primaryKey, operator: QueryFilterOperatorType.in, value: val }],
      },
      sort: [],
    };
  };
  return (value: string, params = []) =>
    request.post<QueryParams, ResponseBody<any[]>>(
      `${Service.LOWCODE}/query`,
      initParams(value, params),
      {
        headers: { ...CONTENT_TYPE_APPLICATION_JSON },
      },
    );
};
