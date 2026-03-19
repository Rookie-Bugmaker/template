import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export interface ApplicationParams {
  page: number;
  pageSize: number;
  applicationName: string;
}

export interface ApplicationItem {
  applicationId: string;
  applicationCode: string;
  applicationName: string;
  applicationNameEn: string;
  applicationDesc: string;
  applicationIcon: string;
  dataSourceId: string;
  fileHeaderId: string;
  language?: string;
  projectId: string;
}
export interface ApplicationOperationParams {
  applicationId: string;
  applicationCode: string;
  applicationName: string;
  applicationNameEn?: string;
  applicationDesc: string;
  applicationIcon: string;
  dataSourceId: string;
  fileHeaderId?: string;
  state?: number;
  language?: string;
  projectId: string;
}

// 添加app
export const insertApp = (params: ApplicationOperationParams) =>
  request.post<ApplicationOperationParams, ResponseBody>(
    `${Service.LOWCODE}/application/add`,
    params,
  );

// 根据id删除app
export const deleteById = (applicationId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/application/delete`, { applicationId });

// 修改
export const updateApp = (params: ApplicationOperationParams) =>
  request.post<ApplicationOperationParams, ResponseBody>(
    `${Service.LOWCODE}/application/update`,
    params,
  );

// 查询app列表
export const getAppList = (params: ApplicationParams) =>
  request.get<ApplicationParams, ResponseBody>(`${Service.LOWCODE}/application/findByPage`, {
    params,
  });

// // 根据部门id更新app
export const getAppById = (applicationId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/application/findById`, { applicationId });
