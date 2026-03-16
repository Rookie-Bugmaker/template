import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export type ProfileStatus = 'Y' | 'N';

//Profile信息
export interface ProfileItem {
  profileId: string;
  profileName: string;
  profileCode: string;
  profileSourceType: 'sql' | 'fixed';
  profileSource: string;
  profileValueColumn: string;
  profileCodeColumn: string;
  profileDescColumn: string;
  profileParentColumn: string;
  profileComponentType: 'popup' | 'input' | 'select';
  profileType: string;
  fieldAlias: string;
}

export interface ProfileParams {
  page: number;
  pageSize: number;
  profileCode?: string;
  profileName?: string;
  profileType?: string;
}

export async function findProfileByPage(params: ProfileParams) {
  return request.post<ProfileParams, ResponseBody<PageResult<ProfileItem>>>(
    `${Service.SYS}/profile/findByPage`,
    params,
  );
}

export async function addProfile(params: ProfileItem) {
  return request.post<ProfileItem, ResponseBody>(`${Service.SYS}/profile/add`, params);
}

export async function updateProfile(params: ProfileItem) {
  return request.post<ProfileItem, ResponseBody>(`${Service.SYS}/profile/update`, params);
}

export async function findProfileByRoleId(profileIds: string) {
  return request.post<ProfileItem, ResponseBody<ProfileItem[]>>(`${Service.SYS}/org/findById`, {
    profileIds,
  });
}

export async function deleteProfile(profileIds: string) {
  return request.post<string, ResponseBody>(`${Service.SYS}/profile/delete`, { profileIds });
}

//根据配置分类查询配置文件集合
export async function findByType(profileType: string) {
  return request.post<{ profileType: string }, ResponseBody<ProfileItem[]>>(
    `${Service.SYS}/profile/findByType`,
    { profileType },
  );
}

export interface ValueSetListQueryParams {
  profileId: string;
  fuzzyQuery?: string;
}

export interface ValueSetItem {
  id: string;
  code: string;
  desc: string;
  parentId: string;
}

//根据配置文件ID查询值集(不分页)
export async function getValueSetListAccordingToProfileId(params: ValueSetListQueryParams) {
  return request.post<ValueSetListQueryParams, ResponseBody<ValueSetItem[]>>(
    `${Service.SYS}/profile/getValueSetListAccordingToProfileId`,
    params,
  );
}

//根据配置文件编码查询固定值
export async function getFixedValue(profileCode: string) {
  return request.post<string, ResponseBody<string>>(`${Service.SYS}/profile/getFixedValue`, {
    profileCode,
  });
}
