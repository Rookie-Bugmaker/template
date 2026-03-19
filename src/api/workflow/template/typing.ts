/**
 * 是否启用 1是 0否
 */
export enum StatusType {
  Y = 'Y',
  N = 'N',
}

/**
 * 是否启用 1是 0否
 */
export enum EnableType {
  Yes = 1,
  No = 0,
}

/**
 * 是否禁用 1是 0否
 */
export enum DisableType {
  Yes = 1,
  No = 0,
}

/**
 * 当前节点类型   0 提交 ， 1 审批，  2 条件， 3 路由 ，4 抄送， 5 办理 ， 6 结束
 */
export enum NodeType {
  Submit = 0,
  Approval = 1,
  Condition = 2,
  Route = 3,
  Cc = 4,
  Handle = 5,
  End = 6,
}

/**
 * 图标类型  1 系统 2 自定义
 */
export enum IconType {
  System = 1,
  Custom = 2,
}

/**
 * 谁能提交此模板  1 全员   2 指定人员 3 均不可提交
 */
export enum SubmitUserType {
  All = 1,
  Designated = 2,
  None = 3,
}

/**
 * 审批人类型 1 审批人列表， 2 指定成员 3 提交人自选 4提交人本人 5上一节点人自选 6表单内字段
 */
export enum ApprovalUserType {
  UserList = 1,
  Designated = 2,
  SubmitOptional = 3,
  Self = 4,
  NodeOptional = 5,
  formData = 6,
}

/**
 * 审批人自选类型 1单选 2多选
 */
export enum ApprovalOptionalType {
  Single = 1,
  Multiple = 2,
}

/**
 * 审批人自选范围 1全部人员 2指定人员 3审批人列表
 */
export enum ApprovalOptionalRange {
  All = 1,
  Designated = 2,
  UserList = 3,
}

/**
 * 多人审批时审批方式 1会签countersign 2或签orSignature
 */
export enum MultiUserApprovalType {
  Countersign = 1,
  OrSignature = 2,
}

/**
 * 审批人为空时 1通知管理员并报错 2仅报错
 */
export enum WhenApproverIsNullType {
  NotifyAdministratorAndReportErrors = 1,
  OnlyReportErrors = 2,
}

/**
 * 审批人和提交人为同一人时 1由提交人自审批 2自动通过
 */
export enum WhenSameApproverAndSubmitterType {
  SelfApproval = 1,
  AutoPass = 2,
}

/**
 * 抄送人设置  0 不设置（提交人节点才会有）  1 抄送人列表 2 指定成员 3 提交人自选 4 提交人本人 5 上一节点人自选
 */
export enum CcUserType {
  NotSet = 0,
  UserList = 1,
  Designated = 2,
  SubmitOptional = 3,
  Self = 4,
  NodeOptional = 5,
}

/**
 * 抄送人由用户自选范围 1全部人员 2指定人员
 */
export enum CcOptionalRange {
  All = 1,
  Designated = 2,
}

/**
 * 条件关系类型
 */
export enum LogicType {
  OR = 'or',
  AND = 'and',
}

/**
 * 条件表达式类型
 * 
    'eq' //(equal to)
    
    'neq' //(not equal to)

    'isnull' //(is equal to null)

    'isnotnull' //(is not equal to null)

    'lt' //(less than)

    'lte' //(less than or equal to)

    'gt' //(greater than)

    'gte' //(greater than or equal to)

    'startswith'

    'doesnotstartwith'

    'endswith'

    'doesnotendwith'

    'contains'

    'doesnotcontain'

    'isempty'

    'isnotempty'
 */
export enum ExpressionType {
  eq = 'eq', //(equal to)
  neq = 'neq', //(not equal to)
  isnull = 'isnull', //(is equal to null)
  isnotnull = 'isnotnull', //(is not equal to null)
  lt = 'lt', //(less than)
  lte = 'lte', //(less than or equal to)
  gt = 'gt', //(greater than)
  gte = 'gte', //(greater than or equal to)
  startswith = 'startswith',
  doesnotstartwith = 'doesnotstartwith',
  endswith = 'endswith',
  doesnotendwith = 'doesnotendwith',
  contains = 'contains',
  doesnotcontain = 'doesnotcontain',
  isempty = 'isempty',
  isnotempty = 'isnotempty',
}

/**
 * 基础设置
 */
export interface BaseConfig {
  templateId?: string; //模板ID
  disableFlag: DisableType; // 是否禁用 1 是  0 否
  groupSort: number; //组内排序
  iconType: IconType; //图标类型  1 系统 2 自定义
  icon: string; //设置流程图标
  templateName: string; //模板名称
  templateDesc: string; //模板描述
  functionId: string; //绑定功能id
  mobileFunctionId: string; //绑定功能id
  groupId: string; //设置分组id
  submitUserType: SubmitUserType; //谁能提交此模板  1 全员  2 指定人员 3 均不可提交
  submitUserIds: string[]; //当submitUserType类型为 2 时传入
  processAdmin: string[]; //流程管理员 ，指定为当前登录用户id
  templateAlias: string; //模板别名（编码，用于提交工作流的唯一标识）

