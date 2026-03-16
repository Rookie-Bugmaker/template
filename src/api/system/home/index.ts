import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service, type BaseItem } from '@/api/typing';

export interface PageComponentItem extends BaseItem {
  componentId: string;
  functionCode: string;
  functionName: string;
  functionUrl: string;
  businessAreaId: string;
  businessAreaName: string;
  refreshRate: number;
  homePageTitle: string;
  loadingType: 1 | 2; //加载限制类型 1 用户类型 2 用户
  userType: string;
  remarks: string;
  showStatus: 'Y' | 'N';
  status: 'Y' | 'N';
}

export interface PageComponentOperationParams {
  componentId: string;
  functionCode?: string;
  functionName: string;
  functionUrl: string;
  businessAreaId: string;
  refreshRate: number;
  homePageTitle: string;
  loadingType: 1 | 2; //加载限制类型 1 用户类型 2 用户
  userType?: string;
  remarks?: string;
  showStatus: 'Y' | 'N';
  status: 'Y' | 'N';
}

export interface QueryByPageParams {
  page: number;
  pageSize: number;
  homePageTitle?: string;
  functionName?: string;
  businessAreaId?: string;
  status?: 'Y' | 'N';
}

export interface DistributionUserParams {
  componentId: string;
  userIds: string; //用户id 用逗号拼接
}

//当前用户自定义配置
export interface CurrentUserConfig extends BaseItem {
  userId: string;
  configId: string;
  userConfig: string;
}

//主页组件分页查询
export async function getPageComponentByPage(params: QueryByPageParams) {
  return request.post<QueryByPageParams, ResponseBody<PageResult<PageComponentItem>>>(
    `${Service.SYS}/homePage/component/pageList`,
    params,
  );
}

//添加更新主页组件
export async function addPageComponent(params: PageComponentOperationParams) {
  return request.post<PageComponentOperationParams, ResponseBody<string>>(
    `${Service.SYS}/homePage/component/add`,
    params,
  );
}

//更新主页组件
export async function updatePageComponent(params: PageComponentOperationParams) {
  return request.put<PageComponentOperationParams, ResponseBody>(
    `${Service.SYS}/homePage/component/updateById`,
    params,
  );
}

//删除主页组件
export async function deletePageComponent(pageComponentId: string) {
  return request.delete<string, ResponseBody>(
    `${Service.SYS}/homePage/component/${pageComponentId}`,
  );
}

//主页组件分配用户
export async function distributionUser(params: DistributionUserParams) {
  return request.post<DistributionUserParams, ResponseBody>(
    `${Service.SYS}/homePage/component/addUser`,
    params,
  );
}

//根据主页组件id查询已分配用户
export async function getUserByComponentId(pageComponentId: string) {
  return request.get<string, ResponseBody<string[]>>(
    `${Service.SYS}/homePage/component/findUserByComponentId?componentId=${pageComponentId}`,
  );
}

//保存用户自定义主页配置
export async function saveUserConfig(userConfig: string) {
  return request.post<{ userConfig: string }, ResponseBody>(
    `${Service.SYS}/homePage/userConfig/add`,
    {
      userConfig,
    },
  );
}

//查询当前用户自定义主页配置
export async function getUserConfig() {
  return request.get<null, ResponseBody<CurrentUserConfig>>(
    `${Service.SYS}/homePage/userConfig/currentUserConfig`,
  );
}

//查询当前用户拥有权限的组件列表
export async function getCurrentUserComponents() {
  return request.get<null, ResponseBody<PageComponentItem[]>>(
    `${Service.SYS}/homePage/component/findCurrentUserComponents`,
  );
}
