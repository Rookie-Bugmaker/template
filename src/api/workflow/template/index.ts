import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';
import type { WorkflowConfig } from './typing';

export interface TemplateReSortParams {
  templateId: string;
  groupSort: number;
  groupId: string;
}

export async function getTemplate(templateId: string) {
  return request.get<string, ResponseBody>(`${Service.WORKFLOW}/approvalTemplate/${templateId}`);
}

export async function addTemplate(params: WorkflowConfig) {
  return request.post<WorkflowConfig, ResponseBody<string>>(
    `${Service.WORKFLOW}/approvalTemplate`,
    params,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

export async function updateTemplate(params: WorkflowConfig) {
  return request.put<WorkflowConfig, ResponseBody>(`${Service.WORKFLOW}/approvalTemplate`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function deleteTemplate(templateId: string) {
  return request.delete<string, ResponseBody>(`${Service.WORKFLOW}/approvalTemplate/${templateId}`);
}

export async function reSortTemplate(reSortTemplateList: TemplateReSortParams[]) {
  return request.put<TemplateReSortParams[], ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/reSort`,
    reSortTemplateList,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

export async function disableTemplate(templateId: string) {
  return request.put<string, ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/disable/${templateId}`,
  );
}

export async function copyTemplate(templateId: string) {
  return request.post<string, ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/copy/${templateId}`,
  );
}

export async function publishTemplate(templateId: string) {
  return request.post<string, ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/publish/${templateId}`,
  );
}

export async function getTemplateVersionList(templateAlias: string) {
  return request.get<string, ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/findByTemplateAlias`,
    { params: { templateAlias } },
  );
}

export async function findUnfinishInstances(templateId: string) {
  return request.get<string, ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/findUnfinishInstances/${templateId}`,
  );
}

export async function createNewTemplateVersion(templateId: string) {
  return request.post<string, ResponseBody<string>>(
    `${Service.WORKFLOW}/approvalTemplate/createNewVersion/${templateId}`,
  );
}

export async function switchTemplateEnableVersion(templateId: string) {
  return request.post<string, ResponseBody>(
    `${Service.WORKFLOW}/approvalTemplate/switchVersion/${templateId}`,
  );
}
