import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export type OrgStatus = 'Y' | 'N';

//Org信息
export interface OrgItem {
  orgId: string;
  orgCode: string;
  orgName: string;
  orgLocation: string;
  orgStatus: OrgStatus;

  language: string;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface OrgParams {
  page: number;
  pageSize: number;
  orgCode?: string;
  orgName?: string;
}

//Org操作
export interface OrgOperationParams {
  orgId?: string;
  orgCode: string;
  orgName: string;
  orgLocation: string;
  orgStatus: OrgStatus;
}

export interface FindByIdParams {
  roleId: string;
}

export async function findOrgByPage(params: OrgParams) {
  return request.post<OrgParams, ResponseBody<PageResult<OrgItem>>>(
    `${Service.SYS}/org/findByPage`,
    params,
  );
}

export async function findById(orgId: string) {
  return request.post<string, ResponseBody>(`${Service.SYS}/org/findById`, {
    orgId,
  });
}

export async function addOrg(params: OrgOperationParams) {
  return request.post<OrgOperationParams, ResponseBody>(`${Service.SYS}/org/add`, params);
}
export async function updateOrg(params: OrgOperationParams) {
  return request.post<OrgOperationParams, ResponseBody>(`${Service.SYS}/org/update`, params);
}

export async function findOrgByRoleId(roleId: string) {
  return request.post<OrgOperationParams, ResponseBody<OrgItem[]>>(
    `${Service.SYS}/org/findByRoleId`,
    {
      roleId,
    },
  );
}

//根据当前角色查询组织列表
export async function findOrgByCurrentRole() {
  return request.post<OrgOperationParams, ResponseBody<OrgItem[]>>(
    `${Service.SYS}/org/findByCurrentRole`,
  );
}
