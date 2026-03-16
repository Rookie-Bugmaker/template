import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/** 全局设置值实体 */
export interface GlobalSettingValue {
  /** ID */
  id?: string;
  /** 设置ID */
  settingId?: string;
  /** 项结果列表 */
  itemResults?: GlobalSettingItemResult[];
}

/** 全局设置项结果 */
export interface GlobalSettingItemResult {
  /** 项ID */
  settingItemId?: string;
  /** 结果值 */
  settingItemContent?: string;
}

/** MongoDB分页参数 */
export interface MongoItemPage extends PageParams {
  /** 排序字段 */
  sortField?: string;
  /** 排序方式(asc/desc) */
  sortOrder?: string;
  /** 用于模糊查询settingId */
  settingId?: string;
  /** 用于模糊查询settingItemId */
  settingItemId?: string;
  /** 用于模糊查询settingItemContent */
  settingItemContent?: string;
}

/**
 * 创建全局设置值
 * @param globalSettingValue 全局设置值实体
 * @returns 操作结果
 */
export async function addItem(globalSettingValue: GlobalSettingValue) {
  return request.post<any, ResponseBody>(
    `${Service.SYS}/globalSetting/value/create`,
    globalSettingValue,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

/**
 * 更新全局设置值
 * @param globalSettingValue 全局设置值实体
 * @returns 操作结果
 */
export async function updateItem(globalSettingValue: GlobalSettingValue) {
  return request.post<any, ResponseBody>(
    `${Service.SYS}/globalSetting/value/update`,
    globalSettingValue,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

/**
 * 删除全局设置值
 * @param id 设置值ID
 * @returns 操作结果
 */
export async function deleteItemById(id: string) {
  return request.delete<any, ResponseBody>(`${Service.SYS}/globalSetting/value/delete`, {
    params: { id },
  });
}

/**
 * 根据ID获取全局设置值
 * @param id 设置值ID
 * @returns 全局设置值实体
 */
export async function getItemById(id: string) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/getById`, {
    params: { id },
  });
}

/**
 * 根据设置ID获取全局设置值
 * @param settingId 设置ID
 * @returns 全局设置值实体
 */
export async function getItemBySettingId(settingId: string) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/getBySettingId`, {
    params: { settingId },
  });
}

/**
 * 获取所有全局设置值
 * @returns 全局设置值列表
 */
export async function getAll() {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/all`);
}

/**
 * 获取设置项的所有结果
 * @param settingId 设置ID
 * @returns 设置项结果列表
 */
export async function getAllItem(settingId: string) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/getRes/allItem`, {
    params: { settingId },
  });
}

/**
 * 精确匹配查询设置项
 * @param settingId 设置ID
 * @param settingItemId 设置项ID
 * @param settingItemContent 设置项内容
 * @returns 匹配结果
 */
export async function getItemByCode(
  settingId: string,
  settingItemId: string,
  settingItemContent: string,
) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/match/get`, {
    params: {
      settingId,
      settingItemId,
      settingItemContent,
    },
  });
}

/**
 * 模糊匹配查询设置项
 * @param settingId 设置ID
 * @param settingItemId 设置项ID
 * @param settingItemContent 设置项内容
 * @returns 匹配结果
 */
export async function likeItemByCode(
  settingId: string,
  settingItemId: string,
  settingItemContent: string,
) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/match/like`, {
    params: {
      settingId,
      settingItemId,
      settingItemContent,
    },
  });
}

/**
 * 分页查询全局设置值
 * @param pageRequest 分页参数
 * @returns 分页结果
 */
export async function getItemByPage(pageRequest: MongoItemPage) {
  return request.get<any, ResponseBody>(`${Service.SYS}/globalSetting/value/page`, {
    params: pageRequest,
  });
}

/**
 * 导出模板
 * @returns 模板文件
 */
export async function exportItemTemplate(settingId: string) {
  return request.get<any, Blob>(`${Service.SYS}/globalSetting/value/template`, {
    params: { settingId },
    responseType: 'blob',
  });
}

/**
 * 导入数据
 * @param file 导入文件
 * @param settingId 设置ID
 * @returns 导入结果
 */
export async function importItemData(file: File, settingId: string) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<any, ResponseBody>(`${Service.SYS}/globalSetting/value/import`, formData, {
    params: { settingId },
  });
}

/**
 * 导出数据
 * @param settingId 设置ID
 * @returns 导出的数据文件
 */
export async function exportItemData(settingId: string) {
  return request.get<any, Blob>(`${Service.SYS}/globalSetting/value/export`, {
    params: { settingId },
    responseType: 'blob',
  });
}
