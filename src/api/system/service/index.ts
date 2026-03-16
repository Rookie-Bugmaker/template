import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 服务分页查询对象
 */
export interface ServiceQuery {
  /** 搜索关键字 */
  id?: string;
  name?: string;
  status?: string;
  nameCn?: string;
  sysName?: string;
  description?: string;
  sysService?: boolean;
}

/**
 * 服务分页VO
 */
export interface ServiceVO {
  /** 主键 */
  id: number;
  /** 名字 */
  name: string;
  /** 状态 */
  status: string;
  /** sysService */
  sysService: boolean;
}

/**
 * 获取服务分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: ServiceQuery) {
  return request.get<any, ResponseBody<PageResult<ServiceVO>>>(`${Service.SYS}/service/page`, {
    params: queryParams,
  });
}

/**
 * 获取服务分页列表list
 *
 * @param queryParams 查询参数
 */
export async function getList(id: string) {
  return request.get<any, ServiceVO[]>(`${Service.SYS}/service/list`, {
    params: { id },
  });
}
/**
 * 查询系统名称
 *
 *
 */
export async function getSystem() {
  return request.get<any, ResponseBody>(`${Service.SYS}/service/get_system`);
}
export async function update(data: any) {
  return request.post<any, ResponseBody>(`${Service.SYS}/service/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
/**
 * 删除服务
 *
 * @param id 服务ID
 * @returns 请求结果
 */
export async function deleteById(id: number) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/service/delete`, {
    params: {
      id,
    },
  });
}

/** 获取文档地址与端口*/
export async function getDocConfig() {
  return request.get<any, ResponseBody>(`${Service.SYS}/config/get`);
}
