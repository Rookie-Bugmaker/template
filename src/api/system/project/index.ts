import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 项目分页查询对象
 */
export interface ProjectPageQuery extends PageParams {
  /** 项目名称 */
  name: string;
  /** 项目中文名称 */
  nameCn: number;
  /** 状态 */
  status: string;
}
export interface ProjectUserPageQuery extends PageParams {
  /** 名称 */
  userName: string;
  /** 昵称 */
  nickName: string;
  /** id */
  projectId: number;
}

/**
 * 系统日志分页VO
 */
export interface ProjectPageVO {
  /** 主键 */
  id: number;
  /** 项目名称 */
  name: string;
  /** url */
  url: string;
  /** 项目中文名称 */
  nameCn: number;
  /** 状态 */
  status: string;
  /** 描述 */
  description: string;
}
export interface ProjectUserPageVO {
  userProjectId: number;
  /** 主键 */
  id: number;
  /** 项目名称 */
  userName: string;
  /** 昵称 */
  nickName: string;
}
export interface ProjectForm {
  /** 主键 */
  id: number;
  /** 项目名称 */
  name: string;
  /** 项目中文名称 */
  nameCn: string;
  /** url */
  url: string;
  /** 状态 */
  status: string;
  /** 描述 */
  description: string;
}
export interface ProjectUserForm {
  /** 主键 */
  projectId: number;
  /** 项目名称 */
  userIds: [];
}

/**
 * 获取项目分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: ProjectPageQuery) {
  return request.get<any, ResponseBody<PageResult<ProjectPageVO>>>(`${Service.SYS}/project/page`, {
    params: queryParams,
  });
}

/**
 * 获取服务列表list
 *
 * @param queryParams 查询参数
 */
export async function getList() {
  return request.get<any, ResponseBody<ProjectPageVO[]>>(`${Service.SYS}/project/list`);
}

/**
 * 获取当前用户拥有的服务列表list
 *
 * @param queryParams 查询参数
 */
export async function getCurrentUserProjectList() {
  return request.get<any, ResponseBody<ProjectPageVO[]>>(
    `${Service.SYS}/project/listByCurrentUser`,
  );
}

/**
 * 添加项目
 *
 * @param data 项目表单数据
 * @returns 请求结果
 */
export async function add(data: ProjectForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/project/create`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 修改项目
 *
 * @param id 项目ID
 * @param data 项目表单数据
 * @returns 请求结果
 */
export async function update(data: ProjectForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/project/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 删除项目
 *
 * @param id 项目ID
 * @returns 请求结果
 */
export async function deleteById(id: number) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/project/delete`, {
    params: {
      id,
    },
  });
}

export async function getListById(id: number) {
  return request.get<any, ResponseBody>(`${Service.SYS}/project/get`, {
    params: {
      id,
    },
  });
}
/**
 * 通过项目id查询用户列表
 *
 * @param queryParams 查询参数
 */
export async function get_project_users(queryParams: ProjectUserPageQuery) {
  return request.get<any, ResponseBody<PageResult<ProjectUserPageVO>>>(
    `${Service.SYS}/project/get_project_users`,
    {
      params: queryParams,
    },
  );
}
/**
 * 关联项目用户
 *
 * @param data 项目表单数据
 * @returns 请求结果
 */
export async function set_project_users(projectId: number, serviceIds: number[]) {
  return request.post<any, ResponseBody>(
    `${Service.SYS}/project/set_project_users`,
    {
      projectId: projectId,
      userIds: serviceIds,
    },
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}
/**
 * 设置项目服务关联
 *
 * @param data 表单数据
 */
export async function set_project_service(data: any) {
  return request.post<any, ResponseBody>(`${Service.SYS}/project/set_project_service`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
/**
 * 删除项目对应用户
 *
 * @param id 项目ID
 * @returns 请求结果
 */
export async function delete_prject_user(ids: string) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/project/delete_prject_user`, {
    params: {
      ids,
    },
  });
}
