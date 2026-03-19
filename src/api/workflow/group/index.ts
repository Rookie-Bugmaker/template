import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';
import type { WorkflowConfig } from '../template/typing';

export interface ApprovalGroupItem {
  groupId: string;
  groupName: string;
  sortNum: number;
  headerBgc: string;
  templateList: WorkflowConfig[];
  createBy?: number; //创建人ID
  createDate?: string; //创建时间
  lastUpdateBy?: number; //最后修改人ID
  lastUpdateDate?: string; //最后修改时间
  lastUpdateLogin?: string;
}

export interface ApprovalGroupQueryParams {
  templateName: string;
}

export interface ApprovalGroupOperationParams {
  groupId?: string;
  groupName: string;
  headerBgc: string;
}

export interface ApprovalGroupReSortParams {
  groupId: string;
  sortNum: number;
}

export async function findGroupList(templateName: string) {
  return request.get<ApprovalGroupQueryParams, ResponseBody<ApprovalGroupItem[]>>(
    `${Service.WORKFLOW}/approvalGroup/list`,
    {
      params: { templateName },
    },
  );
}

export async function addGroup(params: ApprovalGroupOperationParams) {
  return request.post<ApprovalGroupOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/approvalGroup`,
    params,
  );
}

export async function updateGroup(params: ApprovalGroupOperationParams) {
  return request.put<ApprovalGroupOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/approvalGroup`,
    params,
  );
}

export async function deleteGroup(groupId: string) {
  return request.delete<string, ResponseBody>(`${Service.WORKFLOW}/approvalGroup/${groupId}`);
}

export async function reSortGroup(reSortGroupList: ApprovalGroupReSortParams[]) {
  return request.put<ApprovalGroupReSortParams[], ResponseBody>(
    `${Service.WORKFLOW}/approvalGroup/reSort`,
    reSortGroupList,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}
