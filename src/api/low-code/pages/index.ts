import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export interface FormItem {
  fieldCode: string; //字段编
}
export interface FormStateParams {
  applicationId: string;
  groupId: string;
  pageId: string;
  pageCode: string;
  pageName: string;
  pageIcon: string;
  pageDesc: string;
  pageType: number;
  enableStatus?: number;
  releaseStatus?: number;
  erGraph: string;
  deleteMode: number;
  tableRelations: {
    mainTableId: string;
    subTableId: string;
    deleteMode: string;
    columnRelations: {
      mainTableColumnId: string;
      subTableColumnId: string;
    }[];
  }[];
  language?: string;
  templateId?: string;
}
export interface fileItem {
  fileHeaderId?: string;
  url?: string;
}
export interface pageParams {
  language?: string;
  groupId?: string;
  page: number;
  pageSize: number;
}
export interface updataParams {
  pageId: string;
  pageName: string;
  pageIcon: string;
  pageDesc: string;
  pageType: number;
  enableStatus?: number;
  releaseStatus?: number;
  language?: string;
}
export interface GetPageByIdParams {
  pageId: number;
}

// 分页查询页面信息
export const getPageList = (params: pageParams) =>
  request.post<pageParams, ResponseBody<PageResult>>(`${Service.LOWCODE}/page/findByPage`, params);

// 新增页面
export const addPage = (params: FormStateParams) =>
  request.post<FormStateParams, ResponseBody<PageResult>>(`${Service.LOWCODE}/page/add`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

// 修改页面
export const updatePage = (params: updataParams) =>
  request.post<updataParams, ResponseBody<PageResult>>(`${Service.LOWCODE}/page/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

// 根据id查询页面信息
export interface PageManagerResult {
  applicationId: string;
  createBy: string;
  createDate: string;
  enableStatus: string;
  erGraph: string;
  groupId: string;
  language: string;
  lastUpdateBy: string;
  lastUpdateDate: string;
  lastUpdateLogin: string;
  pageCode: string;
  pageDesc: string;
  pageIcon: string;
  pageId: string;
  pageName: string;
  pageType: number;
  releaseStatus: string;
  sort: number;
  tableRelations: {
    mainTableId: string;
    subTableId: string;
    deleteMode: string;
    columnRelations: {
      mainTableColumnId: string;
      subTableColumnId: string;
    }[];
  }[];
  templateId: string;
}
export const getPageById = (params: GetPageByIdParams) =>
  request.post<GetPageByIdParams, ResponseBody<PageManagerResult>>(
    `${Service.LOWCODE}/page/findByPageId`,
    params,
  );
// 根据id删除页面
export const deletePageById = (pageId: string) =>
  request.post<string, ResponseBody<PageResult>>(`${Service.LOWCODE}/page/delete`, { pageId });

// 页面排序
export const pageResort = (params: string) =>
  request.post<string, ResponseBody<PageResult>>(`${Service.LOWCODE}/page/reSort`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

// 导入页面配置
export const importPage = (params: FormData) => {
  return request.post<FormData, ResponseBody>(`${Service.LOWCODE}/page/import`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
