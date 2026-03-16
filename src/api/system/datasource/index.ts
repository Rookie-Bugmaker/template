import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 数据源分页查询对象
 */
export interface DataPageQuery extends PageParams {
  /** 搜索关键字 */
  username?: string;
}

/**
 * 数据源分页VO
 */
export interface DataSourcePageVO {
  /** 主键 */
  id: string;
  /** 数据源id */
  datasourceId: string;
  /** url */
  url: string;
  /** 用户名称 */
  username: number;
  /** 密码 */
  password: string;
  /** 数据库类型 */
  databaseType: string;
  /** 数据库驱动 */
  driverClassName: string;
  sysName: string;
  datasourceName: string;
}
export interface DataSourceForm {
  /** 主键 */
  id: string;
  /** 数据源id */
  datasourceId: string;
  /** url */
  url: string;
  /** 用户名称 */
  username: string;
  /** 密码 */
  password: string;
  /** 数据库类型 */
  databaseType: string;
  /** 数据库驱动 */
  driverClassName: string;
  sysName: string;
  datasourceName: string;
}

/**
 * 获取数据源分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: DataPageQuery) {
  return request.post<any, ResponseBody<PageResult<DataSourcePageVO>>>(
    `${Service.SYS}/datasource/page`,
    queryParams,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}
export async function getListById(id: any) {
  return request.get<any, ResponseBody>(`${Service.SYS}/datasource/get`, {
    params: {
      id,
    },
  });
}
/**
 * 添加数据源
 *
 * @param data 数据源表单数据
 * @returns 请求结果
 */
export async function add(data: DataSourceForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/datasource/create`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 修改数据源
 *
 * @param id 数据源ID
 * @param data 数据源表单数据
 * @returns 请求结果
 */
export async function update(data: DataSourceForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/datasource/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 删除数据源
 *
 * @param id 数据源ID
 * @returns 请求结果
 */
export async function deleteById(id: number) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/datasource/delete`, {
    params: {
      id,
    },
  });
}
