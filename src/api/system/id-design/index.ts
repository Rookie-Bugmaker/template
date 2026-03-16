import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/** "自定义ID"基本对象 */
export interface IdDesign {
  /** 主键 */
  id?: number;
  /** 业务标识 */
  businessIdentifier?: string;
  /** 时间精确程度（0年 1月 2日 3时 4分 5秒） */
  timePrecision?: string;
  /** 时间格式 */
  timeFormat?: string;
  /** 时间位置 */
  timePosition?: number;
  /** 启用时间（0 启用 1不启用） */
  enableTime?: string;
  /** 唯一编码类型（0 UUID 1雪花ID 2流水号） */
  uniqueCodeType?: string;
  /** 流水号起始值 */
  serialNumberStart?: number;
  /** 流水号当前值 */
  serialNumberCurrent?: number;
  /** 流水号位数 */
  serialNumberDigits?: string;
  /** 唯一编码位置 */
  uniqueCodePosition?: number;
  /** 自定义字符串(a;b;c;d) */
  customString?: string;
  /** 字符串位置(1;2;3;4) */
  stringPosition?: string;
  /** 启用字符串（0 启用 1不启用） */
  enableString?: string;
  /** 分隔符 */
  spliceSeparator?: string;
}

/** "自定义ID"分页查询参数 */
export interface IdDesignPageQuery extends IdDesign, PageParams {}

/** "自定义ID"查询结果 */
export interface IdDesignResult extends IdDesign, BaseEntity {}

/**
 * 获取"自定义ID"分页
 *
 * @param params 查询参数（可选）
 * @returns "自定义ID"分页数据
 */
export async function getPage(params?: IdDesignPageQuery) {
  return request.get<any, ResponseBody<PageResult<IdDesignResult>>>(
    `${Service.SYS}/idDesign/page`,
    {
      params,
    },
  );
}

/**
 * 获取"自定义ID"列表
 *
 * @param params 查询参数（可选）
 * @returns "自定义ID"列表数据
 */
export async function getList(params?: IdDesign) {
  return request.get<any, ResponseBody<IdDesignResult[]>>(`${Service.SYS}/idDesign/query`, {
    params,
  });
}

/**
 * 获取"自定义ID"实体
 *
 * @param id 主键
 * @returns "自定义ID"实体
 */
export async function getById(id: number) {
  return request.get<any, ResponseBody<IdDesignResult>>(`${Service.SYS}/idDesign/get`, {
    params: { id },
  });
}

/**
 * 更新"自定义ID"实体
 *
 * @param queryParams 实体参数
 * @returns 是否修改成功
 */
export async function update(modifyParams: IdDesign) {
  return request.post<any, ResponseBody<boolean>>(`${Service.SYS}/idDesign/update`, modifyParams, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 创建"自定义ID"实体
 *
 * @param queryParams 实体参数
 * @returns 是否修改成功
 */
export async function add(modifyParams: IdDesign) {
  return request.post<any, ResponseBody<boolean>>(`${Service.SYS}/idDesign/create`, modifyParams, {
    headers: { ...CONTENT_TYPE_APPLICATION_JSON },
  });
}

/**
 * 更新"自定义ID"实体
 *
 * @param id 主键
 * @returns 是否修改成功
 */
export async function deleteById(id: string) {
  return request.delete<any, ResponseBody<boolean>>(`${Service.SYS}/idDesign/delete`, {
    params: { id },
  });
}
