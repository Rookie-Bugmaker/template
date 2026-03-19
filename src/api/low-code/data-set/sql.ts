import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

// 分页查询自定义SQL
export interface SQLParams {
  page: number;
  pageSize: number;
  applicationId?: string;
  groupId?: string;
  viewName?: string;
  viewDesc?: string;
}

export interface SQLItem {
  viewId?: string;
  customSql: string;
}
export interface SQLParamListItem {
  viewId: string;
  paramCode: string;
}
export interface SQLFiledListItem {
  key?: string;
  viewId: string;
  fieldCode: string; //字段编码
  fieldSerialNo: string; //序号
  fieldDesc: string; //字段描述
  fieldType: string; //字段类型
  fieldId: string;
}

export interface SQLData {
  name: string;
  groupName: string;
  groupId: string; //分组ID
  viewDesc: string; //描述
  viewId: string; //视图ID
  viewName: string; //视图名称
  releaseStatus: string; //发布状态
  status: string; //状态
  viewSql: SQLItem; //SQL定义对象
  applicationId: string; //应用ID
  sqlParamList: SQLParamListItem[]; //SQL参数列表
  fieldList: SQLFiledListItem[]; //字段列表
}

export interface SQLResult {
  lastUpdateDate: string;
  groupId: string;
  lastUpdateLogin: string;
  viewDesc: string;
  language: string;
  createBy: string;
  viewId: string;
  name: string;
  viewName: string;
  releaseStatus: string;
  viewSql: string;
  applicationId: string;
  fieldList: string;
  createDate: string;
  lastUpdateBy: string;
  status: string;
}
export const findByPage = (params: SQLParams) =>
  request.post<SQLParams, ResponseBody<PageResult<SQLResult>>>(
    `${Service.LOWCODE}/view/findByPage`,
    params,
  );
// 根据id删除视图
export const deleteByIds = (viewIds: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/view/delete`, { viewIds });

// 根据id查询表结构
export const getViewById = (viewId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/view/findById`, { viewId });

// 新增
export const addView = (params: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/view/add`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
// 修改
export const updateView = (params: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/view/update`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

// 发布
export const releaseView = (viewIds: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/view/release`, { viewIds });

// 提取SQL字段列表
export const getFieldListByCustomSql = (customSql: string, applicationId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/view/getFieldListByCustomSql`, {
    customSql,
    applicationId,
  });

// 导入表结构
export const uploadView = (params: FormData) => {
  return request.post<FormData, ResponseBody>(`${Service.LOWCODE}/view/import`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 根据应用ID或分组ID分页查询自定义SQL参数
export interface SQLPageParams {
  page: number;
  pageSize: number;
  applicationId?: string;
  groupId?: string;
  viewName?: string;
  name?: string;
  viewDesc?: string;
}

// 根据应用ID或分组ID分页查询自定义SQL
export const findPageByApplicationIdOrGroupId = (params: SQLPageParams) =>
  request.post<SQLPageParams, ResponseBody<PageResult<SQLResult>>>(
    `${Service.LOWCODE}/view/findPageByApplicationIdOrGroupId`,
    params,
  );
