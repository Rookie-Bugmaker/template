import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export interface ToDoItem {
  id: string;
  processInstanceId: string;
  bizId: string;
  bizCode: string;
  dueDate: string;
  templateId: string;
  templateName: string;
  functionId: string;
  claimTime: string;
  createTime: string;
  name: string;
  owner: string;
  taskDefinitionId: string;
  taskDefinitionKey: string;
  processDefinitionId: string;
  parentTaskId: string;
  assignee: string;
  taskLocalVariables: Record<string, any>;
  processVariables: Record<string, any>;
  caseVariables: Record<string, any>;
}

export async function getToDos(userId: string) {
  return request.get<string, ResponseBody<ToDoItem[]>>(
    `${Service.WORKFLOW}/processCtl/getToDos/${userId}`,
  );
}

export async function getCurrentUserToDos() {
  return request.get<string, ResponseBody<ToDoItem[]>>(
    `${Service.WORKFLOW}/processCtl/getCurrentUserToDos`,
  );
}
