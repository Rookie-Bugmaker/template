import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';
import type { RoleItem } from '@/api/system/role/index';

export interface UserParams {
  page: number;
  pageSize: number;
  disableState?: 'Y' | 'N';
  montage?: 'or' | 'and';
  userName?: string;
  userDescription?: string;
  roleId?: string;
}

//用户类型枚举
export enum UserType {
  EMPLOYEE = 'EMPLOYEE',
  SUPPLIER = 'SUPPLIER',
  CUSTOMER = 'CUSTOMER',
}

//用户信息
export interface UserItem {
  userId: string; //用户ID
  userName: string; //用户名称
  userDescription: string;
  password: null | string; //密码
  passwordUpdateDate: string; //密码修改时间
  userType: UserType; //用户类型，EMPLOYEE：员工、SUPPLIER：供应商、CUSTOMER：客户
  userRelationId: string; //关联ID，可以是员工ID/供应商ID/客户ID
  loginErrorCount: number; //登录错误次数，<3次无需验证码登录，4-5次需要验证码登录，>5次直接锁定
  lastLoginInfoId: number; //最后登录的日志ID
  disableState: string;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;
  roleList?: RoleItem[];
  dataAuthList?: DataAuthItem[];
  passwordExpireDate: string; //密码过期时间
  nextLoginUpdatePassword: string; //下次登录是否强制修改密码
  orgIdList?: []; //用户组织数组
}

export interface DataAuthValueItem {
  authValue: string;
  authValueDesc: string;
}

export interface DataAuthItem {
  profileId: string;
  dataAuthValueList: DataAuthValueItem[];
}

export interface EditPwd {
  rawPwd: string;
  newPwd: string;
  confirmPwd: string;
}

//用户操作
export interface UserOperationParams {
  userId?: string;
  userName: string;
  password: string;
  userType: UserType;
  userDescription: string;
  userRelationId: string;
  disableState: string;
  roleIds: string[];
  terminals: string[];
  dataAuthList?: DataAuthItem[];
  passwordExpireDate?: string; //密码过期时间
  nextLoginUpdatePassword?: string; //下次登录是否强制修改密码
  orgIdList: [];
}

export interface QueryByIdParams {
  userId: string;
}

export interface FindByUserIdsParams {
  userIds: string;
}

export interface DeleteParams {
  userIds: string;
}

export interface PasswordStrongCheckParams {
  password: string;
}

export interface SwitchRoleParams {
  roleId: string;
}

export interface SwitchOrgParams {
  orgId: string;
}

export async function findUserByPage(params: UserParams) {
  return request.post<UserParams, ResponseBody<PageResult<UserItem>>>(
    `${Service.SYS}/user/findByPage`,
    params,
  );
}

export async function findUserByPageCp(params: UserParams) {
  return request.post<UserParams, ResponseBody<PageResult<UserItem>>>(
    `${Service.SYS}/user/findByPage/cp`,
    params,
  );
}

export async function findByUserIds(userIds: string) {
  return request.post<FindByUserIdsParams, ResponseBody<UserItem[]>>(
    `${Service.SYS}/user/findByUserIds`,
    { userIds },
  );
}

export async function findUserById(userId: string) {
  return request.post<QueryByIdParams, ResponseBody<UserItem>>(`${Service.SYS}/user/findById`, {
    userId,
  });
}

export async function addUser(params: UserOperationParams) {
  return request.post<UserOperationParams, ResponseBody>(`${Service.SYS}/user/add`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
export async function updateUser(params: UserOperationParams) {
  return request.post<UserOperationParams, ResponseBody>(`${Service.SYS}/user/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
export async function deleteUser(userIds: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/user/delete`, { userIds });
}

//密码强度校验
export async function passwordStrongCheck(password: string) {
  return request.post<PasswordStrongCheckParams, ResponseBody<number>>(
    `${Service.SYS}/user/passwordStrongCheck`,
    { password },
  );
}

//切换角色
export async function switchRole(roleId: string) {
  return request.post<SwitchRoleParams, ResponseBody>(`${Service.SYS}/user/switchRole`, {
    roleId,
  });
}

//切换组织
export async function switchOrg(orgId: string) {
  return request.post<SwitchOrgParams, ResponseBody>(`${Service.SYS}/user/switchOrg`, {
    orgId,
  });
}

// 修改密码
export async function editPwd(params: EditPwd) {
  return request.post<EditPwd, ResponseBody>(`${Service.SYS}/user/updatePassword`, params);
}

//切换公司
export async function switchCompany(companyId: number) {
  return request.post<number, ResponseBody>(`${Service.SYS}/user/switchCompany`, {
    companyId,
  });
}

//切换部门
export async function switchDept(deptId: number) {
  return request.post<number, ResponseBody>(`${Service.SYS}/user/switchDept`, {
    deptId,
  });
}
