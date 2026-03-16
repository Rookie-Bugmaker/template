import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export interface memberParams extends PageParams {
  deptId?: string;
}

export interface memberItem {
  id?: string;
  personId: string;
  deptId: string;
  position: string;
  parentPersonId: string;
}

export interface DepartmentOperationParams {
  id?: string;
  personId: string;
  deptId: string;
  position: string;
  parentPersonId: string;
  jobNo?: string;
  companyId?: string;
}

/* // 根据部门id分页查询公司/部门人员
export const getCompanyMemberById = (params: memberParams) =>
  request.post<memberParams, ResponseBody>(`${Service.SYS}/dept/person/findByPage`, params);

// 根据部门id查询直属上级列表
export const getSuperListByDeptId = (deptId: string) =>
  request.get<string, ResponseBody>(`${Service.SYS}/dept/person/findParentDp`, {
    params: {
      deptId,
    },
  }); */

// 根据部门id查询人员分页列表
export const getPage = (params: memberParams) =>
  request.get<string, ResponseBody>(
    `${Service.SYS}/dept/person/findPageByDeptId/${params.deptId}`,
    {
      params,
    },
  );

// 新增部门人员
export const add = (params: memberItem) =>
  request.post<memberItem, ResponseBody>(`${Service.SYS}/dept/person`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

// 根据部门人员id更新人员
export const update = (params: memberItem) =>
  request.put<memberItem, ResponseBody>(`${Service.SYS}/dept/person`, params, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });

// 根据id删除部门人员
export const remove = (ids: string[]) =>
  request.delete<string, ResponseBody>(`${Service.SYS}/dept/person`, {
    data: ids,
  });