  templateVersion: number; //模板版本
  enableVersionFlag: StatusType; //是否为启用的版本
  releaseFlag: StatusType; //是否发布标识
  enableVersion?: number; //当前启用的版本号
  releaseUserId?: string; //发布用户id
  releaseUserName?: string; //发布用户名称
}

/**
 * 更多设置
 */
export interface ExtensionConfig {
  handleTime: number; //节点处理时长，单位小时
  withoutEfficiencyStatistics: EnableType; // 该流程是否计入效率统计 1 是  0 否
  forwardRelevant: EnableType; //仅可以转交给审批相关人员 1 是  0 否
  quickRemind: EnableType; //是否开启秒批提醒 1是 0 否
  //消息配置
  messageConfig: {
    prefixEnabled: EnableType; //是否启用自定义消息模板前缀 1是 0 否
    prefixTemplate: string; //消息模板
    suffixEnabled: EnableType; //是否启用自定义消息模板后缀 1是 0 否
    suffixTemplate: string;
    //提交人
    //${submitUser.userName}  用户名
    //${submitUser.personName}  人员姓名（为空的话取用户描述）
    //${submitUser.deptName} 部门名称
    //${submitUser.orgCode}  组织编码
    //${submitUser.orgName}  组织名称

    //${formData.xxxx}  提交的表单的字段
  };
}

/**
 * 操作权限
 */
export interface OperationAuthority {
  allowTransfer: EnableType; //允许转交 1是 0 否
  allowApostille?: EnableType; //允许加签 1是 0 否
  allowRollBack?: EnableType; //允许回退 1是 0 否
  requiredComments: EnableType; //要求填写审批意见 1是 0 否
  allowSendBack?: EnableType; //允许退回（退回到发起人） 1是 0 否
  allowRefuse: EnableType; //允许拒绝（终止流程） 1是 0 否
  allowUploadAttachment: EnableType; //允许上传附件 1是 0 否

  requireUploadAttachment?: EnableType; //要求上传附件 1是 0 否
  attachmentAccept?: string; //上传文件类型限制
}

/**
 * 审批设置（审批人设置）
 */
export interface ApprovalSettings {
  userType: ApprovalUserType; //1 审批人列表， 2 指定成员 ，3 提交人自选，4提交人本人 5上一节点人自选 6表单内字段
  approvalUserListCode: string; //审批人列表Code
  specificUserIds: string[]; // 指定用户ID
  optionalType: ApprovalOptionalType; //自选类型 1单选 2多选
  optionalRange: ApprovalOptionalRange; //自选范围 1全部人员 2指定人员 3审批人列表
  optionalSpecificUserIds: string[]; // 自选指定用户ID
  optionalApprovalUserListCode: string; //自选审批人列表Code
  optionUncertain: EnableType; //多选时，选择审批人的数量是否不定（可以为1~n） 1是 0 否
  multiUserApprovalType: MultiUserApprovalType; //多人审批时审批方式 1会签countersign 2或签orSignature
  whenApproverIsNull: WhenApproverIsNullType; //审批人为空时 1通知管理员并报错 2仅报错
  whenSameApproverAndSubmitter: WhenSameApproverAndSubmitterType; //审批人和提交人为同一人时 1由提交人自审批 2自动通过
  formDataField: string; //表单内字段key值
}

/**
 * 抄送设置
 */
export interface CcSettings {
  userType: CcUserType; //抄送人设置   1 抄送人列表 2 指定成员 3 提交人自选 4 提交人本人
  ccUserListCode: string; //抄送人列表Code
  userIds: string[]; //抄送人列表
  optionalRange: CcOptionalRange; //自选范围 1全部人员 2指定人员
  optionalSpecificUserIds: string[]; // 自选指定用户ID
}

/**
 * 结束设置
 */
export interface EndSettings {
  ccNodeIds: string[]; //结束时抄送（提示）节点id
}

/**
 * 条件设置
 */
export interface Condition {
  logic: LogicType | null; //组内与下一个条件的关系  and or, 如果是null说明是实际条件值节点
  conditionName?: string;
  expression?: ExpressionType;
  conditionValue?: string | number;
  conditions: Condition[];
}

/**
 * 条件组
 */
export interface ConditionGroup extends Condition {
  logic: LogicType;
  conditions: (ConditionGroup | ConditionExpression)[];
}

/**
 * 条件表达式
 */
export interface ConditionExpression extends Condition {
  logic: null;
  conditionName: string;
  expression: ExpressionType;
  conditionValue: string | number;
  conditions: [];
}

