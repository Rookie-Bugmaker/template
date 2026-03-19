import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export type CompositeObjectType = 'table' | 'view' | 'api' | '';
export type CompositeType = 'main' | 'translate' | 'polymerization' | '';
export type PolymerizationType = 'list' | 'object' | '';

export interface compositeFieldList {
  mainTableId: string;
  subTableId: string;
  fieldList: FieldList[];
}

// 组合操作
export interface CompositeOperationParams {
  compositeId: string;
  compositeCode: string;
  compositeName: string;
  compositeDesc: string;
  compositeRelations: CompositeRelation[];
  fieldList: string;
  compositeGraph: string;
}

// 关系信息
export interface CompositeRelation {
  objectId: string;
  objectType: CompositeObjectType;
  type: CompositeType;
  fieldList: FieldList[];
  relations?: Relation[];
  polymerizationType?: PolymerizationType;
  attrName?: string;
}

// 字段列表
export interface FieldList {
  mainField?: string;
  field?: string;
  subField?: string;
  aliasName: string;
}

// 关联关系
export interface Relation {
  mainField: string;
  operator: string;
  subField: string;
}

export interface compositeItem extends CompositeOperationParams {
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface QueryParams {
  page: number;
  pageSize: number;
  compositeCode?: string;
}

export interface DeleteParams {
  ids: string;
}

export async function findApiByPage(params: QueryParams) {
  return request.get<QueryParams, ResponseBody<PageResult<compositeItem>>>(
    `${Service.LOWCODE}/composite-datasource/findByPage`,
    {
      params,
    },
  );
}

export async function addApi(params: CompositeOperationParams) {
  return request.post<CompositeOperationParams, ResponseBody>(
    `${Service.LOWCODE}/composite-datasource/add`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

export async function updateApi(params: CompositeOperationParams) {
  return request.put<CompositeOperationParams, ResponseBody>(
    `${Service.LOWCODE}/composite-datasource/update`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

export async function deleteApi(id: string) {
  return request.delete<DeleteParams, ResponseBody>(
    `${Service.LOWCODE}/composite-datasource/${id}`,
  );
}
