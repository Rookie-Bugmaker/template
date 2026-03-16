import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

import type { RoleItem } from '../system/role/index';

export interface UserParams {
  page: number;
  pageSize: number;
  userName: string;
  userDescription: string;
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
  password: null; //密码
  passwordUpdateDate: string; //密码修改时间
  startDate: string; //账户生效时间
  endDate: string; //账户失效时间
  userType: UserType; //用户类型，EMPLOYEE：员工、SUPPLIER：供应商、CUSTOMER：客户
  userRelationId: number; //员工ID
  loginErrorCount: number; //登录错误次数，<3次无需验证码登录，4-5次需要验证码登录，>5次直接锁定
  lastLoginInfoId: number; //最后登录的日志ID
  disableState: string;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间

  passwordExpireDate: string; //密码失效时间

  nextLoginUpdatePassword: string; //下次登录是否强制修改密码
}

//用户操作
export interface UserOperationParams {
  userId?: string;
  userName: string;
  password: string;
  userType: UserType;
  userDescription: string;
  startDate: string;
  endDate: string;
  userRelationId: number;
  disableState: string;
  roleList?: RoleItem[];

  passwordExpireDate?: string;

  nextLoginUpdatePassword?: string;
}

export interface QueryByIdParams {
  userIds: string;
}

export interface DeleteParams {
  userIds: string;
}

export interface PasswordStrongCheckParams {
  password: string;
}

export async function findUserByPage(params: UserParams) {
  return request.post<UserParams, ResponseBody<PageResult<UserItem>>>(
    `${Service.SYS}/user/findByPage`,
    params,
  );
}

export async function findUserById(userId: string) {
  return request.post<QueryByIdParams, ResponseBody<UserItem>>(`${Service.SYS}/user/findById`, {
    userId,
  });
}

export async function addUser(params: UserOperationParams) {
  return request.post<UserOperationParams, ResponseBody>(`${Service.SYS}/user/add`, params);
}
export async function updateUser(params: UserOperationParams) {
  return request.post<UserOperationParams, ResponseBody>(`${Service.SYS}/user/update`, params);
}
export async function deleteUser(userIds: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/user/delete`, { userIds });
}

//密码强度校验
export async function passwordStrongCheck(password: string) {
  return request.post<PasswordStrongCheckParams, ResponseBody>(
    `${Service.SYS}/user/passwordStrongCheck`,
    { password },
  );
}