export interface ToNodeConfigBranchItem {
  uid: string; //前端标识id
  targetNodeId: string; //目标节点id(要跳到哪个节点去)
  conditionGroup: ConditionGroup; //条件组（跟条件分支的条件组一样的结构逻辑）
}

/**
 * 跳转节点设置
 */
export interface ToNodeConfig {
  //是否启用控制 1是 0 否
  enabled: EnableType;
  //条件分支，if ,else if的判断逻辑，如果不满足则去判断下一个条件，如果所有条件都不满足，则按原始退回逻辑走
  branchs: ToNodeConfigBranchItem[];
}

/**
 * 指定跳转节点设置
 */
export interface ToNodeSettings {
  //退回-条件节点控制
  sendBackConfig: ToNodeConfig;
  //同意-条件节点控制
  doneConfig: ToNodeConfig;
}

/**
 * 流程节点设置
 */
export interface NodeConfig {
  nodeId: string;
  nodeType: NodeType; //当前节点类型   0 提交 ， 1 审批，  2 条件， 3 路由 ，4 抄送， 5 办理 ， 6 结束
  parentNodeId: string | null;
  nodeName?: string;
  nodeCode?: string;
  nodeDesc?: string;

  nodeWithoutEfficiencyStatistics?: EnableType; // 节点不计入效率统计 1 是  0 否

  formPermissions?: any[]; //预留

  dynamicApprovalForm?: string; //动态表单项

  operationAuthority?: OperationAuthority;

  approvalSettings?: ApprovalSettings;

  ccSettings?: CcSettings;

  endSettings?: EndSettings;

  priorityOrder?: number; //条件组优先级  1 为优先级最高

  conditionGroup?: ConditionGroup;

  toNodeSettings?: ToNodeSettings;

  childNode: NodeConfig | null;

  conditionNodes: NodeConfig[];
}

/**
 * 流程设置
 */
export interface WorkflowConfig {
  baseConfig: BaseConfig;
  extensionConfig: ExtensionConfig;
  processConfig: NodeConfig;
}

export enum NodeIcon {
  Submit = 'upload-outlined',
  Approval = 'user-outlined',
  // Condition
  Route = 'fork-outlined',
  Cc = 'send-outlined',
  Handle = 'highlight-outlined',
  End = 'poweroff-outlined',
}

export enum NodeColor {
  Submit = '#576a95',
  Approval = 'rgb(255, 148, 62)',
  // Condition
  Route = 'rgb(21, 188, 131)',
  Cc = 'rgb(50, 150, 250)',
  Handle = 'rgb(255, 148, 162)',
  End = '#ab7a7a',
}

//节点默认属性设置
export const NodeAttr = {
  [NodeType.Submit]: { icon: NodeIcon.Submit, color: NodeColor.Submit },
  [NodeType.Approval]: { icon: NodeIcon.Approval, color: NodeColor.Approval },
  [NodeType.Route]: { icon: NodeIcon.Route, color: NodeColor.Route },
  [NodeType.Cc]: { icon: NodeIcon.Cc, color: NodeColor.Cc },
  [NodeType.Handle]: { icon: NodeIcon.Handle, color: NodeColor.Handle },
  [NodeType.End]: { icon: NodeIcon.End, color: NodeColor.End },
};

//动态审批表单项控件类型
export enum DynamicApprovalFormItemWidgetType {
  Input = 'input',
  Textarea = 'textarea',
  Checkbox = 'checkbox',
}

//动态审批表单项控件类型列表
export const dynamicApprovalFormItemWidgetTypeList = [
  {
    value: DynamicApprovalFormItemWidgetType.Input,
    text: '单行文本框',
  },
  {
    value: DynamicApprovalFormItemWidgetType.Textarea,
    text: '多行文本框',
  },
  {
    value: DynamicApprovalFormItemWidgetType.Checkbox,
    text: '复选框',
  },
];

//字段控制类型 （是|否|函数）
export type WidgetControl = 'Y' | 'N' | 'Func';

//审批控件类型列表
export const widgetControlList: { value: WidgetControl; text: string }[] = [
  {
    value: 'Y',
    text: '是',
  },
  {
    value: 'N',
    text: '否',
  },
  {
    value: 'Func',
    text: '函数',
  },
];

//动态审批表单项
export interface DynamicApprovalFormItem {
  uid: string;
  type: DynamicApprovalFormItemWidgetType;
  label: string;
  readonly: WidgetControl;
  required: WidgetControl;
  hidden: WidgetControl;
  readonlyFunc?: string;
  requiredFunc?: string;
  hiddenFunc?: string;
  defaultValueType: 'string' | 'number'; //默认值类型
  defaultValue?: any; //默认值
  options?: any; //其他属性
}

//动态审批表单
export interface DynamicApprovalForm {
  enabled: boolean;
  items: DynamicApprovalFormItem[];
}
