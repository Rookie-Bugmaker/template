import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';
import type { OrgItem } from '@/api/system/org/index';

export type ValueSetStatus = 'Y' | 'N';
export type ValueSetRoot = 'Y' | 'N';
export type ValueSetLockFlag = 'Y' | 'N';

//ValueSet信息
export interface ValueSetItem {
  vsId: string;
  parentHeaderId: string; //树形结构的父级id(市的parentHeaderId是省，广东省的parentHeaderId也是省，通过vsRoot区分)
  parentLineId: string; //用于关联值的父级关系（广州市的parentLineId是广东省）
  parent: ValueSetItem;
  vsRoot: ValueSetRoot;
  vsOrder: string;
  vsCode: string;
  vsName: string;
  vsDesc: string;
  vsStatus: ValueSetStatus;
  children: ValueSetItem[];
  lockFlag: ValueSetLockFlag;
  language: string;
  createBy: string; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: string; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;

  organizationList?: OrgItem[];

  key?: string; //仅用于编辑表格时使用
}

export interface ValueSetParams {
  page: number;
  pageSize: number;
  vsCode: string;
  vsName: string;
  vsDesc: string;
}

//ValueSet操作
export interface ValueSetOperationParams {
  vsId?: string;
  vsCode: string;
  vsName: string;
  vsDesc: string;
  vsOrder: string;
  vsStatus: ValueSetStatus;
  parentHeaderId?: string;
  parentLineId?: string;
  vsRoot?: ValueSetRoot;
  lockFlag?: ValueSetLockFlag;

  organizationIdListStr?: string;

  key?: string; //仅用于编辑表格时使用
  parent?: ValueSetItem; //仅用于编辑时查看父项信息
}

export interface DeleteParams {
  ids: string;
}

export interface FindByIdParams {
  id: string;
}

export interface FindNoRootByCodeParams {
  vsCode: string;
}

export interface FindNoRootByIdParams {
  id: string;
}

export interface FindByParentLineIdParams {
  parentLineId: string;
}

export async function findValueSetByPage(params: ValueSetParams) {
  return request.post<ValueSetParams, ResponseBody<PageResult<ValueSetItem>>>(
    `${Service.SYS}/value/set/findByPage`,
    params,
  );
}

export async function addValueSet(params: ValueSetOperationParams) {
  return request.post<ValueSetOperationParams, ResponseBody>(
    `${Service.SYS}/value/set/add`,
    params,
  );
}
export async function updateValueSet(params: ValueSetOperationParams) {
  return request.post<ValueSetOperationParams, ResponseBody>(
    `${Service.SYS}/value/set/update`,
    params,
  );
}

export async function deleteValueSet(ids: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/value/set/delete`, { ids });
}

export async function findValueSetById(id: string) {
  return request.post<FindByIdParams, ResponseBody<ValueSetItem>>(
    `${Service.SYS}/value/set/findById`,
    { id },
  );
}

/**
 * 根据值集编码查询子级
 * @param vsCode 值集编码
 * @param restrictOrg 是否限制组织(Y/N)，不传后端默认N
 * @returns
 */
export async function findNoRootByCode(vsCode: string, restrictOrg?: string) {
  return request.post<FindNoRootByCodeParams, ResponseBody<ValueSetItem[]>>(
    `${Service.SYS}/value/set/findNoRootByCode`,
    {
      vsCode,
      restrictOrg,
    },
  );
}

export async function findNoRootById(id: string, restrictOrg?: string) {
  return request.post<FindNoRootByIdParams, ResponseBody<ValueSetItem[]>>(
    `${Service.SYS}/value/set/findNoRootById`,
    {
      id,
      restrictOrg,
    },
  );
}

/**
 * 根据父级行ID查询子级
 * @param parentLineId  父值集ID
 * @param vsCode  值集编码
 * @param restrictOrg 是否限制组织(Y/N)，不传后端默认N
 * @returns
 */
export async function findNoRootByParentLineId(
  parentLineId: string,
  vsCode: string,
  restrictOrg?: string,
) {
  return request.post<FindByParentLineIdParams, ResponseBody<ValueSetItem[]>>(
    `${Service.SYS}/value/set/findNoRootByParentLineId`,
    { parentLineId, vsCode, restrictOrg },
  );
}

export async function findValueSetHeader() {
  return request.post<FindByParentLineIdParams, ResponseBody<ValueSetItem[]>>(
    `${Service.SYS}/value/set/findHeader`,
  );
}

/**
 * 根据当前值集编码+父级行编码查询子级
 * @param vsCode 值集编码
 * @param parentLineCode 父级行编码
 * @param restrictOrg 是否限制组织(Y/N)，不传后端默认N
 * @returns
 */
export async function findNoRootByParentLineCode(
  vsCode: string,
  parentLineCode: string,
  restrictOrg?: string,
) {
  return request.post<FindNoRootByCodeParams, ResponseBody<ValueSetItem[]>>(
    `${Service.SYS}/value/set/findNoRootByParentLineCode`,
    {
      vsCode,
      parentLineCode,
      restrictOrg,
    },
  );
}
