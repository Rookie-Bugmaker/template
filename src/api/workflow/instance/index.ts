import type { NodeType } from './../template/typing';
import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

/**
 * 整个流程的状态 0：未开始（待提交），1：进行中，2：已结束，3：已终止（中途拒绝,状态是终止）,4:已重置
 */
export enum ProcessStatus {
  NotStarted = 0,
  InProgress = 1,
  Closed = 2,
  Terminated = 3,
  Reset = 4,
}

/**
 * 节点状态 0：未开始，1：进行中，2：已完成，3：已拒绝
 */
export enum NodeStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  Rejected = 3,
}
/**
 * 审批类型，1：单人审批，2：多人会签，3：多人或签
 */
export enum ApprovalType {
  Single = 1,
  Countersign = 2,
  OrSignature = 3,
}

/**
 * 操作权限 1：同意，2：拒绝，3驳回，4：转交，5：加签, 7:退回
 */
export enum OperationAuthority {
  Done = 1,
  Refuse = 2,
  Reject = 3,
  Deliver = 4,
  PlusSign = 5,
  SendBack = 7,
}

/**
 * 审批状态 0:待审核（未审批），1：已通过 ，2：已拒绝，3:已驳回，4:已转交,5:未处理（原会/或签成员中，有其他成员驳回了，剩余成员显示未处理）,6：已加签,7:已抄送,8:已终止(管理员终止流程),9:已退回(直接驳回到发人)
 */
export enum ApprovalStatus {
  PendingApproval = 0,
  Passed = 1,
  Rejected = 2,
  Dismissed = 3,
  Forwarded = 4,
  Unhandled = 5,
  PlusSigned = 6,
  Cc = 7,
  Termination = 8,
  SendBack = 9,
}

/**
 * 选择范围 1:全部用户，2：指定用户，3：根据列表
 */
export enum Range {
  All = 1,
  Designated = 2,
  UserList = 3,
}

/**
 * 流程实例数据
 */
export interface InstanceData {
  bizId: string; //业务id
  bizCode: string; //业务编码（业务表里面的单据号字段值，提交时会传参给后端）
  processName: string; //流程名称（模板名：templateName）
  processStatus: ProcessStatus; //整个流程的状态 0：未开始（待提交），1：进行中，2：已结束，3：已终止（中途拒绝,状态是终止）
  processStartTime: string; //流程开始时间(年月日时分秒)
  processEndTime: string; //流程结束时间(年月日时分秒)（终止也算结束）
  isCurrentUser: boolean; //当前进行的流程是否有操作权限
  editPermissions: EditPermissions; //流程关联表单的编辑权限（处理人节点的编辑权限）

  sequenceGraph: SequenceGraphItem[];

  //历史审批数据（被拒绝或终止的审批实例数据）
  hisRunningInfoList?: InstanceData[];

  templateId: string; //模板id
  templateVersion: number; //模板版本
}

/**
 * 业务表单编辑权限
 */
export interface EditPermissions {
  enable: boolean; //true为有编辑权限
}

/**
 * 节点数据
 */
export interface SequenceGraphItem {
  nodeId: string; //节点ID，同模板配置
  nodeType: NodeType; //节点类型，同模板配置
  nodeName: string; //节点名称，同模板配置
  nodeCode: string; //节点编码，同模板配置
  nodeDesc: string; //节点描述，同模板配置
  nodeStatus: NodeStatus; //节点状态 0：未开始，1：进行中，2：已完成，3：已拒绝
  isCurrentNode: boolean; //是否是当前进行中的节点(流程未开始时，提交人节点isCurrentNode为true结束时，结束节点isCurrentNode为true;终止时，终止的节点isCurrentNode为true)
  startTime: string; //节点开始时间(年月日时分秒)
  endTime: string; //节点结束时间(年月日时分秒)
  processingTime: string; //处理时长，endTime-startTime
  overtimeFlag: boolean; //是否超时处理
  overTime: string; //超时时长
  approvalType: ApprovalType; //审批类型，1：单人审批，2：多人会签，3：多人或签

  operationAuthority: OperationAuthority[];
  requiredComment: boolean; //审批意见是否必填（拒绝的话必定是true）
  allowUploadAttachment: boolean; //是否允许上传附件

  requireUploadAttachment: boolean; //要求上传附件 1是 0 否
  attachmentAccept: string; //上传文件类型限制

  approvalRecords: ApprovalRecordItem[];
  selectedUsers: SelectedUserItem[];
  selectUser: SelectUser;

  dynamicApprovalForm: string; //动态审批表单配置
}

export interface ApprovalRecordItem {
  userId: string;
  userName: string; //用户名称，后期根据人员设置获取
  userAvatar: string; //用户头像，后期根据人员设置获取
  isPlusSignUser: boolean; //是否加签用户（标识不是原节点处理人）????
  isDeliveredUser: boolean; //是否被转交用户（标识不是原节点处理人）????
  approvalStatus: ApprovalStatus; //审批状态 0:待审核（未审批），1：已通过 ，2：已拒绝，3:已驳回，4:已转交
  comment: string;
  createTime: string; //到达时间(任务指派时间)
  handleTime: string; //处理时间
  attachmentId: string; //附件id

