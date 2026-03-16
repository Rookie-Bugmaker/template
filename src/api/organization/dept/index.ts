import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/** 部门查询参数 */
export interface DeptQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: number;
  companyIds?: string[];
}

/** 部门类型 */
export interface DeptVO {
  /** 子部门 */
  children?: DeptVO[];
  /** 部门ID */
  id?: number;
  /** 部门名称 */
  departmentName?: string;
  /** 所有父部门ID */
  parentIds?: string;
  /** 父部门ID */
  parentId?: number;
  /** 排序 */
  departmentOrder?: number;
  /** 状态(1:启用；0:禁用) */
  status?: number;
  /** 部门备注 */
  remark?: string;
  /** 部门编码 */
  orgCode: string;
}

/** 部门表单类型 */
export interface DeptForm {
  children?: DeptVO[];
  /** 部门ID */
  id?: number;
  companyId?: number;
  /** 部门名称 */
  departmentName?: string;
  /** 所有父部门ID */
  parentIds?: string;
  /** 父部门ID */
  parentId?: number;
  /** 排序 */
  departmentOrder?: number;
  /** 状态(1:启用；0:禁用) */
  status?: number;
  /** 部门备注 */
  remark?: string;
  /** 部门编码 */
  orgCode: string;
  /** 父级部门编码 */
  parentOrgCode: string;
}

/**
 * 组件数据源
 */
interface OptionType {
  /** 值 */
  id: number;
  /** 文本 */
  menuName: string;
  /** 子列表  */
  children?: OptionType[];
}

/**
 * 获取部门列表
 *
 * @param queryParams 查询参数（可选）
 * @returns 部门树形表格数据
 */
export async function getList(queryParams?: DeptQuery) {
  return request.post<any, ResponseBody<DeptVO[]>>(`${Service.SYS}/dept/list_vo`, queryParams, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function getListById(roleId: number) {
  return request.get<any, ResponseBody>(`${Service.SYS}/dept/get`, {
    params: {
      id: roleId,
    },
  });
}

/** 获取部门下拉列表 */
export async function getOptions() {
  return request.get<any, ResponseBody<OptionType[]>>(`${Service.SYS}/dept/options`);
}

/**
 * 获取部门表单数据
 *
 * @param id 部门ID
 * @returns 部门表单数据
 */
export async function getFormData(id: string) {
  return request.get<any, ResponseBody<DeptForm>>(`${Service.SYS}/dept/get`, {
    params: {
      id: id,
    },
  });
}

/**
 * 新增部门
 *
 * @param data 部门表单数据
 * @returns 请求结果
 */
export async function add(data: DeptForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/dept/create`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 修改部门
 *
 * @param id 部门ID
 * @param data 部门表单数据
 * @returns 请求结果
 */
export async function update(data: DeptForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/dept/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 分配角色权限
 *
 * @param roleId 角色ID
 * @param data 菜单ID集合
 */
export async function updateDeptRole(deptId: number, data: number[]) {
  return request.post<any, ResponseBody>(
    `${Service.SYS}/dept/set_dept_role`,
    {
      deptId: deptId,
      roleIds: data,
    },
    { headers: { ...CONTENT_TYPE_APPLICATION_JSON } },
  );
}

/**
 * 删除部门
 *
 * @param ids 部门ID，多个以英文逗号(,)分隔
 * @returns 请求结果
 */
export async function deleteByIds(ids: number) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/dept/delete`, {
    params: {
      id: ids,
    },
  });
}
