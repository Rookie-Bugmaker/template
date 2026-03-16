import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 公司分页查询对象
 */
export interface CompanyPageQuery extends PageParams {
  /** 搜索关键字 */
  companyName?: string;
  undefined?: number;
}

/**
 * 系统日志分页VO
 */
export interface CompanyPageVO {
  /** 主键 */
  id: number;
  /** 公司名称 */
  companyName: string;
  /** 公司id */
  companyId: number;
  /** 状态 */
  status: string;
  /** 备注 */
  remark: string;
  /** 组织编码 */
  orgCode: string;
}
export interface CompanyForm {
  /** 主键 */
  id: number;
  /** 公司名称 */
  companyName: string;
  /** 公司id */
  companyId: number;
  /** 状态 */
  status: string;
  /** 备注 */
  remark: string;
  /** 组织编码 */
  orgCode: string;
}
/**
 * 获取公司分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: CompanyPageQuery) {
  return request.get<any, ResponseBody<PageResult<CompanyPageVO>>>(`${Service.SYS}/company/page`, {
    params: queryParams,
  });
}

/**
 * 获取公司简洁列表
 *
 * @param queryParams 查询参数
 */
export async function getSimple(queryParams: CompanyPageQuery) {
  return request.get<any, ResponseBody<CompanyPageVO[]>>(`${Service.SYS}/company/simple`, {
    params: queryParams,
  });
}

export async function getList() {
  return request.get<any, ResponseBody<CompanyPageVO[]>>(`${Service.SYS}/company/list`);
}

export async function getIdList(roleId: string) {
  return request.get<string, ResponseBody>(`${Service.SYS}/company/get`, {
    params: {
      id: roleId,
    },
  });
}
/**
 * 添加公司
 *
 * @param data 公司表单数据
 * @returns 请求结果
 */
export async function add(data: CompanyForm) {
  return request.post<CompanyForm, ResponseBody>(`${Service.SYS}/company/create`, data, {
    headers: {
      ...CONTENT_TYPE_APPLICATION_JSON,
    },
  });
}

/**
 * 修改公司
 *
 * @param id 公司ID
 * @param data 公司表单数据
 * @returns 请求结果
 */
export async function update(data: CompanyForm) {
  return request.post<CompanyForm, ResponseBody>(`${Service.SYS}/company/update`, data, {
    headers: {
      ...CONTENT_TYPE_APPLICATION_JSON,
    },
  });
}

/**
 * 删除公司
 *
 * @param id 公司ID
 * @returns 请求结果
 */
export async function deleteById(id: string) {
  return request.delete<string, ResponseBody>(`${Service.SYS}/company/delete`, {
    params: {
      id: id,
    },
  });
}