  children?: ApprovalRecordItem[]; //子审批项，用于分组展示
}

export interface SelectedUserItem {
  userId: string;
  userName: string; //用户名称，后期根据人员设置获取
  userAvatar: string; //用户头像，后期根据人员设置获取
}
export interface SelectUser {
  enable: boolean; //是否可以选择用户
  required: boolean; //用户是否必填
  //如果min==max,限定需要选择几个人
  min?: number; //最少需要选择几个用户，null则不控制（required：true下，min最小为1）
  max?: number; // 最多可以选择几个用户，null则不控制
  range: Range; //选择范围 1:全部用户，2：指定用户，3：根据列表
  rangeKeys?: string; //可选范围的keys，range 1的情况下是null,2是根据模板返回指定的用户ids，逗号隔开(例如：1,2,3)，3是返回列表id，后续提供统一接口查询
}

export interface StartProcessParams {
  templateId: string;
  bizId: string;
  bizCode: string;
  formData: {
    [key: string]: any;
  };
  taskData: {
    [key: string]: any;
  };
  currentTaskId: string;
  lowCodeFlag: boolean; //是否是低代码中使用的工作流
  objectId: string; //低代码工作流提交时需要带上对应功能的objectId
}

export interface GetSequenceGraphParams {
  // templateId: string;
  templateAlias: string;
  bizId: string;
  bizCode: string;
  formData: {
    [key: string]: any;
  };
}

export interface ProcessOperationParams {
  processInstanceId: string;
  userId?: string;
  userIds: [];
  comment?: string;
  extra?: {
    taskData?: {
      [key: string]: string[];
    }[];
    [key: string]: any;
  };
  dynamicApprovalFormValues?: string;
  attachmentId?: string;
}

export interface ProcessStatusItemUserListItem {
  userId: string;
  userName: string;
  userStatus: ApprovalStatus.PendingApproval | ApprovalStatus.Passed; //处理状态 1 待处理 2 已处理
}

export interface ProcessStatusItem {
  processInstanceId: string;
  nodeName: string;
  userList: ProcessStatusItemUserListItem[];
  processStatus: ProcessStatus;
  nodeAssigneeType: ApprovalType;
}

//提交审批
export async function startProcessInstance(params: StartProcessParams) {
  return request.post<StartProcessParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/startProcessInstance/_${params.templateId}`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//获取提交时的流程图
export async function getSequenceGraph(params: GetSequenceGraphParams) {
  return request.post<GetSequenceGraphParams, ResponseBody<InstanceData>>(
    `${Service.WORKFLOW}/processCtl/sequenceGraph`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//获取审批中的流程图
export async function getRunningSequenceGraph(processInstanceId: string) {
  return request.get<string, ResponseBody<InstanceData>>(
    `${Service.WORKFLOW}/processCtl/runningSequenceGraph/${processInstanceId}`,
  );
}

//获取审批单据的业务主键ID
export async function getBizInfo(processInstanceId: string) {
  return request.get<string, ResponseBody<string>>(
    `${Service.WORKFLOW}/processCtl/bizInfo/${processInstanceId}`,
  );
}

//审批同意
export async function processDone(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/done`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//审批转发
export async function processDeliver(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/deliver`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//审批驳回
export async function processReject(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/reject`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//审批拒绝
export async function processRefuse(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/refuse`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//审批退回（退回至发起人）
export async function processSendBack(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/rejectToPromoter`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//审批加签
export async function processPlusSign(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/addSign`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//加签完成任务
export async function processResolve(params: ProcessOperationParams) {
  return request.post<ProcessOperationParams, ResponseBody>(
    `${Service.WORKFLOW}/processCtl/resolve`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

//查看当前流程状态
export async function getProcessStatus(processInstanceIds: string) {
  return request.post<string, ResponseBody<ProcessStatusItem[]>>(
    `${Service.WORKFLOW}/processCtl/processStatus`,
    {
      processInstanceIds,
    },
  );
}

//终止流程
export async function shutdownProcess(processInstanceId: string) {
  return request.post<string, ResponseBody>(`${Service.WORKFLOW}/processCtl/shutdown`, {
    processInstanceId,
  });
}

//获取历史审批明细记录（被拒绝的单据，实例id会被重置，只能根据bizId和templateAlias找回对应的上次审批明细数据）
export async function getHistoryApprovalRecord(bizId: string, templateAlias: string) {
  return request.get<string, ResponseBody<InstanceData>>(
    `${Service.WORKFLOW}/processCtl/findSequenceGraphByBizId`,
    {
      params: { bizId, templateAlias },
    },
  );
}
