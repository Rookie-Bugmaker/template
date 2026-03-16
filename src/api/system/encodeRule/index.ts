import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export type ValueSetStatus = 'Y' | 'N';
export type ValueSetRoot = 'Y' | 'N';

//ValueSet信息
export interface EncodeRuleItem {
  encodeRuleId: string;
  lastUpdateDate: string;
  lastUpdateLogin: string | null;
  startStatus: number;
  language: string;
  ruleCode: string;
  createBy: string;
  connector: string;
  lastCreateCode: string | null;
  encodeType: number;
  ruleExplain: string;
  releaseStatus: number;
  ruleDes: string;
  createDate: string;
  lastUpdateBy: string;
}

export interface ruleItem {
  serialNumber: number;
  encodeRuleId: string;
  lastUpdateDate: string | null;
  lastUpdateLogin: string | null;
  length: number;
  format: number;
  language: string;
  useStatus: number;
  ruleCode: string;
  createBy: string;
  flowGroup: number;
  ruleComposition: number;
  complementCharacter: string;
  step: number;
  startValue: string;
  describe: string;
  ruleId: string;
  currentValue: string;
  createDate: string;
  lastUpdateBy: string | null;

  key?: string;
}

export interface RuleOptionParams {
  encodeRuleId?: string;
  ruleId: string;
  serialNumber: number;
  useStatus: number;
  length: number;
  startValue: string;
  currentValue: string;
  format: number;
  step: number;
  flowGroup: number;
  ruleComposition: number;
  complementCharacter: string;
  describe: string;

  key?: string;
}

export interface ValueSetParams {
  page: number;
  pageSize: number;
  vsCode: string;
  vsName: string;
  vsDesc: string;
}

// EncodeRule操作
export interface EncodeRuleOperationParams {
  encodeRuleId: string;
  ruleCode: string;
  ruleDes: string;
  encodeType: number;
  startStatus: number;
  ruleExplain: string;
  connector: string;
  releaseStatus: number;
}

export interface FindByParentLineIdParams {
  parentLineId: string;
}

// 分页查询主表信息
export async function findecodeRuleByPage(params: ValueSetParams) {
  return request.post<ValueSetParams, ResponseBody<PageResult<EncodeRuleItem>>>(
    `${Service.SYS}/encode/rule/findByPage`,
    params,
  );
}

// 添加主表信息
export async function addEncodeRule(params: EncodeRuleOperationParams) {
  return request.post<EncodeRuleOperationParams, ResponseBody>(
    `${Service.SYS}/encode/rule/add`,
    params,
  );
}

// 更新主表信息
export async function updateEncodeRule(params: EncodeRuleOperationParams) {
  return request.post<EncodeRuleOperationParams, ResponseBody>(
    `${Service.SYS}/encode/rule/update`,
    params,
  );
}

// 删除主表信息
export async function deleteEncodeRule(encodeRuleId: string) {
  return request.post<{ encodeRuleId: string }, ResponseBody>(`${Service.SYS}/encode/rule/delete`, {
    encodeRuleId,
  });
}

// 根据encodeRuleId查询主表信息
export async function findEncodeRuleById(encodeRuleId: string) {
  return request.post<{ encodeRuleId: string }, ResponseBody<EncodeRuleItem>>(
    `${Service.SYS}/encode/rule/findByEncodeRuleId`,
    { encodeRuleId },
  );
}

// 根据encodeRuleId查询编码规则行数据
export async function findByEncodeRuleId(encodeRuleId: string) {
  return request.post<{ encodeRuleId: string }, ResponseBody<ruleItem[]>>(
    `${Service.SYS}/encode/rule/line/findByEncodeRuleId`,
    { encodeRuleId },
  );
}

// 新增编码规则行数据
export async function addRule(params: RuleOptionParams) {
  return request.post<RuleOptionParams, ResponseBody>(
    `${Service.SYS}/encode/rule/line/add`,
    params,
  );
}

// 修改编码规则行数据
export async function updateRule(params: RuleOptionParams) {
  return request.post<RuleOptionParams, ResponseBody>(
    `${Service.SYS}/encode/rule/line/update`,
    params,
  );
}

// 删除编码规则行数据
export async function deleteRule(ruleId: string) {
  return request.post<string, ResponseBody>(`${Service.SYS}/encode/rule/line/delete`, { ruleId });
}

// 按编码规则生成编码
export async function createEncode(ruleCode: string) {
  return request.post<string, ResponseBody>(`${Service.SYS}/encode/rule/createEncode`, {
    ruleCode,
  });
}
