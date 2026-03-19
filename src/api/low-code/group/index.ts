import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';
export interface GroupOperation {
  applicationId: string;
  groupId?: string;
  groupName: string;
  status: string;
}

// 根据分组名称查询所有分组
export interface FindByGroupNameParams {
  applicationId: string;
  groupName?: string;
}
export interface FindByGroupNameResult {
  createBy: number;
  groupName: string;
  lastUpdateDate: string;
  groupId: string;
  lastUpdateLogin: string;
  language: string;
  createDate: string;
  lastUpdateBy: string;
  status: string;

  operation?: boolean; // 用于分组右键展示弹窗
}
export const findByGroupName = (params: FindByGroupNameParams) =>
  request.post<FindByGroupNameParams, ResponseBody<FindByGroupNameResult[]>>(
    `${Service.LOWCODE}/group/findByGroupName`,
    params,
  );

// 新增分组
export const addGroup = (params: GroupOperation) =>
  request.post<GroupOperation, ResponseBody>(`${Service.LOWCODE}/group/add`, params);

// 根据分组id查询分组信息
export const findByGroupId = (groupId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/group/findByGroupId`, { groupId });

// 修改分组
export const updateGroup = (params: GroupOperation) =>
  request.post<GroupOperation, ResponseBody>(`${Service.LOWCODE}/group/update`, params);

// 删除分组
export const deleteGroup = (groupId: string) =>
  request.post<string, ResponseBody>(`${Service.LOWCODE}/group/delete`, { groupId });

// 拖拽排序
export interface DragGroupParams {
  groupId: string;
}
export const dragSort = (params: DragGroupParams[]) =>
  request.put<DragGroupParams[], ResponseBody>(`${Service.LOWCODE}/group/resort`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
