import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

import type { OrgItem } from '@/api/system/org';
import type { FlagType } from '@/api/system/function/block-column';

export interface CheckedFunctionColumn {
  fcId: string;
  fcEditableFlag: FlagType;
}

export interface RoleColumnValueSet {
  fcId: string;
  blockId: string;
  vsId: string; //值集的值id
}

//编辑时使用
export interface RowRole {
  key: number; //编辑时的主键
  fcId: string;
  blockId: string;
  vsIds: string[]; //值集的值id
}

//角色信息
export interface RoleItem {
  roleId: string;
  roleCode: string;
  roleName: string;
  roleDescription: string;
  menuId: string;
  enableFlag: string;
  roleMenuList?: RoleMenuItem[];
  roleOrgList?: OrgItem[];
  checkedFunctionColumns?: CheckedFunctionColumn[];
  roleColumnValueSets?: RoleColumnValueSet[];
  dataAuthList?: DataAuthItem[];
  projectId?: number;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;

  roleCompanyDeptList?: IRoleCompanyDeptItem[];
  projectNameCn?: string;
}

export interface RoleMenuItem {
  roleId: string;
  menuId: string;
  halfChecked: boolean;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
}

export interface DataAuthValueItem {
  authValue: string;
  authValueDesc: string;
}

export interface DataAuthItem {
  profileId: string;
  dataAuthValueList: DataAuthValueItem[];
}

export interface IRoleCompanyDeptItem {
  companyId: number;
  deptIdList: number[];
}

//角色操作
export interface RoleOperationParams {
  roleId?: string;
  roleCode: string;
  roleName: string;
  roleDescription: string;
  menuId: string;
  checkedMenuIds: string[];
  halfCheckedMenuIds: string[];
  enableFlag: string;
  checkedOrgIds: string[];

  checkedFunctionColumns: CheckedFunctionColumn[];
  checkedDisplayFcIds?: string[]; //编辑时使用，实际不保存
  checkedEditableFcIds?: string[]; //编辑时使用，实际不保存

  roleColumnValueSets: RoleColumnValueSet[];
  rowRoles?: RowRole[]; //编辑时使用，实际不保存

  dataAuthList?: DataAuthItem[];

  projectId?: number;
  roleCompanyDeptList: IRoleCompanyDeptItem[];
}

export interface RoleParams {
  page: number;
  pageSize: number;
  roleCode?: string;
  roleName?: string;
  roleDescription?: string;
  enableFlag?: string;
  menuId?: string;
  projectId?: number;
}

export interface QueryByIdParams {
  roleId: string;
}
export interface DeleteParams {
  roleIds: string;
}

export async function findRoleByPage(params: RoleParams) {
  return request.post<RoleParams, ResponseBody<PageResult<RoleItem>>>(
    `${Service.SYS}/role/findByPage`,
    params,
  );
}

export async function findRoleById(roleId: string) {
  return request.post<QueryByIdParams, ResponseBody<RoleItem>>(`${Service.SYS}/role/findById`, {
    roleId,
  });
}

export async function addRole(params: RoleOperationParams) {
  return request.post<RoleOperationParams, ResponseBody>(`${Service.SYS}/role/add`, params, {
    headers: {
      ...CONTENT_TYPE_APPLICATION_JSON,
    },
  });
}
export async function updateRole(params: RoleOperationParams) {
  return request.post<RoleOperationParams, ResponseBody>(`${Service.SYS}/role/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function deleteRole(roleIds: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/role/delete`, { roleIds });
}

//查询当前用户拥有的角色列表
export async function findRoleListByCurrentUser() {
  return request.post<null, ResponseBody<RoleItem[]>>(
    `${Service.SYS}/role/findRoleListByCurrentUser`,
  );
}

export async function copyRole(roleId: string) {
  return request.post<{ roleId: string }, ResponseBody>(`${Service.SYS}/role/copy`, { roleId });
}

/** 关联用户公司部门 */
export interface CompanyDeptInfo {
  companyId: number;
  companyName: string;
  deptList: DeptInfo[];
  deptTree: DeptInfo[];
}

export interface DeptInfo {
  /** 部门ID */
  id: number;
  orgCode: string;
  parentOrgCode: string;
  companyId: number;
  /** 部门名称 */
  departmentName: string;
  /** 排序 */
  departmentOrder?: number;
  /** 状态(1:启用；0:禁用) */
  status: string;
  /** 部门备注 */
  remark: string;
  /** 子部门 */
  children?: DeptInfo[] | null;
  /**页面选择禁用 */
  disabled?: boolean;
}

/**获取当前用户角色公司、部门信息 */
export async function findCurrentUserOrgInfo() {
  return request.get<any, ResponseBody<CompanyDeptInfo[]>>(
    `${Service.SYS}/role/findRoleCompanyDeptInfoByCurrentUser`,
  );
}
