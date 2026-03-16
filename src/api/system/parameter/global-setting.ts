import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/** 全局设置实体 */
export interface GlobalSetting {
  /** 设置ID */
  settingId?: string;
  /** 设置名称 */
  settingName?: string;
  /** 设置项列表 */
  settingItems?: GlobalSettingItem[];
}

/** 全局设置项 */
export interface GlobalSettingItem {
  /** 项ID */
  settingItemId?: string;
  /** 项名称 */
  settingItemName?: string;
  /** 项类型 */
  settingItemType?: number;
  /** 排序号 */
  settingItemSorted?: number;
}

/** MongoDB分页参数 */
export interface MongoPage extends PageParams {
  /** 排序字段 */
  sortField?: string;
  /** 排序方式(asc/desc) */
  sortOrder?: string;
  /** 用于模糊查询settingId */
  settingId?: string;
  /** 用于模糊查询settingName */
  settingName?: string;
}

/**
 * 创建全局设置
 * @param globalSetting 全局设置实体
 * @returns 操作结果
 */
export async function add(globalSetting: GlobalSetting) {
  return request.post<any, ResponseBody>(`${Service.SYS}/globalSetting/create`, globalSetting, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 更新全局设置
 * @param globalSetting 全局设置实体
 * @returns 操作结果
 */
export async function update(globalSetting: GlobalSetting) {
  return request.post<any, ResponseBody>(`${Service.SYS}/globalSetting/update`, globalSetting, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 删除全局设置
 * @param settingId 设置ID
 * @returns 操作结果
 */
export async function deleteById(settingId: string) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/globalSetting/delete`, {
    params: { settingId },
  });
}

/**
 * 根据ID获取全局设置
 * @param settingId 设置ID
 * @returns 全局设置实体
 */
export async function getById(settingId: string) {
  return request.get<any, ResponseBody<GlobalSetting>>(`${Service.SYS}/globalSetting/get`, {
    params: { settingId },
  });
}

/**
 * 分页查询全局设置
 * @param pageRequest 分页参数
 * @returns 分页结果
 */
export async function getPage(pageRequest: MongoPage) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/page`, {
    params: pageRequest,
  });
}

/**
 * 导出模板
 * @returns 模板文件
 */
export async function exportTemplate() {
  return request.get<any, Blob>(`${Service.SYS}/globalSetting/template`, {
    responseType: 'blob',
  });
}

/**
 * 导入数据
 * @param file 导入文件
 * @returns 导入结果
 */
export async function importData(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<any, ResponseBody>(`${Service.SYS}/globalSetting/import`, formData);
}

/**
 * 导出数据
 * @param settingId 设置ID
 * @returns 导出的数据文件
 */
export async function exportData(settingId: string) {
  return request.get<any, Blob>(`${Service.SYS}/globalSetting/export`, {
    params: { settingId },
    responseType: 'blob',
  });
}
