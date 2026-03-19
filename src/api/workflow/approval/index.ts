import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export interface QueryApprovalDataParams {
  page: number;
  pageSize: number;
  templateId?: string; //审批模板id
  processStatus?: string; //流程状态 0 未开始 1 进行中 2  已完成 3 已终止
  submitterId?: string; //提交人
  currentUserId?: string; //当前审批人
  submitStartTime?: string; //提交时间从
  submitEndTime?: string; //提交时间至
  completeStartTime?: string; //完成开始从
  completeEndTime?: string; //完成开始至
  bizCode?: string; //业务单据编码
}
export interface ApprovalDataItem {
  processInstanceId: string;
  currentUserNames: string;
  submitTime: string;
  currentUserIds: string;
  processStatus: string; //流程状态 0 未开始 1 进行中 2  已完成 3 已终止
  templateName: string; //审批模板名称
  bizCode: string;
  submitterId: string;
  completeTime: string;
  submitterName: string;
  templateId: string;
  functionId: string;
}

export interface QueryApprovalDetailParams {
  page?: number;
  pageSize?: number;
  templateName?: string;
  templateId?: string;
  submitTimeRange: number;
  submitMonth: string;
}
export interface ApprovalDetailItem {
  totalSubmitNum: number;
  templateName: string; //审批模板名称
  overFortyEightHours: number;
  approvalCompleteRate: string;
  overThirtyDays: number;
  overSevenDays: number;
  averageCostTime: string;
  totalToDoNum: number;
}

export interface ApprovalTaskItem {
  processInstanceId: string;
  submitTime: string;
  processStatus: number; //流程状态 0 未开始 1 进行中 2  已完成 3 已终止
  templateName: string; //审批模板名称
  bizCode: string;
  submitterId: string;
  currentNodeName: string;
  userNameAndDeptName: string;
  submitterName: string;
  templateId: string;
}

// 审批数据查询
export async function findApprovalData(params: QueryApprovalDataParams) {
  return request.post<QueryApprovalDataParams, ResponseBody<PageResult<ApprovalDataItem>>>(
    `${Service.WORKFLOW}/approvalReport/approvalDataReport`,
    params,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
// 审批明细报表
export async function findApprovalDetail(params: QueryApprovalDetailParams) {
  return request.post<QueryApprovalDetailParams, ResponseBody<PageResult<ApprovalDetailItem>>>(
    `${Service.WORKFLOW}/approvalReport/approvalDetailReport`,
    params,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
// 任务明细报表
export async function findApprovalTask(params: QueryApprovalDetailParams) {
  return request.post<QueryApprovalDetailParams, ResponseBody<PageResult<ApprovalTaskItem>>>(
    `${Service.WORKFLOW}/approvalReport/approvalTaskDetailReport`,
    params,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
// 审批名称查询
export async function findApprovalTemplate() {
  return request.get<null, ResponseBody>(`${Service.WORKFLOW}/approvalTemplate/allList`);
}
