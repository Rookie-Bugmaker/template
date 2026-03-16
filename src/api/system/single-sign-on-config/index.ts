import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { IBaseItem } from '@/api/typing';
import { Service } from '@/api/typing';

/**
 * 单点配置分页查询对象
 */
export interface ConfigPageQuery extends PageParams {
  /** 配置名称 */
  configName?: string;
  /** 配置编码 */
  configCode?: string;
  /** 单点类型(ESC) */
  configType?: string;
  /** 项目编码 */
  projectCode?: string;
}

/**
 * 单点配置分页VO
 */
export interface ConfigPageVO extends IBaseItem {
  id: string; //主键
  configName: string; //配置名称
  configCode: string; //配置编码
  configType: string; //单点类型(ESC)
  fileHeaderId: string; //文件头ID
  fileId: string; //文件头id下的第0个文件id
  clientId: string; //应用ID
  clientSecret: string; //应用密码
  authorizeRequestUrl: string; //请求登陆认证地址
  tokenRequestUrl: string; //code交换token地址
  userRequestUrl: string; //token交换用户地址
  redirectUrl: string; //回调地址
  projectId: number; //项目id
  projectName: string; //项目名称
}
export interface ConfigForm {
  id: string; //主键
  configName: string; //配置名称
  configCode: string; //配置编码
  configType: string; //单点类型(ESC)
  fileHeaderId: string; //文件头ID
  clientId: string; //应用ID
  clientSecret: string; //应用密码
  authorizeRequestUrl: string; //请求登陆认证地址
  tokenRequestUrl: string; //code交换token地址
  userRequestUrl: string; //token交换用户地址
  redirectUrl: string; //回调地址
  projectId: number; //项目id
}

/**
 * 获取单点配置分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: ConfigPageQuery) {
  return request.post<any, ResponseBody<PageResult<ConfigPageVO>>>(
    `${Service.SYS}/sso/config/page`,
    queryParams,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

/**
 * 获取单点配置表单数据
 *
 * @param id 主键
 * @returns 单点配置表单数据
 */
export async function getById(id: string) {
  return request.get<any, ResponseBody<ConfigPageVO>>(`${Service.SYS}/sso/config/findById`, {
    params: { id },
  });
}

/**
 * 添加单点配置
 *
 * @param data 单点配置表单数据
 * @returns 请求结果
 */
export async function add(data: ConfigForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/sso/config/add`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 修改单点配置
 *
 * @param id 单点配置ID
 * @param data 单点配置表单数据
 * @returns 请求结果
 */
export async function update(data: ConfigForm) {
  return request.put<any, ResponseBody>(`${Service.SYS}/sso/config/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 删除单点配置
 *
 * @param id 单点配置ID
 * @returns 请求结果
 */
export async function deleteById(ids: string[]) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/sso/config/delete`, {
    data: ids,
  });
}
