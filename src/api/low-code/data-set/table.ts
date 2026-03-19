import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export interface FiledItem {
  fieldCode: string; //字段编码
  fieldDesc: string; //字段描述
  fieldSerialNo: string; //字段序号
  tableId?: string; //表结构ID
  allowNull: boolean | string; //可为空
  fieldType: string; //字段类型
  fieldAccuracy: any; //精度
  fieldId?: string; //字段ID
  fieldLength: any; //长度
  primaryKey: boolean | string; //是否为主键
  status: string;
  dataAuth: string; //字段权限
  key?: string;
}

export interface indexFieldListItem {
  fieldCode: string; //字段编码
  indexId: string; //索引ID
}

export interface indexItem {
  key?: string;
  indexType: string; //索引类型
  indexId?: string; //索引ID
  tableId?: string; //表结构ID
  indexCode: string; //索引名称
  indexSerialNo: string; //索引序号
  indexFieldList: any;
}
export interface FormState {
  applicationId?: string;
  groupId?: string;
  tableId?: string;
  tableName: string;
  tableFullName: string;
  groupName: string;
  tableDesc: string;
  status: string;
  enableOrg: string;
  releaseStatus: string;
  fieldList: FiledItem[];
  indexList: indexItem[];
  associatedTableFlag?: 'Y' | 'N';
}

export interface fieldListItem {
  fieldSerialNo: number; //字段序号
  fieldCode: string; //字段编码
  fieldDesc: string; //字段描述
  fieldType: string; //字段类型(根据接口获取)
  fieldLength: number; //字段长度
  fieldAccuracy: number; //字段精度
  allowNull: string; //可为空(Y/N:是/否)
  primaryKey: string; //是否为主键(Y/N:是/否)
  status: string; //状态(Y/N:正常/禁用)
}

export interface TableParams {
  language?: string;
  tableName?: string;
  tableFullName?: string;
  tableDesc?: string;
  page: number;
  pageSize: number;
  applicationId?: string;
  groupId?: string;
}

// 表结构分页查询
export interface TableResult {
  lastUpdateDate: string;
  groupId: string;
  lastUpdateLogin: string;
  language: string;
  indexList: null;
  tableFullName: string;
  tableDesc: string;
  tableName: string;
  createBy: string;
  groupName: string;
  enableOrg: string;
  releaseStatus: string;
  tableId: string;
  applicationId: string;
  fieldList: string;
  createDate: string;
  lastUpdateBy: string;
  status: string;
}
export const findByPage = (params: TableParams) =>
  request.post<TableParams, ResponseBody<PageResult<TableResult>>>(
    `${Service.LOWCODE}/table/findByPage`,
    params,
  );

// 根据id删除表结构
export const deleteById = (tableIds: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/table/delete`, { tableIds });

// 新增
export const addTable = params =>
  request.post<any, ResponseBody>(`${Service.LOWCODE}/table/add`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
// 修改
export const updateTable = params =>
  request.post<any, ResponseBody>(`${Service.LOWCODE}/table/update`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

// 发布
export const releaseTable = (tableIds: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/table/release`, { tableIds });

// 查询表字段类型
export const getFieldType = (applicationId: string) =>
  request.post<null, ResponseBody>(`${Service.LOWCODE}/table/findTableFieldType`, {
    applicationId,
  });

// 根据id查询表结构
export const getTableById = (tableId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/table/findByTableId`, { tableId });

// 导入表结构
export const uploadTable = (params: FormData) => {
  return request.post<FormData, ResponseBody>(`${Service.LOWCODE}/table/import`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

//根据应用ID或分组ID分页查询表结构参数
export interface TablePageParams {
  page: number;
  pageSize: number;
  applicationId?: string;
  groupId?: string;
  tableName?: string;
  tableFullName?: string;
  tableDesc?: string;
}
//根据应用ID或分组ID分页查询表结构
export const findPageByApplicationIdOrGroupId = (params: TablePageParams) =>
  request.post<TablePageParams, ResponseBody<PageResult<TableResult>>>(
    `${Service.LOWCODE}/table/findPageByApplicationIdOrGroupId`,
    params,
  );

// 发布(新版本)
export const releaseTableNew = (tableIds: string, associatedTableFlag: 'Y' | 'N') =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/table/releaseNew`, {
    tableIds,
    associatedTableFlag,
  });

// 获取数据库类型
export const getApplicationDbType = (applicationId: string) =>
  request.get<null, ResponseBody>(`${Service.LOWCODE}/table/getDbType`, {
    params: {
      applicationId,
    },
  });

// 根据id查询表结构变化
export const checkTableDiff = (tableId: string) =>
  request.get<string, ResponseBody>(`${Service.LOWCODE}/table/checkTableField`, {
    params: { tableId },
  });

// 根据表名获取数据库中的表结构信息
export const getDatabaseTableInfo = (applicationId: string, tableName: string) =>
  request.get<string, ResponseBody>(`${Service.LOWCODE}/table/getDatabaseTableInfo`, {
    params: { applicationId, tableName },
  });
