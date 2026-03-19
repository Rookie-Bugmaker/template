import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';
import type { PageManagerResult } from '../pages/index';
import type { ApplicationItem } from '../application/index';
import type { FindByGroupNameResult } from '../group/index';

export interface ConfigOperation {
  pageId: string;
  configJson: string;
  generateJson: string;
}

export interface GetPageInfoParams {
  pageId: string;
}

export interface PageDeatil extends PageManagerResult {
  application: ApplicationItem;
  group: FindByGroupNameResult;
}

// 获取配置信息
export const getConfig = (pageId: string) =>
  request.post<GetPageInfoParams, ResponseBody<ConfigOperation>>(
    `${Service.LOWCODE}/page/config/findByPageId`,
    {
      pageId,
    },
  );

// 保存配置信息
export const saveConfig = (params: ConfigOperation) =>
  request.post<ConfigOperation, ResponseBody>(`${Service.LOWCODE}/page/config/save`, params);

// 获取页面信息
export const getPageDetail = (pageId: string) =>
  request.post<GetPageInfoParams, ResponseBody<PageDeatil>>(`${Service.LOWCODE}/page/findDetails`, {
    pageId,
  });

// 发布页面
export const releasePage = (pageId: string) =>
  request.post<{ pageId: string }, ResponseBody>(`${Service.LOWCODE}/page/config/release`, {
    pageId,
  });

// 根据表结构ID和视图ID查询详情
export const getObjectByTableIdsAndViewIds = (objectIds: string) =>
  request.post<{ objectIds: string }, ResponseBody>(
    `${Service.LOWCODE}/table/getObjectByTableIdsAndViewIds`,
    {
      objectIds,
    },
  );
