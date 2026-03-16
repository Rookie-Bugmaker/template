import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 字典查询参数
 */
export interface DictPageQuery extends PageParams {
  /**
   * 关键字(字典名称/编码)
   */
  remark: string;
  dictName: string;
  dictCode: string;
  dictType: string;
}

/**
 * 字典分页对象
 */
export interface DictPageVO extends BaseEntity {
  /**
   * 字典ID
   */
  id: number;
  /**
   * 字典名称
   */
  dictName: string;
  /**
   * 字典编码
   */
  dictCode: string;
  /**
   * 字典类型
   */
  typeName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 字典状态（1-启用，0-禁用）
   */
  // status: number;
  /**
   * 字典项列表
   */
  dictItems: DictItem[];
}

/**
 * 字典项
 */
export interface DictItem {
  /**
   * 字典项ID
   */
  id?: number;
  /**
   * 字典项名称
   */
  itemName?: string;
  /**
   * 字典项值
   */
  itemCode?: string;
  /**
   * 排序
   */
  sorted?: number;
  /**
   * 说明
   */
  remark?: number;
  /**
   * 状态（1-启用，0-禁用）
   */
  // status?: number;
  /**
   * 字典ID
   */
  dictId: string;
}

// TypeScript 类型声明

/**
 * 字典
 */
export interface DictForm {
  /**
   * 字典ID
   */
  id?: number;
  /**
   * 字典名称
   */
  dictName?: string;
  /**
   * 字典编码
   */
  dictCode?: string;
  /**
   * 字典类型
   */
  dictType?: string;
  /**
   * 备注
   */
  remark?: string;
  createBy?: string;
}

/**
 * 字典对象
 */
export interface DictVO {
  /**
   * 字典名称
   */
  dictName: string;
  /**
   * 字典编码
   */
  dictCode: string;
  /**
   * 字典类型
   */
  dictType: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 字典项列表
   */
  items: DictItem[];
}

/**
 * 获取字典分页列表
 *
 * @param params 查询参数
 * @returns 字典分页结果
 */
export async function getPage(params: DictPageQuery) {
  return request.get<any, ResponseBody<PageResult<DictPageVO>>>(`${Service.SYS}/dict/page`, {
    params,
  });
}
/**
 * 获取字典分页列表
 *
 * @param params 查询参数
 * @returns 字典分页结果
 */
export async function getItemPage(params: DictPageQuery) {
  return request.get<any, ResponseBody<PageResult<DictItem>>>(`${Service.SYS}/dict/item/page`, {
    params,
  });
}
/**
 * 获取字典分页列表
 *
 * @param params 查询参数
 * @returns 字典分页结果
 */
export async function itemQuery(params: any) {
  return request.post<any, PageResult<any[]>>(`${Service.SYS}/dict/item/query`, params);
}
/**
 * 获取普通列表
 *
 */
export async function query(dictCode: any) {
  return request.get<any, ResponseBody<DictPageVO[]>>(`${Service.SYS}/dict/query`, {
    params: { dictCode },
  });
}
/**
 * 根据字典编码获取字典信息
 *
 */
export async function queryDict(dictCode: any) {
  return request.get<any, any>(`${Service.SYS}/global/dict/get`, {
    params: { dictCode },
  });
}
/**
 * 获取字典表单数据
 *
 * @param id 字典ID
 * @returns 字典表单数据
 */
export async function getFormData(id: number) {
  return request.get<any, ResponseBody<DictForm>>(`${Service.SYS}/dict/get`, {
    params: { id },
  });
}
export async function itemFormData(id: number) {
  return request.get<any, ResponseBody<DictForm>>(`${Service.SYS}/dict/item/get`, {
    params: { id },
  });
}

/**
 * 新增字典
 *
 * @param data 字典表单数据
 * @returns 请求结果
 */
export async function add(data: DictForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/dict/create`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

export async function addItem(data: any) {
  return request.post<any, ResponseBody>(`${Service.SYS}/dict/item/create`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 修改字典
 *
 * @param id 字典ID
 * @param data 字典表单数据
 * @returns 请求结果
 */
export async function update(data: DictForm) {
  return request.post<any, ResponseBody>(`${Service.SYS}/dict/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
export async function updateItem(data: any) {
  return request.post<any, ResponseBody>(`${Service.SYS}/dict/item/update`, data, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}
/**
 * 删除字典
 *
 * @param ids 字典ID，多个以英文逗号(,)分隔
 * @returns 请求结果
 */
export async function deleteByIds(ids: string) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/dict/delete`, {
    params: { id: ids },
  });
}
export async function deleteItemByIds(ids: string) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/dict/item/delete`, {
    params: { id: ids },
  });
}
/**
 * 获取字典的数据项
 *
 * @param typeCode 字典编码
 * @returns 字典数据项
 */
export async function getOptions(code: string) {
  return request.get<any, DictItem[]>(`${Service.SYS}/dict/${code}/options`);
}

// 导入
export async function importDict(params: FormData) {
  return request.post<FormData, ResponseBody<any>>(`${Service.SYS}/dict/importAll`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
