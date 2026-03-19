import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export interface DataPageQuery extends PageParams {
  code?: string;
  name?: string;
}

export interface TestItem {
  id?: string;
  code: string;
  name: string;
  status: number; //(1创建、2审批中、3审批完成、4拒绝)
  wfCode: string;
  wfId?: string;
  processInstanceId?: string;
  createBy?: number; //创建人ID
  createDate?: string; //创建时间
  lastUpdateBy?: number; //最后修改人ID
  lastUpdateDate?: string; //最后修改时间
  lastUpdateLogin?: string;
}

export interface TestItemParams {
  id?: string;
  code: string;
  name: string;
  status: number; //(1创建、2审批中、3审批完成、4拒绝)
  wfCode: string;
  wfId?: string;
  processInstanceId?: string;
}

export async function getPage(params: DataPageQuery) {
  return request.post<DataPageQuery, ResponseBody<PageResult<TestItem>>>(
    `${Service.WORKFLOW}/test/page`,
    params,
  );
}

export async function getItem(id: string) {
  return request.get<string, ResponseBody<TestItem>>(`${Service.WORKFLOW}/test/findById`, {
    params: { id },
  });
}

export async function add(params: TestItemParams) {
  return request.post<TestItemParams, ResponseBody>(`${Service.WORKFLOW}/test/add`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function update(params: TestItemParams) {
  return request.put<TestItemParams, ResponseBody>(`${Service.WORKFLOW}/test/update`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function deleteById(id: string) {
  return request.delete<string, ResponseBody>(`${Service.WORKFLOW}/test/delete`, {
    data: [id],
  });
}
