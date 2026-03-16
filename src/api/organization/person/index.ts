import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { BaseItem, PageResult, ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';
// import type { DeptItem } from '@/api/organization/department';
export interface PersonParams {
  page: number;
  pageSize: number;
  fullName?: string;
  jobNo?: string;
  status?: 1 | 2;
  montage?: 'and' | 'or';
}

export interface PersonItem extends BaseItem {
  email: string;
  fullName: string;
  gender: 'M' | 'F';
  inductionDate: string;
  jobNo: string;
  language: string;
  personId: string;
  personType: string;
  phone: string;
  quitDate: string;
  status: number;

  personName?: string;
  deptList?: any[];
}

export interface PersonOperationParams {
  personId: string;
  fullName: string;
  gender: 'M' | 'F';
  jobNo: string;
  personType: number;
  phone: string;
  email: string;
  status: number;
  inductionDate: string;
  quitDate: string;
}

export const findPersonByPage = (params: PersonParams) =>
  request.post<PersonParams, ResponseBody<PageResult<PersonItem>>>(
    `${Service.SYS}/org/person/findByPage`,
    params,
  );

export const findPersonByPageCp = (params: PersonParams) =>
  request.post<PersonParams, ResponseBody<PageResult<PersonItem>>>(
    `${Service.SYS}/org/person/findByPage/cp`,
    params,
  );

export const deletePerson = (personIds: string) =>
  request.post<string, ResponseBody>(`${Service.SYS}/org/person/delete`, { personIds });

export const addPerson = (params: PersonOperationParams) =>
  request.post<PersonOperationParams, ResponseBody>(`${Service.SYS}/org/person/add`, params);

export const updatePerson = (params: PersonOperationParams) =>
  request.post<PersonOperationParams, ResponseBody>(`${Service.SYS}/org/person/update`, params);

export const getPeronById = personId =>
  request.post<string, ResponseBody>(`${Service.SYS}/org/person/findById`, { personId });

export const findPersonByIds = (ids: string[]) =>
  request.post<string[], ResponseBody>(`${Service.SYS}/org/person/findByIds`, ids, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

export const getPeronByUserId = userId =>
  request.post<string, ResponseBody>(`${Service.SYS}/org/person/findByUserId`, { userId });

export const findPersonByCurrentUser = () =>
  request.post<string, ResponseBody<PersonItem>>(`${Service.SYS}/org/person/findByCurrentUser`);
