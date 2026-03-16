import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * Agent分页查询对象
 */
export interface AgentPageQuery extends PageParams {
  /** 名称(模糊查询) */
  agentName?: string;
  /** 编码(模糊查询) */
  agentCode?: string;
  /** 描述(模糊查询) */
  agentDesc?: string;
}

/**
 * Agent分页VO
 */
export interface AgentPageVO extends BaseEntity {
  /** 主键 */
  id: string;
  /** 名称 */
  agentName?: string;
  /** 编码 */
  agentCode?: string;
  /** 描述 */
  agentDesc?: string;
  /** baseUrl */
  baseUrl: string;
  /** apiKey */
  apiKey: string;
  /** 是否允许上传文件 */
  fileUpload: string;
  /** 文件头ID */
  fileHeaderId: string;
  /** 文件ID */
  fileId?: string;
}
export interface AgentForm {
  /** 主键 */
  id: string;
  /** 名称 */
  agentName?: string;
  /** 编码 */
  agentCode?: string;
  /** 描述 */
  agentDesc?: string;
  /** baseUrl */
  baseUrl: string;
  /** apiKey */
  apiKey: string;
  /** 文件头ID */
  fileHeaderId: string;
  /** 是否允许上传文件 */
  fileUpload: string;
}

/**
 * 获取Agent分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: AgentPageQuery) {
  return request.post<any, ResponseBody<PageResult<AgentPageVO>>>(
    `${Service.SYS}/agent/page`,
    queryParams,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

/**
 * 获取Agent对象
 *
 * @param id AgentID
 */
export async function getById(id: any) {
  return request.get<any, ResponseBody>(`${Service.SYS}/agent/findById`, {
    params: {
      id,
    },
  });
}
/**
 * 添加Agent
 *
 * @param data Agent表单数据
 * @returns 请求结果
 */
export async function add(data: AgentForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/agent/add`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 修改Agent
 *
 * @param id AgentID
 * @param data Agent表单数据
 * @returns 请求结果
 */
export async function update(data: AgentForm) {
  return request.put<any, ResponseBody>(`${Service.SYS}/agent/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 删除Agent
 *
 * @param id AgentID
 * @returns 请求结果
 */
export async function deleteById(ids: string[]) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/agent/delete`, {
    data: ids,
  });
}
